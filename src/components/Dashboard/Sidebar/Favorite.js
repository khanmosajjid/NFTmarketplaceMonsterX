import { useEffect, useState } from "react";
// tabs
import All from "../NFTCards/All";
import Owned from "../NFTCards/Owned";
import Created from "../NFTCards/Created";
import Curation from "../NFTCards/Curation";
import Activity from "../NFTCards/Activity";
import Favorite from "../NFTCards/Favorite";
import Order from "../NFTCards/Order";
import Earn from "../NFTCards/Earn";
// components
import MainSearch from "../Search/MainSearch";
import CategorySearch from "../Search/CategorySearch";
import { userServices } from "../../../services/supplier";
function MyFavorite(props) {
  const [searchInput, setSearchInput] = useState('')
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
        <CategorySearch setSearchInput={setSearchInput} searchInput={searchInput} setFilter={setFilter} filter={filter}/>
        <Favorite searchInput={searchInput} filter={filter}/>
      </div>
    </div>
  );
}

export default MyFavorite;
