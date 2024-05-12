import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { collectionServices } from "../../../services/supplier"
import CurationCard from "../Sidebar/CurationCard"

function Curation({tab, searchInput, filter}) {
  const [curation, setCuration] = useState([])

  const getAllCurations = async () => {
    const {data} = await collectionServices.getAllCollections({searchInput, filter: filter.filter})
    setCuration(data.curations)
  }

  const getUserCurations = async () => {
    const {data} = await collectionServices.getUserCollections({searchInput, filter: filter.filter})
    setCuration(data.collection)
  }

  useEffect(() => {
    if(tab==="Profile")
    getUserCurations()
    else getAllCurations()
  }, [tab,searchInput,filter])

  return (
    <div className="curation__area">
      <div className="row g-4">
        {curation.length>0 && curation.filter((item)=>(!item?.active && !item?.owner?.active)).map((item) => (
          <CurationCard item={item}/>
        ))}
      </div>
    </div>
  )
}

export default Curation
