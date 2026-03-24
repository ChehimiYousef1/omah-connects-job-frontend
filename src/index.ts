import { testConnection } from './db';
import { getAllOpportunities, createOpportunity } from './opportunitiesService';

async function main() {
  await testConnection();

  // Create a new opportunity
  const newOpp = await createOpportunity({
    title: 'Senior AI Developer',
    description: 'Develop AI solutions for our clients',
    createdBy: 'user-123', // your user id
  });
  console.log('Created Opportunity:', newOpp);

  // Get all opportunities
  const allOpps = await getAllOpportunities();
  console.log('Opportunities:', allOpps);
}

main().catch(console.error);
