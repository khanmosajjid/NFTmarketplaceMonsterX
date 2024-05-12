import RecentActivity from "../Filters/RecentActivity"

function CategorySearch({setSearchInput, searchInput, setFilter, filter, component}) {
  return (
    <div className="ctegorie__search__area">
      <div className="profile__search">
        <input
          type="text"
          placeholder="Search by name or trait... "
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
        <button type="button">
          <i className="fa-solid fa-magnifying-glass" />
        </button>
      </div>
      <RecentActivity setFilter={setFilter} filter={filter} component={component}/>
    </div>
  )
}

export default CategorySearch
