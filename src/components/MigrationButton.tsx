import React from 'react';
import { supabase } from '../lib/supabase';

const MigrationButton = () => {
  const runMigration = async () => {
    console.log('Starting Supabase migration...');

    try {
      // First migrate companies
      const companyIds = await migrateCompanies();

      // Then migrate opportunities
      await migrateOpportunities(companyIds);

      console.log('Migration completed successfully!');
    } catch (error) {
      console.error('Migration failed:', error);
    }
  };

  const migrateCompanies = async () => {
    console.log('Starting company migration...');

    const mockCompanies = [
      {
        email: 'hr@techcorp.com',
        name: 'TechCorp Solutions',
        role: 'COMPANY',
        bio: 'Leading technology company specializing in AI and machine learning solutions.',
        avatar: null,
      },
      {
        email: 'careers@dataflow.com',
        name: 'DataFlow Analytics',
        role: 'COMPANY',
        bio: 'Data science consulting firm helping businesses make data-driven decisions.',
        avatar: null,
      },
      {
        email: 'jobs@innovateai.com',
        name: 'InnovateAI',
        role: 'COMPANY',
        bio: 'Innovative AI company focused on natural language processing and chatbot development.',
        avatar: null,
      },
    ];

    const companyIds: Record<string, string> = {};

    for (const company of mockCompanies) {
      try {
        const { data: existingCompany } = await supabase
          .from('users')
          .select('id')
          .eq('email', company.email)
          .single();

        if (existingCompany) {
          console.log(`Company ${company.name} already exists, skipping...`);
          companyIds[company.name] = existingCompany.id;
          continue;
        }

        const { data: newCompany, error } = await supabase
          .from('users')
          .insert({
            email: company.email,
            name: company.name,
            role: company.role,
            bio: company.bio,
            avatar: company.avatar,
          })
          .select()
          .single();

        if (error) {
          console.error(`Error creating company ${company.name}:`, error);
          continue;
        }

        console.log(`Successfully created company: ${company.name} (ID: ${newCompany.id})`);
        companyIds[company.name] = newCompany.id;
      } catch (error) {
        console.error(`Error processing company ${company.name}:`, error);
      }
    }

    return companyIds;
  };

  const migrateOpportunities = async (companyIds: Record<string, string>) => {
    console.log('Starting opportunities migration...');

    const mockOpportunities = [
      {
        title: 'Senior AI Engineer',
        description: 'We are looking for a Senior AI Engineer to join our team and help develop cutting-edge machine learning solutions. The ideal candidate will have experience with Python, TensorFlow, and cloud platforms.',
        requiredSkills: ['Python', 'TensorFlow', 'Machine Learning', 'AWS', 'Docker'],
        budget: { min: 80000, max: 120000, currency: 'EUR' },
        contactInfo: {
          email: 'hr@techcorp.com',
          phone: '+49 40 123 456 789',
          linkedin: 'https://linkedin.com/company/techcorp',
        },
        deadline: '2024-12-31',
        duration: 'Full-time',
        location: 'Hamburg, Germany',
        type: 'full-time',
        experienceLevel: 'senior',
        companyName: 'TechCorp Solutions',
      },
      {
        title: 'Data Scientist Consultant',
        description: 'Seeking a Data Scientist to work on client projects involving predictive analytics, data visualization, and statistical modeling. Remote work possible.',
        requiredSkills: ['R', 'Python', 'SQL', 'Tableau', 'Statistics'],
        budget: { min: 60000, max: 90000, currency: 'EUR' },
        contactInfo: {
          email: 'careers@dataflow.com',
          phone: '+49 30 987 654 321',
          linkedin: 'https://linkedin.com/company/dataflow',
        },
        deadline: '2024-11-30',
        duration: 'Contract (6 months)',
        location: 'Berlin, Germany',
        type: 'contract',
        experienceLevel: 'intermediate',
        companyName: 'DataFlow Analytics',
      },
      {
        title: 'NLP Specialist',
        description: 'Join our NLP team to develop advanced language processing models and chatbot solutions. Experience with transformer models and large language models preferred.',
        requiredSkills: ['NLP', 'PyTorch', 'Transformers', 'BERT', 'ChatGPT API'],
        budget: { min: 70000, max: 110000, currency: 'EUR' },
        contactInfo: {
          email: 'jobs@innovateai.com',
          phone: '+49 89 456 789 123',
          linkedin: 'https://linkedin.com/company/innovateai',
        },
        deadline: '2024-12-15',
        duration: 'Full-time',
        location: 'Munich, Germany',
        type: 'full-time',
        experienceLevel: 'senior',
        companyName: 'InnovateAI',
      },
    ];

    for (const opportunity of mockOpportunities) {
      try {
        const companyId = companyIds[opportunity.companyName];
        if (!companyId) {
          console.log(`Skipping opportunity ${opportunity.title} - no company ID for ${opportunity.companyName}`);
          continue;
        }

        const { data: existingOpportunity } = await supabase
          .from('opportunities')
          .select('id')
          .eq('title', opportunity.title)
          .eq('created_by_id', companyId)
          .single();

        if (existingOpportunity) {
          console.log(`Opportunity ${opportunity.title} already exists, skipping...`);
          continue;
        }

        const opportunityData = {
          title: opportunity.title,
          description: opportunity.description,
          required_skills: opportunity.requiredSkills,
          budget_min: opportunity.budget?.min || null,
          budget_max: opportunity.budget?.max || null,
          budget_currency: opportunity.budget?.currency || 'EUR',
          contact_email: opportunity.contactInfo.email,
          contact_phone: opportunity.contactInfo.phone || null,
          contact_linkedin: opportunity.contactInfo.linkedin || null,
          deadline: opportunity.deadline,
          duration: opportunity.duration,
          location: opportunity.location || null,
          type: opportunity.type.toUpperCase().replace('-', '_'),
          experience_level: opportunity.experienceLevel.toUpperCase(),
          status: 'ACTIVE',
          created_by_id: companyId,
        };

        const { data: newOpportunity, error } = await supabase
          .from('opportunities')
          .insert(opportunityData)
          .select()
          .single();

        if (error) {
          console.error(`Error creating opportunity ${opportunity.title}:`, error);
          continue;
        }

        console.log(`Successfully created opportunity: ${opportunity.title} (ID: ${newOpportunity.id})`);
      } catch (error) {
        console.error(`Error processing opportunity ${opportunity.title}:`, error);
      }
    }
  };

  return (
    <button
      onClick={runMigration}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Run Migration
    </button>
  );
};

export default MigrationButton;
