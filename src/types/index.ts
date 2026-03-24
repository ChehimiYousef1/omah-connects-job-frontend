export interface Opportunity {
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
}