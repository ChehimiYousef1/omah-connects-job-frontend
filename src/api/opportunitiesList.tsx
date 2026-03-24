import { useEffect, useState } from 'react'
import { getOpportunities } from './opportunitiesApi'

interface Opportunity {
  id: number | string
  title: string
}

function OpportunitiesList() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOpportunities() {
      try {
        const res = await getOpportunities()
        if (res.success) {
          setOpportunities(res.data)
        } else {
          setError(res.error || 'Failed to fetch opportunities')
        }
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchOpportunities()
  }, [])

  // Loading and error states
  if (loading) {
    return <div>Loading opportunities...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  // Main JSX return
  return (
    <div>
      {opportunities.length > 0 ? (
        opportunities.map((o) => <div key={o.id}>{o.title}</div>)
      ) : (
        <div>No opportunities found</div>
      )}
    </div>
  )
} // <-- This closes the component function

export default OpportunitiesList
