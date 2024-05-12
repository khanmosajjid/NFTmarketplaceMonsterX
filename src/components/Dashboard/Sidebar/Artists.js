import MainSearch from "../Search/MainSearch"
import RecentActivity from "../Filters/RecentActivity"
import {useState} from "react"
import ArtistCard from "../NFTCards/Artist"
function Artists(props) {
  const [searchInput, setSearchInput] = useState("")
  const [filter, setFilter] = useState({
    title: '',
    filter: {}
  })

  return (
    <div className="profile__page__main">
      {props.render}
      <div className="overlay none__desk" />
      <div className="profile__wrapper">
        <MainSearch />
        <div className="breadcrumb__area">
          <div
            className="breadcrumb__inner__wrap"
            style={{backgroundImage: "url(../assets/img/breadcrumb_bg_1.png)"}}
          ></div>
        </div>
        <div className="ctegorie__search__area mt-35">
          {/* <div className="flex__filter">
            <h5>
              <img src="../assets/img/Filter.svg" alt="" /> Filter:
            </h5>
            <RecentActivity setFilter={setFilter} filter={filter}/>
          </div> */}
          <div className="profile__search">
            <input
              type="text"
              placeholder="Search by artist name or wallet address... "
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <button type="button">
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </div>
        </div>
        <ArtistCard searchInput={searchInput} />
      </div>
    </div>
  )
}

export default Artists
