import express from 'express';
import sql from 'mssql';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { URLSearchParams } from 'url';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

dotenv.config(); // Load once
const router = express.Router();

// =========================
// ES MODULE __dirname FIX
// =========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
// SQL Server config
// =========================
const sqlConfig: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_HOST!,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT) || 1433,
  options: { encrypt: true, trustServerCertificate: true, enableArithAbort: true },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
};

let pool: sql.ConnectionPool | null = null;
const getPool = async () => {
  if (!pool) {
    pool = await sql.connect(sqlConfig);
    pool.on('error', (err) => {
      console.error('SQL Pool Error:', err);
      pool = null;
    });
  }
  return pool;
};

// =========================
// State store for OAuth
// =========================
const stateStore = new Map<string, number>();
setInterval(() => {
  const now = Date.now();
  for (const [state, ts] of stateStore.entries()) {
    if (now - ts > 600000) stateStore.delete(state); // 10 min expiry
  }
}, 600000);

// =========================
// Step 1: Redirect to Microsoft
// =========================
router.get('/microsoft', (_req, res) => {
  if (!process.env.MICROSOFT_CLIENT_ID || !process.env.MICROSOFT_REDIRECT_URI)
    return res.status(500).send('Microsoft OAuth not configured');

  const state = crypto.randomBytes(16).toString('hex');
  stateStore.set(state, Date.now());

  const params = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: process.env.MICROSOFT_REDIRECT_URI!,
    response_mode: 'query',
    scope: 'openid profile email User.Read',
    prompt: 'select_account',
    state,
  });

  res.redirect(`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`);
});

// =========================
// Step 2: Callback
// =========================
router.get('/microsoft/callback', async (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  try {
    const { code, state, error, error_description } = req.query as Record<string, string>;

    if (state && !stateStore.has(state)) {
      return res.redirect(`${frontendUrl}/login?error=invalid_state`);
    }
    if (state) stateStore.delete(state);

    if (error) return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(error)}`);

    if (!code) return res.redirect(`${frontendUrl}/login?error=missing_code`);

    const tokenParams = new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID!,
      client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
      code,
      redirect_uri: process.env.MICROSOFT_REDIRECT_URI!,
      grant_type: 'authorization_code',
    });

    const tokenRes = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: tokenParams.toString(),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      return res.redirect(
        `${frontendUrl}/login?error=token_exchange_failed&code=${encodeURIComponent(tokenData.error || 'unknown')}`
      );
    }

    // Fetch Microsoft profile
    const userRes = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const msUser = await userRes.json();

    const email = msUser.mail || msUser.userPrincipalName;
    const name = msUser.displayName || 'Unknown User';

    if (!email) return res.redirect(`${frontendUrl}/login?error=email_missing`);

    // Save avatar
    const imagesDir = path.join(__dirname, '..', '..', 'images');
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

    const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
    const avatarFile = `${safeName}.png`;
    const avatarPath = path.join(imagesDir, avatarFile);
    const avatarPublicPath = `/images/${avatarFile}`;

    try {
      const avatarRes = await fetch(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200`);
      if (avatarRes.ok) fs.writeFileSync(avatarPath, Buffer.from(await avatarRes.arrayBuffer()));
    } catch {}

    // Save user to DB
    const dbPool = await getPool();
    const result = await dbPool
      .request()
      .input('email', sql.NVarChar(255), email)
      .input('name', sql.NVarChar(255), name)
      .input('avatar', sql.NVarChar(500), avatarPublicPath)
      .query(`
        MERGE users AS target
        USING (SELECT @email AS email) AS source
        ON target.email = source.email
        WHEN MATCHED THEN
          UPDATE SET name=@name, avatar=@avatar, updated_at=SYSDATETIME()
        WHEN NOT MATCHED THEN
          INSERT (id,email,name,role,avatar,created_at,updated_at)
          VALUES (NEWID(),@email,@name,'FREELANCER',@avatar,SYSDATETIME(),SYSDATETIME());
        SELECT id,email,name,role,avatar FROM users WHERE email=@email;
      `);

    const user = result.recordset[0];

    // Create JWT and cookie
    const jwtToken = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });
    res.cookie('auth_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.redirect(`${frontendUrl}/social/feed`);
  } catch (err) {
    console.error('Authentication error:', err);
    res.redirect(`${frontendUrl}/login?error=authentication_failed`);
  }
});

// =========================
// Step 3: Logout
// =========================
router.post('/logout', (_req, res) => {
  res.clearCookie('auth_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
  res.json({ success: true, message: 'Logged out successfully' });
});

// =========================
// Step 4: Current user
// =========================
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ success: false, error: 'Not authenticated' });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const dbPool = await getPool();
    const result = await dbPool.request().input('userId', sql.UniqueIdentifier, decoded.userId)
      .query('SELECT id,email,name,role,avatar FROM users WHERE id=@userId');

    if (!result.recordset[0]) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, user: result.recordset[0] });
  } catch (err) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
});

export default router;
