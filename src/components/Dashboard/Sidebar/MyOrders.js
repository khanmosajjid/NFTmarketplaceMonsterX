import { useEffect, useState } from "react";
// tabs

import Order from "../NFTCards/Order";
// components
import MainSearch from "../Search/MainSearch";
import CategorySearch from "../Search/CategorySearch";
function MyOrders(props) {
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
        <Order searchInput={searchInput} filter={filter}/>
      </div>
    </div>
  );
}

export default MyOrders;
