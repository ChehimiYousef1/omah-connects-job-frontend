const API_URL = 'http://localhost:3001/api/opportunities'

export async function getOpportunities() {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error('Failed to fetch opportunities')
  return res.json()
}

export async function getOpportunityById(id: string) {
  const res = await fetch(`${API_URL}/${id}`)
  if (!res.ok) throw new Error('Failed to fetch opportunity')
  return res.json()
}

export async function createOpportunity(data: any) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create opportunity')
  return res.json()
}
