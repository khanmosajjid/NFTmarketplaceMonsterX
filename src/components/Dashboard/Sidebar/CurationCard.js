import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import {collectionServices} from "../../../services/supplier"

function CurationCard({item}) {
  const [info, setInfo] = useState()
  const navigate = useNavigate()

  const getCollectionInfo = async () => {
    const {data: {collection}} = await collectionServices.getCollectionInfo(item?._id)
    setInfo(collection)
  }

  useEffect(() => {
    getCollectionInfo()
  }, [])
  return (
    <div
      className="col-xxl-4 col-xl-6 col-lg-4 col-md-6"
      onClick={() => navigate("/dashboard/curation/" + item._id)}
    >
      <div className="curation__card__blk">
        <div className="curation__thumb">
          <img className="w-full !aspect-square !object-cover" src={item.logo} alt="" />
          {/* <ion-icon name="heart" className="click_heart">
                  <div className="red-bg" />
                </ion-icon> */}
        </div>
        <div className="curation__content">
          <h5>{item.name}</h5>
          <div className="curation__card__bottom">
            <div className="single__curation__categorie">
              <p>Artworks</p>
              <h6>{info?.nftCount}</h6>
            </div>
            <div className="single__curation__categorie">
              <p>Artists</p>
              <h6>{info?.artistCount}</h6>
            </div>
            <div className="single__curation__categorie">
              <p>Volume</p>
              <h6>
                <span>
                  <img src="assets/img/MATIC.png" className="h-6 w-6 p-1 grayscale brightness-200 rounded-full border border-white" alt="" />
                </span>{" "}
                {Number(info?.totalVolume).toFixed(2)} MATIC
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurationCard
