import { useResidences } from "../hooks/queries/useResidenceQueries"
import ResidencesTable from "../components/residences/ResidencesTable"

export default function Residences() {
  const { data: residences, isLoading, error } = useResidences({})
  
  
  return (
        <ResidencesTable />
  )
}
