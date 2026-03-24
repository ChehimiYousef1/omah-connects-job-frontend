interface Opportunity {
  id: string
  title: string
  description: string
}

let opportunities: Opportunity[] = [
  { id: '1', title: 'Frontend Developer', description: 'React + TypeScript' },
  { id: '2', title: 'Backend Developer', description: 'Node.js + Express' },
]

export const opportunitiesApi = {
  getAll: async () => {
    return { success: true, data: opportunities }
  },

  getById: async (id: string) => {
    const opp = opportunities.find((o) => o.id === id)
    return { success: !!opp, data: opp || null }
  },

  create: async (data: Partial<Opportunity>) => {
    const newOpp = { id: `${opportunities.length + 1}`, ...data } as Opportunity
    opportunities.push(newOpp)
    return { success: true, data: newOpp }
  },

  update: async (id: string, data: Partial<Opportunity>) => {
    const index = opportunities.findIndex((o) => o.id === id)
    if (index === -1) return { success: false, data: null }

    opportunities[index] = { ...opportunities[index], ...data }
    return { success: true, data: opportunities[index] }
  },

  delete: async (id: string) => {
    const index = opportunities.findIndex((o) => o.id === id)
    if (index === -1) return { success: false, data: null }

    const deleted = opportunities.splice(index, 1)[0]
    return { success: true, data: deleted }
  },
}
