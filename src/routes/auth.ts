import express from 'express';
import sql from 'mssql';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { URLSearchParams } from 'url';
import { fileURLToPath } from 'url';

dotenv.config();
const router = express.Router();

/* ===========================
   ES MODULE __dirname FIX
=========================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===========================
   Interfaces
=========================== */
interface MicrosoftUser {
  displayName?: string;
  mail?: string;
  userPrincipalName?: string;
}

interface TokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

/* ===========================
   SQL Server configuration
=========================== */
const sqlConfig: sql.config = {
  user: process.env.DB_USER || 'omah_jobs',
  password: process.env.DB_PASSWORD || '',
  server: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'omah_jobs',
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

/* ===========================
   STEP 1: Redirect to Microsoft
=========================== */
router.get('/microsoft', (req, res) => {
  try {
    if (!process.env.MICROSOFT_CLIENT_ID || !process.env.MICROSOFT_REDIRECT_URI) {
      console.error('Missing Microsoft OAuth configuration');
      return res.status(500).send('Microsoft OAuth not configured');
    }

    // Generate CSRF protection state token
    const state = crypto.randomBytes(16).toString('hex');

    const params = new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID,
      response_type: 'code',
      redirect_uri: process.env.MICROSOFT_REDIRECT_URI,
      response_mode: 'query',
      scope: 'openid profile email User.Read',
      prompt: 'select_account',
      state,
    });

    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
    console.log('Redirecting to Microsoft login');
    res.redirect(authUrl);
  } catch (error) {
    console.error('Error initiating Microsoft login:', error);
    res.status(500).send('Failed to initiate Microsoft login');
  }
});

/* ===========================
   STEP 2: Callback
=========================== */
router.get('/microsoft/callback', async (req, res) => {
  let pool: sql.ConnectionPool | null = null;

  try {
    const code = req.query.code as string;
    const error = req.query.error as string;
    
    // Handle user cancellation or errors from Microsoft
    if (error) {
      console.error('Microsoft OAuth error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(error)}`);
    }

    if (!code) {
      console.error('Missing authorization code');
      return res.status(400).send('Missing authorization code');
    }

    /* -------- Exchange code for token -------- */
    console.log('Exchanging authorization code for access token');
    
    const tokenRes = await fetch(
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.MICROSOFT_CLIENT_ID || '',
          client_secret: process.env.MICROSOFT_CLIENT_SECRET || '',
          code,
          redirect_uri: process.env.MICROSOFT_REDIRECT_URI || '',
          grant_type: 'authorization_code',
        }),
      }
    );

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error('Token exchange failed:', errorText);
      throw new Error(`Token exchange failed: ${tokenRes.status}`);
    }

    const tokenData = (await tokenRes.json()) as TokenResponse;
    
    if (!tokenData.access_token) {
      console.error('No access token received:', tokenData);
      throw new Error(tokenData.error_description || 'No access token received');
    }

    console.log('Access token obtained successfully');

    /* -------- Get Microsoft user profile -------- */
    console.log('Fetching user profile from Microsoft Graph');
    
    const userRes = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userRes.ok) {
      const errorText = await userRes.text();
      console.error('Failed to fetch user profile:', errorText);
      throw new Error('Failed to fetch Microsoft profile');
    }

    const msUser = (await userRes.json()) as MicrosoftUser;

    const email = msUser.mail || msUser.userPrincipalName;
    const name = msUser.displayName || 'Unknown User';

    if (!email) {
      console.error('Email missing from Microsoft account');
      throw new Error('Email missing from Microsoft account');
    }

    console.log(`User authenticated: ${email}`);

    /* -------- Avatar handling -------- */
    const imagesDir = path.join(__dirname, '..', 'images');
    
    // Ensure images directory exists
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
    const avatarFile = `${safeName}.png`;
    const avatarPath = path.join(imagesDir, avatarFile);
    const avatarPublicPath = `/images/${avatarFile}`;

    try {
      const avatarRes = await fetch(
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=random`
      );
      
      if (avatarRes.ok) {
        const buffer = Buffer.from(await avatarRes.arrayBuffer());
        fs.writeFileSync(avatarPath, buffer);
        console.log(`Avatar saved: ${avatarFile}`);
      } else {
        console.warn('Avatar fetch failed, using default');
      }
    } catch (avatarError) {
      console.warn('Avatar generation error:', avatarError);
      // Continue without avatar - it's not critical
    }

    /* -------- Database operations -------- */
    console.log('Connecting to database');
    pool = await sql.connect(sqlConfig);

    await pool
      .request()
      .input('email', sql.NVarChar(255), email)
      .input('name', sql.NVarChar(255), name)
      .input('avatar', sql.NVarChar(500), avatarPublicPath)
      .query(`
        MERGE users AS target
        USING (SELECT @email AS email) AS source
        ON target.email = source.email
        WHEN MATCHED THEN
          UPDATE SET 
            name = @name, 
            avatar = @avatar, 
            updated_at = SYSDATETIME()
        WHEN NOT MATCHED THEN
          INSERT (id, email, name, role, avatar, created_at, updated_at)
          VALUES (
            NEWID(), 
            @email, 
            @name, 
            'FREELANCER', 
            @avatar, 
            SYSDATETIME(), 
            SYSDATETIME()
          );
      `);

    console.log(`User ${email} saved to database`);

    /* -------- Redirect to frontend -------- */
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/feed`;
    
    console.log(`Redirecting to: ${redirectUrl}`);
    res.redirect(redirectUrl);

  } catch (err) {
    console.error('Microsoft OAuth callback error:', err);
    
    // Redirect to frontend with error
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    res.redirect(`${frontendUrl}/login?error=authentication_failed`);
    
  } finally {
    // Always clean up database connection
    if (pool) {
      try {
        await pool.close();
        console.log('Database connection closed');
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
  }
});

export default router;