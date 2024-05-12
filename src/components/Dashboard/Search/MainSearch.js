import {useContext, useEffect, useState} from "react"
import {WalletContext} from "../../../Context/WalletConnect"
import {useNavigate} from "react-router-dom"
import {useAccount, useDisconnect} from "wagmi"
import {
  getEthBalance,
  handleCopyClick,
  trimString,
} from "../../../utils/helpers"

function MainSearch({py}) {
  const [open, setOpen] = useState(false)
  const [balance, setBalance] = useState(0)
  const {logout, isLoggedIn, getUser, user, setSidebar} =
    useContext(WalletContext)
  const {address, isConnected} = useAccount()
  const {disconnect} = useDisconnect()
  const navigate = useNavigate()

  useEffect(() => {
    getUser()
  }, [])

  const logoutOnConnect = async () => {
    disconnect()
    logout()
    navigate("/")
  }

  const getBalance = async () => {
    try {
      const balance = await getEthBalance(address)
      setBalance(balance)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // if (!isConnected) logoutOnConnect()
    getBalance()
  }, [isConnected, address])

  const close = () => {
    setOpen(false)
  }

  const handleDropdownMenuClick = event => {
    event.stopPropagation()
  }

  return (
    <div
      className={`profile__header flex justify-between parity:!justify-end ${py}`}
    >
      <div
        onClick={() => setSidebar(true)}
        className="open__sidebar none__desk"
      >
        <i className="fa-solid fa-bars" />
      </div>
      <div className="profile__dropdown__blk relative">
        <a
          id="dropdownMenuClickableInside"
          data-toggle="dropdown"
          data-bs-auto-close="outside"
          aria-expanded="false"
          className="profile__dropdown__inner"
          onclick="stopPropagation(event)"
        >
          <div className="profile__drop__thumb">
            <img
              className="profile__avatar__image"
              src={
                user?.avatar?.url
                  ? user?.avatar?.url
                  : "../../assets/img/metamask-fox.svg"
              }
              alt=""
            />
          </div>
          <h4>
            {user?.username} <i className="fa-solid fa-angle-down" />
          </h4>
        </a>
        <div
          className="profile__dropdown__wrapper dropdown-menu dropdown-menu-end"
          onClick={handleDropdownMenuClick}
        >
          <div className="profile__dropdown__inner__blk">
            <div className="profile__dropdown__header">
              <div className="profile__dropdown__inner">
                <div className="profile__drop__thumb">
                  <img
                    className="profile__avatar__image w-full h-full object-cover"
                    src={
                      user?.avatar?.url
                        ? user?.avatar?.url
                        : "../../assets/img/metamask-fox.svg"
                    }
                    alt=""
                  />
                </div>
                <h4>{user?.username}</h4>
              </div>
              <div className="profile__dropdown__list">
                <ul>
                  <li>
                    <a
                      href="#"
                      onClick={() => navigate("/dashboard?myProfile")}
                    >
                      My Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => navigate("/dashboard?myFavorite")}
                    >
                      My Favorite
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={() => navigate("/dashboard?myOrder")}>
                      My Order
                    </a>
                  </li>
                  <li className="flex_list">
                    <a href="#">
                      Language
                    </a>
                    <div className="profile__list__inner__language">
                      <div
                        className={open ? "nice-select open" : "nice-select"}
                        onClick={() => setOpen(!open)}
                        tabIndex={0}
                      >
                        <span className="current">En</span>
                        <ul className="list">
                          <li
                            data-value="En"
                            data-display="En"
                            className="option selected focus"
                            onClick={close}
                          >
                            En
                          </li>
                          <li data-value={1} className="option" onClick={close}>
                            Russian
                          </li>
                          <li data-value={2} className="option" onClick={close}>
                            Chinese
                          </li>
                          <li data-value={3} className="option" onClick={close}>
                            Spanish
                          </li>
                          <li data-value={4} className="option" onClick={close}>
                            Japanese
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li>
                    <a href="#" onClick={() => navigate("/dashboard?settings")}>
                      Settings
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={() => navigate("/dashboard?help")}>
                      Help Center
                    </a>
                  </li>
                </ul>
                <div className="ethereum__area">
                  <div className="ethereum__left__blk">
                    <div className="ethereum__thumb">
                      <img src="../../assets/img/metamask-fox.svg" alt="" />
                    </div>
                    <div className="ethereum__text">
                      <h4>Polygon</h4>
                      <p>{trimString(address)}</p>
                    </div>
                  </div>
                  <div className="ethereum__right__blk">
                    <div className="ethereum__btn">
                      <a href="#" onClick={() => handleCopyClick(address)}>
                        <img src="../../assets/img/copy.svg" alt="" />
                      </a>
                      <a href="#" onClick={logoutOnConnect}>
                        <img src="../../assets/img/power_btn.svg" alt="" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="ethereum__price">
                  <h4>
                    <span>
                      <img src="../../assets/img/blue_MATIC.png" alt="" />
                    </span>{" "}
                    {balance} MATIC
                  </h4>
                  <h5>${balance * 2}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainSearch
