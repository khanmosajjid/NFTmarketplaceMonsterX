import MainSearch from "../Search/MainSearch"
// Cards
import CurationCards from "../NFTCards/Curation"
import RecentActivity from "../Filters/RecentActivity"
import { useContext, useEffect, useState } from "react"
import { WalletContext } from "../../../Context/WalletConnect"
function Curation(props) {
  const [searchInput, setSearchInput] = useState("")
  const [filter, setFilter] = useState({
    title: "",
    filter: "",
  })
  const [banner, setBanner] = useState({
    image: "",
    link: "#",
  })
  const { fetchImages } = useContext(WalletContext)

  const fetchMedia = async () => {
    const images = await fetchImages()
    setBanner(images.curationTop)
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  return (
    <div className="profile__page__main">
      {props.render}
      <div className="overlay none__desk" />
      <div className="profile__wrapper">
        <MainSearch />
        <a
          href={banner.link ? banner.link : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="breadcrumb__area !h-auto !overflow-hidden !rounded-3xl pb-4"
        >
          {banner.image && (
            <img
              src={banner.image}
              className="breadcrumb__inner__wrap !p-0 !w-full object-cover"
              alt=""
            />
          )}
        </a>
        <div className="ctegorie__search__area mt-35">
          <div className="flex__filter">
            <h5>
              <img src="../assets/img/Filter.svg" alt="" /> Filter:
            </h5>
            <RecentActivity
              setFilter={setFilter}
              filter={filter}
              component={"CURATION"}
            />
          </div>
          <div className="profile__search">
            <input
              type="text"
              placeholder="Search by collection name... "
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="button">
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </div>
        </div>
        <CurationCards searchInput={searchInput} filter={filter} />
      </div>
    </div>
  )
}

export default Curation
