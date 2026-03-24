import { useEffect, useState } from 'react'
import { getOpportunities } from '../api/opportunitiesApi'

function OpportunitiesList() {
  const [opportunities, setOpportunities] = useState([])

  useEffect(() => {
    getOpportunities().then((res) => {
      if (res.success) setOpportunities(res.data)
    })
  }, [])

  return (
    <div>
      {opportunities.map((o: any) => (
        <div key={o.id}>{o.title}</div>
      ))}
    </div>
  )
}

export default OpportunitiesList
