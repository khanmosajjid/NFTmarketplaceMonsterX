import {useContext, useEffect, useState} from "react"
// tabs
import All from "../NFTCards/All"
import Owned from "../NFTCards/Owned"
import Created from "../NFTCards/Created"
import Curation from "../NFTCards/Curation"
import Activity from "../NFTCards/Activity"
import Favorite from "../NFTCards/Favorite"
import Order from "../NFTCards/Order"
import Earn from "../NFTCards/Earn"
// components
import MainSearch from "../Search/MainSearch"
import CategorySearch from "../Search/CategorySearch"
import {FavoriteService, userServices} from "../../../services/supplier"
import {handleCopyClick, trimString} from "../../../utils/helpers"
import {getCookie} from "../../../utils/cookie"
import {useNavigate, useParams} from "react-router-dom"
import Sidebar from "../Sidebar"
import {WalletContext} from "../../../Context/WalletConnect"

function Profile(props) {
  const [searchInput, setSearchInput] = useState()
  const {sidebar, setSidebar} = useContext(WalletContext)
  const [tabName, setTabName] = useState(
    props?.profileTab ? props?.profileTab : "All"
  )
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [now, setNow] = useState(false)
  const [user, setUser] = useState()
  const [filter, setFilter] = useState({
    title: "",
    filter: "",
  })

  function TabHandler() {
    switch (tabName) {
      case "All":
        return <All tab="Profile" searchInput={searchInput} filter={filter} />
        break
      case "Owned":
        return <Owned searchInput={searchInput} filter={filter} />
        break
      case "Created":
        return (
          <Created tab="Profile" searchInput={searchInput} filter={filter} />
        )
        break
      case "Curation":
        return (
          <Curation tab="Profile" searchInput={searchInput} filter={filter} />
        )
        break
      case "Activity":
        return <Activity />
        break
      case "Favorite":
        return <Favorite searchInput={searchInput} filter={filter} />
        break
      case "Order":
        return <Order searchInput={searchInput} filter={filter} />
        break
      case "Earn":
        return <Earn filter={filter} />
        break

      default:
        break
    }
  }

  const navigate = useNavigate()
  const onClickMenuButton = value => {
    navigate(`/dashboard`)
  }

  const {userId} = useParams()
  const favoriteService = new FavoriteService()

  const getUserDetails = async () => {
    try {
      if (Boolean(userId)) {
        const {
          data: {user},
        } = await userServices.getUserById({userId})
        setUser(user)
      } else {
        const {data} = await userServices.getSingleUser()
        setUser(data.user)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getArtitsLikes = async () => {
    try {
      let user = getCookie("user")
      user = Boolean(user) && JSON.parse(user)
      if (Boolean(user)) {
        const {
          data: {totalLikedArtist},
        } = await favoriteService.getArtitsTotalLikes({
          artistId: userId ? userId : user?._id,
        })
        const {
          data: {favorite},
        } = await favoriteService.getUserReactionToArtist({
          artistId: userId ? userId : user?._id,
        })
        setLikes(totalLikedArtist)
        setLiked(favorite)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleLike = async () => {
    try {
      setLiked(!liked)
      if (!liked === true) setLikes(likes + 1)
      else if (!liked === false) setLikes(likes - 1)
      setNow(true)
    } catch (error) {
      console.log(error)
    }
  }

  const setMyLike = async () => {
    try {
      const user = JSON.parse(getCookie("user"))
      await favoriteService.handleLikeArtists({
        artistId: userId ? userId : user?._id,
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (now === true) setMyLike()
  }, [liked])

  useEffect(() => {
    getUserDetails()
    getArtitsLikes()
  }, [])

  return (
    <div className="profile__page__main">
      {props?.render ? (
        props?.render
      ) : (
        <Sidebar
          onClickMenuButton={onClickMenuButton}
          activeTab={"artist"}
          openDialog={sidebar}
          setOpenDialog={setSidebar}
        />
      )}
      <div className="overlay none__desk" />
      <div className="profile__wrapper">
        <MainSearch />
        <div className="breadcrumb__area">
          <div
            className="breadcrumb__inner__wrap"
            style={{
              backgroundImage: `url(${user?.banner?.url ? user?.banner?.url : "../../assets/img/breadcrumb_bg_1.png"})`,
            }}
          >
            <div className="breadcrumb__inner__blk">
              <div className="copy-text">
                <input
                  type="text"
                  className="text"
                  defaultValue={trimString(user?.wallet)}
                />
                <button onClick={() => handleCopyClick(user?.wallet)}>
                  <img src="assets/img/copy.svg" alt="" />
                </button>
              </div>
              <div className="heart__area">
                <span>{likes}</span>
                <div
                  className="con-like love_border_white"
                  onClick={() => handleLike()}
                >
                  <input
                    title="like"
                    type="checkbox"
                    className="like"
                    checked={liked}
                  />
                  <div className="checkmark">
                    <svg
                      viewBox="0 0 24 24"
                      className="outlineIcon"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
                    </svg>
                    <svg
                      viewBox="0 0 24 24"
                      className="filled"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                    </svg>
                    <svg
                      className="celebrate"
                      width={100}
                      height={100}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polygon points="10,10 20,20" className="poly" />
                      <polygon points="10,50 20,50" className="poly" />
                      <polygon points="20,80 30,70" className="poly" />
                      <polygon points="90,10 80,20" className="poly" />
                      <polygon points="90,50 80,50" className="poly" />
                      <polygon points="80,80 70,70" className="poly" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="inner__profile__blk">
          <div className="inner__profile__wrapper">
            <div className="inner__profile__thumb !overflow-hidden">
              <img
                className="profile__image w-full h-full object-cover"
                src={
                  user?.avatar?.url || "../../assets/img/prifile__thumb__1.png"
                }
                alt=""
              />
            </div>
            <div className="profile__content">
              <h5>
                {user?.username ? user?.username : trimString(user?.wallet)}
              </h5>
              {/* <div className="followers__content">
                <p>
                  Followers : <span>356</span>
                </p>
                <p>
                  Following : <span>356</span>
                </p>
              </div> */}
            </div>
          </div>
          <div className="profile__social__ico">
            {user?.twitter && user?.twitter !== "undefined" && (
              <a
                href={user?.twitter ? user?.twitter : "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-twitter" />
              </a>
            )}
            {user?.facebook && user?.facebook !== "undefined" && (
              <a
                href={user?.facebook ? user?.facebook : "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook" />
              </a>
            )}
            {user?.instagram && user?.instagram !== "undefined" && (
              <a
                href={user?.instagram ? user?.instagram : "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram" />
              </a>
            )}
            {user?.website && user?.website !== "undefined" && (
              <a
                href={user?.website ? user?.website : "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-discord" />
              </a>
            )}
          </div>
        </div>
        <div className="inner__profile__bottom__content">
          <p>{user?.bio}</p>
        </div>
        <div className="categorie__btn">
          <a
            className={tabName === "All" ? "active" : ""}
            onClick={() => setTabName("All")}
          >
            All
          </a>
          <a
            className={tabName === "Owned" ? "active" : ""}
            onClick={() => setTabName("Owned")}
          >
            Owned
          </a>
          <a
            className={tabName === "Created" ? "active" : ""}
            onClick={() => setTabName("Created")}
          >
            Created
          </a>
          <a
            className={tabName === "Curation" ? "active" : ""}
            onClick={() => setTabName("Curation")}
          >
            Curation
          </a>
          <a
            className={tabName === "Activity" ? "active" : ""}
            onClick={() => setTabName("Activity")}
          >
            Activity
          </a>
          <a
            className={tabName === "Favorite" ? "active" : ""}
            onClick={() => setTabName("Favorite")}
          >
            Favorite
          </a>
          <a
            className={tabName === "Order" ? "active" : ""}
            onClick={() => setTabName("Order")}
          >
            Order
          </a>
          <a
            className={tabName === "Earn" ? "active" : ""}
            onClick={() => setTabName("Earn")}
          >
            Earn
          </a>
        </div>
        <CategorySearch
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          setFilter={setFilter}
          filter={filter}
          component={
            tabName === "Curation"
              ? "CURATION"
              : tabName === "Earn"
                ? "EARN"
                : "NFT"
          }
        />
        {TabHandler(tabName)}
      </div>
    </div>
  )
}

export default Profile
