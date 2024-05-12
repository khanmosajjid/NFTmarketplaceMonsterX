import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect } from "wagmi";
import {
  getEthBalance,
  handleCopyClick,
  trimString,
} from "../../utils/helpers";
import { WalletContext } from "../../Context/WalletConnect";
import { collectionServices, userServices } from "../../services/supplier";
import * as bootstrap from "bootstrap";
import { debounce } from "lodash";
import { Tab, Tabs } from "react-bootstrap";
import useDebounce from "../../customHook/useDebounce";

function Header() {
  const [openDialog, setOpenDialog] = useState(false);
  const { open: modalOpen, close } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { login, logout, isLoggedIn } = useContext(WalletContext);
  const [nfts, setNfts] = useState([]);
  const [curations, setCurations] = useState([]);
  const [artistsNfts, setArtistsNfts] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterString, setFilterString] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    nickname: "",
    email: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const [balance, setBalance] = useState(0);
  const { getUser, user, setSidebar } = useContext(WalletContext);

  useEffect(() => {
    getUser();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (!user?.username || !user?.email) {
      const element = new bootstrap.Modal(
        document.getElementById("exampleModalToggle2")
      );
      element.show();
    }
  }, [user]);

  const getBalance = async () => {
    try {
      const balance = await getEthBalance(address);
      setBalance(balance);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isConnected) logoutOnConnect();
    getBalance();
  }, [isConnected, address]);

  const handleDropdownMenuClick = (event) => {
    event.stopPropagation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateDetails();
  };

  const handleOpen = () => {
    setOpenDialog(!openDialog);
  };
  const closePopUp = () => {
    setOpenDialog(false);
  };

  const loginOnConnect = async () => {
    try {
      if (isConnected) {
        await login(address);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logoutOnConnect = async () => {
    if (isLoggedIn) {
      disconnect();
      await logout(window.location.pathname);
      navigate("/");
    }
  };

  const connectWallet = async () => {
    await modalOpen();
  };

  const getSearchResult = (filterString) => {
    collectionServices
      .getSearch({ filterString })
      .then((res) => {
        console.log("setts", res.data.nfts);
        setArtistsNfts(res.data.artistsNfts);
        setUsers(res.data.users);
        setCurations(res.data.curations);
        setNfts(res.data.nfts);
      })
      .catch((err) => {
        console.log("Error in getting search result", err);
      });
  };

  useEffect(() => {
    loginOnConnect();
  }, [address]);

  const handleSearch = (e) => {
    setFilterString(e.target.value);
  };

  const debouncedSearch = useDebounce(getSearchResult, 1000);

  useEffect(() => {
    debouncedSearch(filterString);
  }, [filterString]);

  const updateDetails = async () => {
    const element = new bootstrap.Modal(
      document.getElementById("exampleModalToggle2")
    );
    try {
      const data = new FormData();
      data.append("username", info.nickname);
      data.append("email", info.email);
      await userServices.updateProfile(data);
      await getUser();
      element.hide();
      const element2 = new bootstrap.Modal(
        document.getElementById("exampleModalToggle3")
      );
      element2.show();
      setTimeout(() => {
        element2.hide();
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.log({ error });
      if (
        error?.response?.data?.message?.includes(
          "This e-mail is already taken."
        )
      ) {
        setErrorMsg("This e-mail is already taken.");
      }
      setTimeout(() => {
        element.hide();
      }, 1000);
    }
  };

  const [activeKey, setActiveKey] = useState("artists");

  const renderDropdownItems = (items, itemType) => {
    switch (itemType) {
      case "artistsNfts":
        return items.map((nft, index) => (
          <div
            key={index}
            className="search__drop__single__step cursor-pointer"
            onClick={() => navigate(`/dashboard/nft/${nft._id}`)}
          >
            <div className="search__drop__thumb">
              <img
                src={nft.cloudinaryUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="search__drop__content">
              <h5>{nft.name}</h5>
              <p>Price: {nft.price} MATIC</p>
            </div>
          </div>
        ));
      case "nfts":
        return items.map((nft, index) => (
          <div
            key={index}
            className="search__drop__single__step cursor-pointer"
            onClick={() => navigate(`/dashboard/nft/${nft._id}`)}
          >
            <div className="search__drop__thumb">
              <img
                className="w-full h-full object-cover"
                src={nft.cloudinaryUrl}
                alt=""
              />
            </div>
            <div className="search__drop__content">
              <h5>{nft.name}</h5>
              <p>Price: {nft.price} MATIC</p>
            </div>
          </div>
        ));
      case "curations":
        return items.map((curation, index) => (
          <div
            key={index}
            className="search__drop__single__step cursor-pointer"
            onClick={() => navigate(`/dashboard/curation/${curation._id}`)}
          >
            <div className="search__drop__thumb">
              <img
                src={curation.logo}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="search__drop__content">
              <h5>{curation.name}</h5>
              <p>{curation.symbol}</p>
            </div>
          </div>
        ));
      case "users":
        return items.map((user, index) => (
          <div
            key={index}
            className="search__drop__single__step cursor-pointer"
            onClick={() => navigate(`/dashboard/user/${user._id}`)}
          >
            <div className="search__drop__thumb">
              <img
                className="w-full h-full object-cover"
                src={user.avatar?.url ? user.avatar.url : "assets/img/fox.svg"}
                alt=""
              />
            </div>
            <div className="search__drop__content">
              <h5>{user.username ? user.username : trimString(user.wallet)}</h5>
            </div>
          </div>
        ));
      default:
        return null;
    }
  };

  return (
    <>
      <div
        className={
          openDialog
            ? "mobile__menu none__desk active"
            : "mobile__menu none__desk"
        }
      >
        <div className="header__search">
          <div className="h__search__blk">
            <input
              id="dropdownMenuClickableInside"
              data-bs-toggle="dropdown"
              data-bs-auto-close="inside"
              aria-expanded="false"
              type="text"
              placeholder="Search artwork, collection..."
              value={filterString}
              onChange={handleSearch}
            />
            <button type="button">
              <i className="fa-solid fa-magnifying-glass" />
            </button>
            <div
              className="search__dropdown dropdown-menu dropdown-menu-end"
              aria-labelledby="dropdownMenuClickableInside"
            >
              <Tabs
                id="search-tabs"
                activeKey={activeKey}
                onSelect={(k) => setActiveKey(k)}
                className="mb-3"
              >
                <Tab eventKey="artists" title="Artists">
                  <div className="search__drop__body">
                    {renderDropdownItems(artistsNfts, "artistsNfts")}
                  </div>
                </Tab>
                <Tab eventKey="nfts" title="NFTs">
                  <div className="search__drop__body">
                    {renderDropdownItems(nfts, "nfts")}
                  </div>
                </Tab>
                <Tab eventKey="curations" title="Curations">
                  <div className="search__drop__body">
                    {renderDropdownItems(curations, "curations")}
                  </div>
                </Tab>
                <Tab eventKey="users" title="Users">
                  <div className="search__drop__body">
                    {renderDropdownItems(users, "users")}
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>

        <div className="header__right__blk">
          <div className="main__menu">
            <nav className="accordion">
              <ul>
                <li>
                  <a href="#">Appreciation</a>
                </li>
                <li>
                  <a href="#">Artist</a>
                </li>
                <li>
                  <a href="#">Curation</a>
                </li>
                <li>
                  <a
                    href="https://artistvaultx.wpcomstaging.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Magazine
                  </a>
                </li>
                <li>
                  <a href="#">How to work</a>
                </li>
              </ul>
            </nav>
          </div>
          {!isLoggedIn ? (
            <div onClick={() => connectWallet()} className="header__btn">
              <a role="button">
                Connect Wallet{" "}
                <span>
                  <img src="../assets/img/wallet.svg" alt="" />
                </span>
              </a>
            </div>
          ) : (
            <div className="header__btn">
              <a role="button">{user?.username}</a>
            </div>
          )}
          <div className="social__ico__blk">
            <a href="#">
              <img src="../assets/img/social_ico_1.svg" alt="" />
            </a>
            <a href="#">
              <img src="../assets/img/social_ico_2.svg" alt="" />
            </a>
            <a href="#">
              <img src="../assets/img/social_ico_3.svg" alt="" />
            </a>
            <a href="#">
              <img src="../assets/img/social_ico_4.svg" alt="" />
            </a>
            <a href="#">
              <img src="../assets/img/social_ico_5.svg" alt="" />
            </a>
          </div>
        </div>
        <div className="close__menu" onClick={closePopUp}>
          <i className="fa-solid fa-xmark" />
        </div>
      </div>
      <div
        className={
          openDialog ? "overlay none__desk active" : "overlay none__desk"
        }
      />
      <header className="header__area">
        <div className="container lg:block !flex !flex-row-reverse items-center gap-3">
          <div className="header__inner__blk w-full">
            <div className="header__logo">
              <span onClick={() => navigate("/dashboard")}>
                <img src="../../assets/img/brand.svg" alt="" />
              </span>
            </div>
            {/* <div className="header__right__blk "> */}
            <div className="main__menu none__phone">
              <nav>
                <ul className="flex">
                  <li>
                    <a
                      href="#"
                      onClick={() => navigate("/dashboard?appreciate")}
                    >
                      Appreciation
                    </a>
                  </li>
                  {/* <li>
                      <a href="#" onClick={() => navigate("/dashboard?artist")}>
                        Artist
                      </a>
                    </li> */}
                  <li>
                    <a href="#" onClick={() => navigate("/dashboard?curation")}>
                      Curation
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://artistvaultx.wpcomstaging.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Magazine
                    </a>
                  </li>
                  <li>
                    <a href="#">How to work</a>
                  </li>
                  <li>{/* <div id="google_translate_element"></div> */}</li>
                </ul>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="header__search none__phone">
                <div className="h__search__blk !w-[400px]">
                  <input
                    id="dropdownMenuClickableInside"
                    data-toggle="dropdown"
                    data-bs-auto-close="outside"
                    aria-expanded="false"
                    type="text"
                    placeholder="Search artwork, collection..."
                    value={filterString}
                    onChange={handleSearch}
                  />
                  <button type="button">
                    <i className="fa-solid fa-magnifying-glass" />
                  </button>
                  <div
                    className="search__dropdown dropdown-menu dropdown-menu-end"
                    onClick={(e) => e.stopPropagation()}
                    aria-labelledby="dropdownMenuClickableInside"
                  >
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                      <button
                        className="nav-link active"
                        id="nav-home1-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-home1"
                        type="button"
                        role="tab"
                        aria-controls="nav-home1"
                        aria-selected="true"
                      >
                        Artist
                      </button>
                      <button
                        className="nav-link"
                        id="nav-profile1-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-profile1"
                        type="button"
                        role="tab"
                        aria-controls="nav-profile1"
                        aria-selected="false"
                      >
                        NFTs
                      </button>
                      <button
                        className="nav-link"
                        id="nav-contact1-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-contact1"
                        type="button"
                        role="tab"
                        aria-controls="nav-contact1"
                        aria-selected="false"
                      >
                        Curations
                      </button>
                      <button
                        className="nav-link"
                        id="nav-users1-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-users1"
                        type="button"
                        role="tab"
                        aria-controls="nav-users1"
                        aria-selected="false"
                      >
                        Users
                      </button>
                    </div>
                    <div className="tab-content" id="nav-tabContent">
                      <div
                        className="tab-pane fade show active"
                        id="nav-home1"
                        role="tabpanel"
                        aria-labelledby="nav-home-tab"
                      >
                        <div className="search__drop__body">
                          {artistsNfts?.length > 0 &&
                            artistsNfts?.map((nft, index) => (
                              <div
                                key={index}
                                className="search__drop__single__step cursor-pointer"
                                onClick={() =>
                                  navigate("/dashboard/nft/" + nft._id)
                                }
                              >
                                <div className="search__drop__thumb">
                                  <img
                                    src={nft?.cloudinaryUrl}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="search__drop__content">
                                  <h5>{nft?.name}</h5>
                                  <p>Price: {nft?.price} MATIC</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="nav-profile1"
                        role="tabpanel"
                        aria-labelledby="nav-profile-tab"
                      >
                        <div className="search__drop__body">
                          {nfts?.length > 0 &&
                            nfts?.map((nft, index) => (
                              <div
                                key={index}
                                className="search__drop__single__step cursor-pointer"
                                onClick={() =>
                                  navigate("/dashboard/nft/" + nft._id)
                                }
                              >
                                <div className="search__drop__thumb">
                                  <img
                                    className="w-full h-full object-cover"
                                    src={nft?.cloudinaryUrl}
                                    alt=""
                                  />
                                </div>
                                <div className="search__drop__content">
                                  <h5>{nft?.name}</h5>
                                  <p>Price: {nft?.price} MATIC</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="nav-contact1"
                        role="tabpanel"
                        aria-labelledby="nav-contact-tab"
                      >
                        <div className="search__drop__body">
                          {curations?.length &&
                            curations?.map((curation, index) => (
                              <div
                                key={index}
                                className="search__drop__single__step cursor-pointer"
                                onClick={() =>
                                  navigate(
                                    "/dashboard/curation/" + curation?._id
                                  )
                                }
                              >
                                <div className="search__drop__thumb">
                                  <img
                                    src={curation?.logo}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="search__drop__content">
                                  <h5>{curation?.name}</h5>
                                  <p>{curation?.symbol}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="nav-users1"
                        role="tabpanel"
                        aria-labelledby="nav-users-tab"
                      >
                        <div className="search__drop__body">
                          {users?.length > 0 &&
                            users?.map((user, index) => (
                              <div
                                key={index}
                                className="search__drop__single__step cursor-pointer"
                                onClick={() =>
                                  navigate("/dashboard/user/" + user._id)
                                }
                              >
                                <div className="search__drop__thumb">
                                  <img
                                    className="w-full h-full object-cover"
                                    src={
                                      user.avatar?.url
                                        ? user.avatar?.url
                                        : "assets/img/fox.svg"
                                    }
                                    alt=""
                                  />
                                </div>
                                <div className="search__drop__content">
                                  <h5>
                                    {user?.username
                                      ? user?.username
                                      : trimString(user?.wallet)}
                                  </h5>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {!isLoggedIn || !isConnected ? (
                <div onClick={() => connectWallet()} className="header__btn">
                  <a role="button">
                    Connect Wallet{" "}
                    <span>
                      <img src="../assets/img/wallet.svg" alt="" />
                    </span>
                  </a>
                </div>
              ) : (
                // <div className="header__btn">
                //   <a role="button">{trimString(address)}</a>
                // </div>
                <div className="profile__dropdown__blk relative !ml-4">
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
                        className="profile__avatar__image "
                        src={
                          user?.avatar?.url
                            ? user?.avatar?.url
                            : "assets/img/Default_profile_icon.svg"
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
                                  : "assets/img/Default_profile_icon.svg"
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
                                onClick={() =>
                                  navigate("/dashboard?myFavorite")
                                }
                              >
                                My Favorite
                              </a>
                            </li>
                            <li>
                              <a
                                href="#"
                                onClick={() => navigate("/dashboard?myOrder")}
                              >
                                My Order
                              </a>
                            </li>
                            <li className="flex_list">
                              <a href="#">Language</a>
                              <div className="profile__list__inner__language">
                                <div
                                  className={
                                    open ? "nice-select open" : "nice-select"
                                  }
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
                                    <li
                                      data-value={1}
                                      className="option"
                                      onClick={close}
                                    >
                                      Russian
                                    </li>
                                    <li
                                      data-value={2}
                                      className="option"
                                      onClick={close}
                                    >
                                      Chinese
                                    </li>
                                    <li
                                      data-value={3}
                                      className="option"
                                      onClick={close}
                                    >
                                      Spanish
                                    </li>
                                    <li
                                      data-value={4}
                                      className="option"
                                      onClick={close}
                                    >
                                      Japanese
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </li>
                            <li>
                              <a
                                href="#"
                                onClick={() => navigate("/dashboard?settings")}
                              >
                                Settings
                              </a>
                            </li>
                            <li>
                              <a
                                href="#"
                                onClick={() => navigate("/dashboard?help")}
                              >
                                Help Center
                              </a>
                            </li>
                          </ul>
                          <div className="ethereum__area">
                            <div className="ethereum__left__blk">
                              <div className="ethereum__thumb">
                                <img
                                  src="../../assets/img/Default_profile_icon.svg"
                                  alt=""
                                />
                              </div>
                              <div className="ethereum__text">
                                <h4>Polygon</h4>
                                <p>{trimString(address)}</p>
                              </div>
                            </div>
                            <div className="ethereum__right__blk">
                              <div className="ethereum__btn">
                                <a
                                  href="#"
                                  onClick={() => handleCopyClick(address)}
                                >
                                  <img src="../../assets/img/copy.svg" alt="" />
                                </a>
                                <a href="#" onClick={logoutOnConnect}>
                                  <img
                                    src="../../assets/img/power_btn.svg"
                                    alt=""
                                  />
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="ethereum__price">
                            <h4>
                              <span>
                                <img
                                  src="../../assets/img/blue_MATIC.png"
                                  alt=""
                                />
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
              )}
            </div>
          </div>
          <div className="open__menu none__desk" onClick={handleOpen}>
            <i className="fa-solid fa-bars" />
          </div>
        </div>
        {/* </div> */}
      </header>
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex={-1}
        data-backdrop="static"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk">
                <div className="popup__common__title">
                  <h4>Enter your Nickname</h4>
                </div>
                <form className="popup__similar__form" onSubmit={handleSubmit}>
                  <div className="single__popup__input">
                    <input
                      required
                      type="text"
                      value={info.nickname}
                      onChange={(e) =>
                        setInfo({ ...info, nickname: e.target.value })
                      }
                      placeholder="Enter nickname..."
                    />
                    <button className="popup_left_position_btn" type="button">
                      <img src="assets/img/User.svg" alt="" />
                    </button>
                  </div>
                  <div className="single__popup__input">
                    <input
                      required
                      type="email"
                      value={info.email}
                      onChange={(e) =>
                        setInfo({ ...info, email: e.target.value })
                      }
                      placeholder="Enter Email"
                    />
                    <button className="popup_left_position_btn" type="button">
                      <img src="assets/img/Mail_ico.svg" alt="" />
                    </button>
                  </div>
                  {errorMsg && (
                    <div className="popup__alart">
                      <p>
                        <span>*{errorMsg}</span>{" "}
                        {/* <a href="#">Sign in</a> instead? */}
                      </p>
                    </div>
                  )}
                  <div className="popup__similar__btn mt-0">
                    <button
                      // href="#"
                      // type="Submit"
                      className="popup_common_btn_1 cursor-pointer"
                    >
                      Next{" "}
                      <span>
                        <img src="assets/img/arrow_ico.svg" alt="" />
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggle3"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel3"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk text-center">
                <div className="congrats__img flex items-center justify-center">
                  <img src="assets/img/congrats.png" alt="" />
                </div>
                <div className="popup__common__title mt-20">
                  <h4>Congrats!</h4>
                  <p>You have successfully created an account.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
