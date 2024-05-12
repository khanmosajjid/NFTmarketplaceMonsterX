import MainSearch from "../Search/MainSearch"
import All from "../NFTCards/All"
import Category from "../Filters/Category"
import RecentActivity from "../Filters/RecentActivity"
import { useContext, useEffect, useState } from "react"
import { WalletContext } from "../../../Context/WalletConnect"
function Appreciate(props) {
  const [category, setCategory] = useState()
  const [searchInput, setSearchInput] = useState()
  const { fetchImages } = useContext(WalletContext)
  const [banner, setBanner] = useState({
    image: "",
    link: "#",
  })
  const [filter, setFilter] = useState({
    title: "",
    filter: '',
  })

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchInput(e.target.value)
  }

  const fetchMedia = async () => {
    const images = await fetchImages()
    setBanner(images?.appreciateTop)
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  return (
    <div className="profile__wrapper">
      <MainSearch />
      {props.render}
      <a
        href={banner?.link ? banner?.link : "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="breadcrumb__area !h-auto !overflow-hidden !rounded-3xl pb-4"
      >
        {banner?.image && (
          <img
            src={banner?.image}
            className="breadcrumb__inner__wrap !p-0 !w-full object-cover"
            alt=""
          />
        )}
      </a>
      <div className="ctegorie__search__area mt-35">
        <div className="flex__filter">
          <h5>
            <img src="assets/img/Filter.svg" alt="" /> Filter:
          </h5>
          <Category setCategory={setCategory} category={category} />
          <RecentActivity setFilter={setFilter} filter={filter} />
        </div>
        <div className="profile__search">
          <input
            type="text"
            placeholder="Search by name or trait... "
            value={searchInput}
            onChange={handleSearch}
          />
          <button type="button">
            <i className="fa-solid fa-magnifying-glass" />
          </button>
        </div>
      </div>
      <All category={category} searchInput={searchInput} filter={filter} />
    </div>
  )
}

export default Appreciate
