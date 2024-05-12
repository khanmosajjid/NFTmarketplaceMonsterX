import {useContext, useEffect, useState} from "react"
import RecentActivity from "../../components/Dashboard/Filters/RecentActivity"
import Sidebar from "../../components/Dashboard/Sidebar"
import {Link, useNavigate, useParams} from "react-router-dom"
import {FavoriteService, collectionServices} from "../../services/supplier"
import {
  getYouTubeVideoId,
  handleCopyClick,
  trimString,
} from "../../utils/helpers"
import {useAccount} from "wagmi"
import {getCookie} from "../../utils/cookie"
import {WalletContext} from "../../Context/WalletConnect"

function Curation() {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState()
  const {sidebar, setSidebar} = useContext(WalletContext)
  const [selectedType, setSelectedType] = useState("items")
  const [tabShow, setTabShow] = useState("curation")
  const [curation, setCuration] = useState()
  const [curationInfo, setCurationInfo] = useState()
  const [nfts, setNfts] = useState([])
  const [search, setSearch] = useState("")
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [now, setNow] = useState(false)
  const [user, setUser] = useState()
  const [activity, setActivity] = useState([])
  const [filter, setFilter] = useState({
    title: "",
    filter: {},
  })
  const [descriptionSlice, setDescriptionSlice] = useState(true)
  const favoriteService = new FavoriteService()
  const onClickMenuButton = value => {
    navigate(`/dashboard`)
  }
  const {curationId} = useParams()

  const getCuraion = async () => {
    try {
      const {data} = await collectionServices.getCollectionById(curationId)
      const res = await collectionServices.getCollectionInfo(curationId)
      setCurationInfo(res.data.collection)
      setCuration(data.collection)
    } catch (error) {
      console.log(error)
    }
  }

  const getCurationNfts = async () => {
    try {
      const {
        data: {nfts},
      } = await collectionServices.getCollectionNfts({
        collectionId: curationId,
        filterString: search,
        filter: filter.filter,
      })
      setNfts(nfts)
    } catch (error) {
      console.log(error)
    }
  }

  const getArtitsLikes = async () => {
    try {
      const {
        data: {totalLikedCollection},
      } = await favoriteService.getCollectionTotalLikes({
        collectionId: curation?._id,
      })
      const {
        data: {favorite},
      } = await favoriteService.getUserReactionToCollection({
        collectionId: curation?._id,
      })
      setLikes(totalLikedCollection)
      setLiked(favorite)
    } catch (error) {
      console.log(error)
    }
  }

  const getCollectionActivity = async () => {
    try {
      const {
        data: {activity},
      } = await collectionServices.getAllActivitiesCollection({
        collectionId: curationId,
        searchInput: searchInput,
      })
      setActivity(activity)
    } catch (error) {
      console.log(error)
    }
  }

  const getUser = () => {
    let user = getCookie("user")
    user = user && JSON.parse(user)
    setUser(user)
  }

  useEffect(() => {
    getArtitsLikes()
    getUser()
    getCollectionActivity()
  }, [curation])

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
      await favoriteService.handleLikeCollections({collectionId: curation?._id})
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (now === true) setMyLike()
  }, [liked])

  useEffect(() => {
    getCuraion()
  }, [curationId])

  useEffect(() => {
    getCurationNfts()
  }, [curationId, search, filter])

  const handleDescription = () => {
    setDescriptionSlice(!descriptionSlice)
  }

  return (
    <div className="profile__page__main">
      <Sidebar
        onClickMenuButton={onClickMenuButton}
        activeTab={tabShow}
        openDialog={sidebar}
        setOpenDialog={setSidebar}
      />
      <div className="overlay none__desk" />
      <div className="profile__wrapper">
        <div className="profile__header">
          <div className="open__sidebar none__desk">
            <i className="fa-solid fa-bars" />
          </div>
          <div className="profile__search phone__none">
            <input
              type="text"
              placeholder="Search artwork, collection..."
              value={search}
              onChange={e => setSearchInput(searchInput)}
            />
            <button type="button">
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </div>
          <div className="profile__bell__area">
            <span>
              <img src="../../assets/img/profile_bell_1.svg" alt="" />
            </span>
          </div>
          <div className="profile__dropdown__blk">
            <div className="profile__dropdown__inner">
              <div className="profile__drop__thumb">
                <img
                  className="profile__avatar__image"
                  src={
                    user?.avatar?.url
                      ? user?.avatar?.url
                      : "../../assets/img/profile_pic_1.png"
                  }
                  alt=""
                />
              </div>
              <h4>
                {user?.username} <i className="fa fa-angle-down" />
              </h4>
            </div>
          </div>
        </div>
        <div className="breadcrumb__area">
          <div
            className="breadcrumb__inner__wrap"
            style={{
              backgroundImage: `url(${curation?.bannerImage?curation.bannerImage:curation?.logo})`,
            }}
          >
            <div className="breadcrumb__inner__blk">
              <div className="copy-text">
                <input
                  type="text"
                  className="text"
                  defaultValue={trimString(curation?.owner?.wallet)}
                />
                <button
                  onClick={() => handleCopyClick(curation?.owner?.wallet)}
                >
                  <img src="../../assets/img/copy.svg" alt="" />
                </button>
              </div>
              <div className="breadcrumb__right__blk">
                <div className="heart__area" onClick={() => handleLike()}>
                  <span>{likes}</span>
                  <div className="con-like love_border_white">
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
                {curation?.owner?._id === user?._id && (
                  <div className="edit__breadcrumb">
                    <Link
                      to={`/dashboard?tab=create&type=createCuration&curationId=${curationId}`}
                    >
                      <span>
                        <img src="../../assets/img/Pencil-ico.svg" alt="" />
                      </span>{" "}
                      Edit
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="about__area">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="inner__profile__bottom__content mb-20 p-0">
                <p className="bg-transparent p-0 text-[18px]">
                  {descriptionSlice ? (
                    curation?.description?.length > 400 ? (
                      <div className="inline">
                        {curation?.description?.slice(0, 400)}{" "}
                        <span
                          className="text-themeYellow font-manrope cursor-pointer inline"
                          onClick={handleDescription}
                        >
                          {!descriptionSlice ? "" : "More ..."}
                        </span>
                      </div>
                    ) : (
                      <p>{curation?.description}</p>
                    )
                  ) : (
                    <div className="inline">
                      {curation?.description}{" "}
                      <span
                        className="text-themeYellow font-manrope cursor-pointer inline"
                        onClick={handleDescription}
                      >
                        {!descriptionSlice ? "less" : ""}
                      </span>
                    </div>
                  )}
                </p>
              </div>
              <div className="row g-4">
                {curation?.youtube?.map((value, index) => {
                  const id = getYouTubeVideoId(value.url)
                  return (
                    <div className="col-xxl-6 col-lg-12 col-md-6">
                      <div className="single__about__box">
                        <div className="about__thumb">
                          <img
                            src={`https://img.youtube.com/vi/${id}/0.jpg`}
                            alt=""
                          />
                          <a href={value.url} className="play__button">
                            <span>
                              <img src="../../assets/img/play_btn.svg" alt="" />
                            </span>
                          </a>
                        </div>
                        <div className="about__content">
                          <h4>{value.title}</h4>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="about__item__text">
                <p>
                  Items <span>{curationInfo?.nftCount}</span>
                </p>
                <p>
                  Artist <span>{curationInfo?.artistCount}</span>
                </p>
                <p>
                  Owner <span>{curationInfo?.ownersCount}</span>
                </p>
                <p>
                  Volume Ranking <span>{curationInfo?.totalVolume}</span>
                </p>
              </div>
              <div className="about__social__blk">
                <div className="profile__social__ico">
                  {curation?.twitter && curation?.twitter !== "undefined" && (
                    <a
                      href={curation?.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-twitter" />
                    </a>
                  )}
                  {curation?.facebook && curation?.facebook !== "undefined" && (
                    <a
                      href={curation?.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-facebook" />
                    </a>
                  )}
                  {curation?.instagram &&
                    curation?.instagram !== "undefined" && (
                      <a
                        href={curation?.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-instagram" />
                      </a>
                    )}
                  {curation?.website && curation?.website !== "undefined" && (
                    <a
                      href={curation?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa fa-globe" />
                    </a>
                  )}
                  {/* <a href="#">
                    <i className="fab fa-discord" />
                  </a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="art__bg__area">
          <img
            src={
              curation?.descriptionImage.length > 0 &&
              curation?.descriptionImage[0]
            }
            alt=""
          />
          <a href="#">
            <img src="../../assets/img/double_down_ico.svg" alt="" />
          </a>
        </div>
        <div className="categorie__btn">
          <a
            className={selectedType === "items" ? "active" : ""}
            onClick={() => setSelectedType("items")}
          >
            Items
          </a>
          <a
            className={selectedType === "activity" ? "active" : ""}
            onClick={() => setSelectedType("activity")}
          >
            Activity
          </a>
        </div>
        <div className="ctegorie__search__area">
          <div className="profile__search">
            <input
              type="text"
              placeholder="Search by name or trait... "
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="button">
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </div>
          <RecentActivity setFilter={setFilter} filter={filter} />
        </div>
        {/* Items */}
        <div
          className={
            selectedType === "items" ? "categorie__card__blk" : "d-none"
          }
        >
          <div className="row g-4">
            {nfts.length > 0 &&
              nfts.filter((nft)=>(!nft?.active && !nft.owner?.active && !nft.curation?.active)).map((item, index) => {
                return (
                  <div
                    className="col-xxl-3 col-xl-4 col-lg-4 col-md-6"
                    key={index}
                  >
                    <div
                      className="single__sport__blk"
                      onClick={() => navigate("/dashboard/nft/" + item?._id)}
                    >
                      <div className="sport__thumb">
                        <img
                          className="w-full aspect-square object-cover"
                          src={item?.cloudinaryUrl}
                          alt=""
                        />
                      </div>
                      <div className="sport__content">
                        <h5>{item?.name}22</h5>
                        <p>
                          Created by: <span>{item?.mintedBy?.username}</span>
                        </p>
                        <p>
                          Canvas Collection <span />
                        </p>
                        <h4>
                          Price{" "}
                          <span>
                            <img
                              src='../../assets/img/MATIC.png'
                              className="h-6 w-6 p-1 grayscale brightness-200 rounded-full border border-white"
                              alt=""
                            />{" "}
                            {item?.price} MATIC
                          </span>
                        </h4>
                      </div>
                    </div>
                  </div>
                )
              })}
            {/* <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6">
              <div className="single__sport__blk">
                <div className="sport__thumb">
                  <img src="../../assets/img/appreciate_thumb_1.png" alt="" />
                </div>
                <div className="sport__content">
                  <h5>Birmingham Hawthorn L</h5>
                  <p>
                    Created by: <span>Marvin McKinney</span>
                  </p>
                  <p>
                    Canvas Collection <span />
                  </p>
                  <h4>
                    Price{" "}
                    <span>
                      <img src="../../assets/img/MATIC.png" alt="" /> 3.122 MATIC
                    </span>
                  </h4>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        {/* activity */}
        <div
          className={
            selectedType === "activity" ? "activity__table__blk" : "d-none"
          }
        >
          <div className="dashboard__table__wrapper">
            <div className="dashboard__table mt-10">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Event</th>
                    <th scope="col">Item</th>
                    <th scope="col">Price</th>
                    <th scope="col">From</th>
                    <th scope="col">To</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {activity.map((value, index) => {
                    return (
                      <tr>
                        <td>
                          <div className="share_table">
                            <span>
                              <img src="assets/img/share.svg" alt="" />
                            </span>{" "}
                            {value?.state}
                          </div>
                        </td>
                        <td>
                          <div className="flex__table">
                            <span className="table_thumb">
                              <img src={value?.nftId.cloudinaryUrl} alt="" />
                            </span>
                            {value?.nftId.name}
                          </div>
                        </td>
                        <td>{value?.price ? value?.price : "-/-"}</td>
                        <td>
                          <span className="yellow_color">
                            {" "}
                            {value?.from?.username
                              ? value.from.username
                              : value?.from?.wallet
                                ? trimString(value.from.wallet)
                                : value?.fromWallet
                                  ? trimString(value?.fromWallet)
                                  : "-/-"}
                          </span>
                        </td>
                        <td>
                          <span className="yellow_color">
                            {" "}
                            {value?.to?.username
                              ? value?.to?.username
                              : value?.to?.wallet
                                ? trimString(value.to.wallet)
                                : value?.toWallet
                                  ? trimString(value?.toWallet)
                                  : "-/-"}
                          </span>
                        </td>
                        <td>
                          {" "}
                          {value?.createdAt
                            ? new Date(value.createdAt)
                                .toLocaleString()
                                .slice(0, 10)
                            : "-/-"}
                        </td>
                        <td>
                          {value?.createdAt
                            ? new Date(value.createdAt).toLocaleTimeString()
                            : "-/-"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Curation
