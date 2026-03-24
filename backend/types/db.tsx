export interface OpportunityInsert {
  title: string;
  description: string;
  created_by_id: string;
  contact_email: string;
  required_skills?: string[];
  budget_min?: number;
  budget_max?: number;
  budget_currency?: string;
  contact_linkedin?: string;
  deadline?: string | Date;
  duration?: string;
  location?: string;
  type?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE';
  experience_level?: 'JUNIOR' | 'INTERMEDIATE' | 'SENIOR' | 'EXPERT';
  status?: 'ACTIVE' | 'CLOSED' | 'DRAFT';
}

export interface Opportunity extends OpportunityInsert {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'FREELANCER' | 'COMPANY';
  bio?: string;
  skills?: string;
  avatar?: string;
  created_at: Date;
}

export interface Application {
  id: string;
  opportunity_id: string;
  user_id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  cover_letter?: string;
  created_at: Date;
  updated_at?: Date;
}
