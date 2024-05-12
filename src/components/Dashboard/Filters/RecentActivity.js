import {useEffect, useState} from "react"

const filtersNft = {
  PLTH: {price: 1},
  PHTL: {price: -1},
  RM: {createdAt: -1},
  RL: {updatedAt: -1},
  MF: {likes: -1},
  HLS:{price: -1},
  NFCM:{price:1}
}

const filterCollection = {
  NOA: {artworks: -1},
  NOATS: {artists: -1},
  NC: {createdAt: -1},
  HV: {volume: -1},
}

const filterEarn = {
  RYL: "Royalty Received",
  PAY: "Payment Received",
  ALL: "All"
}

function RecentActivity({setFilter, filter, component}) {
  const [open, setOpen] = useState(false)
  const close = () => {
    setOpen(false)
  }

  const [selected,setSelected] = useState(1)

  const handleFilter = (filterId, title,id) => {
    setSelected(id)
    setFilter({
      title: title,
      filter: filtersNft[filterId],
    })
    close()
  }

  const handleFilterCollection = (filterId, title,id) => {
    setSelected(id)
    setFilter({
      title: title,
      filter: filterCollection[filterId],
    })
    close()
  }

  const handleFilterEarn = (filterId, title) => {
    setFilter({
      title: title,
      filter: filterEarn[filterId],
    })
    close()
  }

  useEffect(() => {
    component === "CURATION"
      ? handleFilterCollection("RL", "Recently listed")
      : component === "EARN"
        ? handleFilterEarn("ALL", "All")
        : handleFilter("PLTH", "Price Low To High")
  }, [component])

  return (
    <>
      {component === "CURATION" && (
        <div className="categorie__dropdown nft_explore_filter">
          <span>
            <img src="../assets/img/filter_ico_1.svg" alt="" />
          </span>
          <div
            className={open ? "nice-select open" : "nice-select"}
            onClick={() => setOpen(!open)}
            tabIndex={0}
          >
            <span className="current">
              {filter?.title
                ? filter?.title
                : "Number of Artworks"}
            </span>
            <ul className="list">
              <li
                data-value={5}
                className="option"
                onClick={() => handleFilterCollection("NOA", "Number of Artworks")}
              >
               Number of Artworks
              </li>
              <li
                data-value={6}
                className="option"
                onClick={() => handleFilterCollection("NOATS", "Number of Artists")}
              >
                Number of Artists
              </li>
              <li
                data-value={5}
                className="option"
                onClick={() => handleFilterCollection("HV", "Highest Volume")}
              >
                Highest Volume
              </li>
              <li
                data-value={6}
                className="option"
                onClick={() => handleFilterCollection("NC", "New Curation")}
              >
                New Curation
              </li>
            </ul>
          </div>
        </div>
      )}
      {component === "EARN" && (
        <div className="categorie__dropdown nft_explore_filter">
          <span>
            <img src="../assets/img/filter_ico_1.svg" alt="" />
          </span>
          <div
            className={open ? "nice-select open" : "nice-select"}
            onClick={() => setOpen(!open)}
            tabIndex={0}
          >
            <span className="current">
              {filter?.title ? filter?.title : "All"}
            </span>
            <ul className="list">
            <li
                data-value={2}
                className="option"
                onClick={() => handleFilterEarn("ALL", "All")}
              >
                All
              </li>
              <li
                data-value={2}
                className="option"
                onClick={() => handleFilterEarn("RYL", "Royalties")}
              >
                Royalties
              </li>
              <li
                data-value={1}
                className="option"
                onClick={() => handleFilterEarn("PAY", "Split payment")}
              >
                Split payment
              </li>
            </ul>
          </div>
        </div>
      )}
      {(component !== "CURATION" && component !== "EARN") && (
        <div className="categorie__dropdown nft_explore_filter">
          <span>
            <img src="../assets/img/filter_ico_1.svg" alt="" />
          </span>
          <div
            className={open ? "nice-select open" : "nice-select"}
            onClick={() => setOpen(!open)}
            tabIndex={0}
          >
            <span className="current">
              {filter?.title ? filter?.title : "Price Low To High"}
            </span>
            <ul className="list">
              <li
                data-value={2}
                id="1"
                className="option flex justify-between items-center"
                onClick={() => handleFilter("PLTH", "Price Low To High",1)}
              >
                <span>Price : low to high</span>
                {selected === 1 && <span><img src="../assets/img/tick.png" /></span>}
              </li>
              <li
                data-value={1}
                id="2"
                className="option flex justify-between items-center"
                onClick={() => handleFilter("PHTL", "Price High To Low",2)}
              >
                <span>Price :  high to low</span>
                {selected === 2 && <span><img src="../assets/img/tick.png" /></span>}
              </li>
              <li
                data-value={3}
                id="3"
                className="option flex justify-between items-center"
                onClick={() => handleFilter("RM", "Recently Minted",3)}
              >
                <span>Recently Minted</span>
                {selected === 3 && <span><img src="../assets/img/tick.png" /></span>}
              </li>
              <li
                data-value={5}
                id="4"
                className="option flex justify-between items-center"
                onClick={() => handleFilter("RL", "Recently listed",4)}
              >
                <span>Recently listed</span>
                {selected === 4 && <span><img src="../assets/img/tick.png" /></span>}
              </li>
              <li
                data-value={6}
                id="5"
                className="option flex justify-between items-center"
                onClick={() => handleFilter("MF", "Most Favorited",5)}
              >
                <span>Most Favorited</span>
                {selected === 5 && <span><img src="../assets/img/tick.png" /></span>}
              </li>
              <li
                data-value={7}
                id="6"
                className="option flex justify-between items-center"
                onClick={() => handleFilter("HLS", "Highest Last Sale",6)}
              >
                <span>Highest last sale</span>
                {selected === 6 && <span><img src="../assets/img/tick.png" /></span>}
              </li>
              <li
                data-value={8}
                id="7"
                className="option flex justify-between items-center opacity-65 pointer-events-none"
                onClick={() => handleFilter("NFCM", "NFC Minted",7)}
              >
                <span>NFC Minted</span>
                {selected === 7 && <span><img src="../assets/img/tick.png" /></span>}
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  )
}

export default RecentActivity
