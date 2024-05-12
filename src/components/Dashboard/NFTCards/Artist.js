import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import {userServices} from "../../../services/supplier"

function ArtistCard({searchInput}) {
  const navigate = useNavigate()
  const [artists, setArtists] = useState([])

  const getAllCurations = async () => {
    try {
      const {
        data: {artists},
      } = await userServices.getArtits({searchInput})
      setArtists(artists)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllCurations()
  }, [searchInput])

  return (
    <div className="curation__area">
      <div className="row g-4">
        {artists?.map((artist, index) => {
          return (
            <div
              key={index}
              className="col-lg-4 col-md-6"
              onClick={() => navigate("/dashboard/user/" + artist?._id)}
            >
              <div className="single__inspir__card">
                <div className="single__inspire__thumb">
                  <img src={artist?.avatar?.url} alt="" />
                </div>
                <div className="inspire__content">
                  <h5>{artist?.username}</h5>
                  {/* <p>Sweden | Coral Cube</p> */}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ArtistCard
