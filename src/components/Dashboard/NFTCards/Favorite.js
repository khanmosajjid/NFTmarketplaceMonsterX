import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import {FavoriteService} from "../../../services/supplier"

function Favorite({searchInput, filter}) {
  const navigate = useNavigate()
  const [nfts, setNfts] = useState([])
  const [artists, setArtist] = useState([])
  const [curations, setCurations] = useState([])

  const getData = async () => {
    try {
      const favoriteService = new FavoriteService()
      const {
        data: {nfts},
      } = await favoriteService.getUserLikedNfts({
        searchInput: searchInput ? searchInput : "",
        filter: filter.filter
      })
      const {
        data: {curations},
      } = await favoriteService.getUserLikedCollections({
        searchInput: searchInput ? searchInput : "",
      })
      const {
        data: {artists},
      } = await favoriteService.getUserLikedArtits({
        searchInput: searchInput ? searchInput : "",
      })
      setArtist(artists)
      setNfts(nfts)
      setCurations(curations)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData()
  }, [searchInput, filter])
  return (
    <div className="categorie__tabs__area">
      <div className="nav nav-tabs" id="nav-tab" role="tablist">
        <button
          className="nav-link active"
          id="nav-home-tab"
          data-bs-toggle="tab"
          data-bs-target="#nav-home"
          type="button"
          role="tab"
          aria-controls="nav-home"
          aria-selected="true"
        >
          NFTS
        </button>
        <button
          className="nav-link"
          id="nav-profile-tab"
          data-bs-toggle="tab"
          data-bs-target="#nav-profile"
          type="button"
          role="tab"
          aria-controls="nav-profile"
          aria-selected="false"
        >
          Curation
        </button>
        <button
          className="nav-link"
          id="nav-contact-tab"
          data-bs-toggle="tab"
          data-bs-target="#nav-contact"
          type="button"
          role="tab"
          aria-controls="nav-contact"
          aria-selected="false"
        >
          Artist
        </button>
      </div>
      <div className="tab-content" id="nav-tabContent">
        <div
          className="tab-pane fade show active"
          id="nav-home"
          role="tabpanel"
          aria-labelledby="nav-home-tab"
        >
          <div className="categorie__card__blk">
            <div className="row g-4">
              {nfts?.length > 0 &&
                nfts.filter((nft)=>(!nft?.nftId?.active && !nft.nftId?.owner?.active && !nft.nftId?.curationInfo?.active )).map((nft, index) => {
                    return (
                      <div
                        className="col-lg-3 col-md-4 col-sm-6"
                        onClick={() =>
                          navigate("/dashboard/nft/" + nft?.nftId?._id)
                        }
                      >
                        <div className="single__sport__blk">
                          <div className="sport__thumb">
                            <img className="w-full !aspect-[4/3] !object-cover" src={nft?.nftId?.cloudinaryUrl} alt="" />
                          </div>
                          <div className="sport__content">
                            <h5>{nft?.nftId?.name}</h5>
                            <p>
                              Created by:{" "}
                              <span className="!font-azeret">{nft?.nftId?.mintedBy?.username}</span>
                            </p>
                            <p className="!font-bold underline !text-[#CCCCCC] !italic !text-sm">
                              {nft?.nftId?.curation?.name}
                            </p>
                            <h4>
                              Price{" "}
                              <span>
                                <img src="assets/img/MATIC.png" className="h-6 w-6 p-1 grayscale brightness-200 rounded-full border border-white" alt="" />{" "}
                                {nft?.nftId?.price} MATIC
                              </span>
                            </h4>
                          </div>
                        </div>
                      </div>
                    )
                })}
            </div>
          </div>
        </div>
        <div
          className="tab-pane fade"
          id="nav-profile"
          role="tabpanel"
          aria-labelledby="nav-profile-tab"
        >
          <div className="curation__area">
            <div className="row g-4">
              {curations.filter(item=>item.collectionId)?.map((curation, index) => (
                <div className="col-xxl-4 col-xl-6 col-lg-4 col-md-6" onClick={()=>navigate('/dashboard/curation/'+curation?.collectionId?._id)}>
                  <div className="curation__card__blk">
                    <div className="curation__thumb">
                      <img src={curation?.collectionId?.logo} alt="" />
                      <ion-icon name="heart" className="click_heart">
                        <div className="red-bg" />
                      </ion-icon>
                    </div>
                    <div className="curation__content">
                      <h5>{curation?.collectionId?.name}</h5>
                      <div className="curation__card__bottom">
                        <div className="single__curation__categorie">
                          <p>Artworks</p>
                          <h6>04</h6>
                        </div>
                        <div className="single__curation__categorie">
                          <p>Artists</p>
                          <h6>21</h6>
                        </div>
                        <div className="single__curation__categorie">
                          <p>Volume</p>
                          <h6>
                            <span>
                              <img src="assets/img/MATIC.png" className="h-6 w-6 p-1 grayscale brightness-200 rounded-full border border-white" alt="" />
                            </span>{" "}
                            3 MATIC
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className="tab-pane fade"
          id="nav-contact"
          role="tabpanel"
          aria-labelledby="nav-contact-tab"
        >
          <div className="row g-4">
            {artists?.map((artist, index) => {
              return (
                <div
                  key={index}
                  className="col-lg-4 col-md-6"
                  onClick={() =>
                    navigate("/dashboard/user/" + artist?.artistId._id)
                  }
                >
                  <div className="single__inspir__card">
                    <div className="single__inspire__thumb">
                      <img src={artist?.artistId.avatar?.url} alt="" />
                    </div>
                    <div className="inspire__content">
                      <h5>{artist?.artistId.username}</h5>
                      {/* <p>Sweden | Coral Cube</p> */}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Favorite
