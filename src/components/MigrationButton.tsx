import React, { useState } from 'react';
import { mockCompanies, mockOpportunities } from '../data/mockData';

// Simple in-memory store (persists in localStorage)
const STORAGE_KEYS = {
  companies: 'mock_db_companies',
  opportunities: 'mock_db_opportunities',
};

type Company = {
  id: string;
  email: string;
  name: string;
  role: string;
  bio: string;
  avatar: null;
};

type OpportunityRecord = {
  id: string;
  title: string;
  description: string;
  required_skills: string[];
  budget_min: number | null;
  budget_max: number | null;
  budget_currency: string;
  contact_email: string;
  contact_phone: string | null;
  contact_linkedin: string | null;
  deadline: string;
  duration: string;
  location: string | null;
  type: string;
  experience_level: string;
  status: string;
  created_by_id: string;
};

// Helper: load from localStorage
const loadStore = <T,>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
};

// Helper: save to localStorage
const saveStore = <T,>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Helper: generate a simple unique ID
const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const MigrationButton = () => {
  const [status, setStatus] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const log = (message: string) =>
    setStatus((prev) => [...prev, message]);

  const runMigration = async () => {
    setStatus([]);
    setRunning(true);
    log('Starting migration...');

    try {
      const companyIds = await migrateCompanies();
      await migrateOpportunities(companyIds);
      log('✅ Migration completed successfully!');
    } catch (err) {
      log(`❌ Migration failed: ${String(err)}`);
      console.error('Migration failed:', err);
    } finally {
      setRunning(false);
    }
  };

  const migrateCompanies = async (): Promise<Record<string, string>> => {
    log('Migrating companies...');

    const existing = loadStore<Company>(STORAGE_KEYS.companies);
    const companyIds: Record<string, string> = {};

    for (const company of mockCompanies) {
      const found = existing.find((c) => c.email === company.email);

      if (found) {
        log(`⚠️ Company "${company.name}" already exists, skipping.`);
        companyIds[company.name] = found.id;
        continue;
      }

      const newCompany: Company = { ...company, id: generateId() };
      existing.push(newCompany);
      companyIds[company.name] = newCompany.id;
      log(`✅ Created company: ${company.name} (ID: ${newCompany.id})`);
    }

    saveStore(STORAGE_KEYS.companies, existing);
    return companyIds;
  };

  const migrateOpportunities = async (
    companyIds: Record<string, string>,
  ): Promise<void> => {
    log('Migrating opportunities...');

    const existing = loadStore<OpportunityRecord>(STORAGE_KEYS.opportunities);

    for (const opportunity of mockOpportunities) {
      const companyId = companyIds[opportunity.companyName];

      if (!companyId) {
        log(`⚠️ Skipping "${opportunity.title}" — no company ID for "${opportunity.companyName}"`);
        continue;
      }

      const alreadyExists = existing.some(
        (o) => o.title === opportunity.title && o.created_by_id === companyId,
      );

      if (alreadyExists) {
        log(`⚠️ Opportunity "${opportunity.title}" already exists, skipping.`);
        continue;
      }

      const newOpportunity: OpportunityRecord = {
        id: generateId(),
        title: opportunity.title,
        description: opportunity.description,
        required_skills: opportunity.requiredSkills,
        budget_min: opportunity.budget?.min ?? null,
        budget_max: opportunity.budget?.max ?? null,
        budget_currency: opportunity.budget?.currency ?? 'EUR',
        contact_email: opportunity.contactInfo.email,
        contact_phone: opportunity.contactInfo.phone ?? null,
        contact_linkedin: opportunity.contactInfo.linkedin ?? null,
        deadline: opportunity.deadline,
        duration: opportunity.duration,
        location: opportunity.location ?? null,
        type: opportunity.type.toUpperCase().replace('-', '_'),
        experience_level: opportunity.experienceLevel.toUpperCase(),
        status: 'ACTIVE',
        created_by_id: companyId,
      };

      existing.push(newOpportunity);
      log(`✅ Created opportunity: ${opportunity.title} (ID: ${newOpportunity.id})`);
    }

    saveStore(STORAGE_KEYS.opportunities, existing);
  };

  const clearData = () => {
    localStorage.removeItem(STORAGE_KEYS.companies);
    localStorage.removeItem(STORAGE_KEYS.opportunities);
    setStatus(['🗑️ All migration data cleared.']);
  };

  return (
    <div className="p-4 space-y-4 max-w-xl">
      <div className="flex gap-3">
        <button
          onClick={runMigration}
          disabled={running}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {running ? 'Running...' : 'Run Migration'}
        </button>

        <button
          onClick={clearData}
          disabled={running}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Clear Data
        </button>
      </div>

      {status.length > 0 && (
        <div className="bg-gray-900 text-green-400 rounded-xl p-4 text-sm font-mono space-y-1 max-h-64 overflow-y-auto">
          {status.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default MigrationButton;