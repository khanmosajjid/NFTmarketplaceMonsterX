import {useState} from "react"
import {useNavigate} from "react-router-dom"

function Sidebar({onClickMenuButton, activeTab, openDialog, setOpenDialog}) {
  const [active, setActive] = useState(activeTab)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const handleOpen = () => {
    setOpen(!open)
  }
  const close = () => {
    setOpen(false)
  }
  const closePopUp = () => {
    setOpenDialog(false)
  }
  return (
    <>
      <div
        className={
          openDialog
            ? "mobile__menu none__desk active !py-0"
            : "mobile__menu none__desk"
        }
      >
        <div className="flex flex-col max-h-screen pt-12 pb-4">
          <div className="sidebar__logo">
            <a href="#" onClick={() => navigate("/")}>
              <img src="../../assets/img/brand.svg" alt="" />
            </a>
          </div>
          <div className="profile__search desk__none">
            <input type="text" placeholder="Search artwork, collection..." />
            <button type="button">
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </div>
          <div className="sidebar__create__file mb-[25px]">
            <div
              className="single_upload__btn"
              onClick={() => onClickMenuButton("create")}
            >
              <label className="custom-file-upload">
                Create <img src="../assets/img/file_plus.svg" alt="" />
              </label>
            </div>
          </div>
          <div className="overflow-y-auto border-t border-[#292929]">
            <div className="sidebar__list min-h-[675px] !mt-0 !border-none">
              <h6>Marketplace</h6>
              <ul>
                <li
                  className={active === "appreciate" ? "active" : ""}
                  onClick={() => {
                    onClickMenuButton("appreciate")
                    setActive("appreciate")
                  }}
                >
                  <a href="#">
                    <span>
                      <img src="../assets/img/sidebar_ico_1.svg" alt="" />
                    </span>{" "}
                    Appreciation
                  </a>
                </li>
                {/* <li
                  className={active === "artist" ? "active" : ""}
                  onClick={() => {
                    onClickMenuButton("artist")
                    setActive("artist")
                  }}
                >
                  <a href="#">
                    <span>
                      <img src="../assets/img/sidebar_ico_2.svg" alt="" />
                    </span>{" "}
                    Artist
                  </a>
                </li> */}
                <li
                  className={active === "curation" ? "active" : ""}
                  onClick={() => {
                    onClickMenuButton("curation")
                    setActive("curation")
                  }}
                >
                  <a href="#">
                    <span>
                      <img src="../assets/img/sidebar_ico_3.svg" alt="" />
                    </span>{" "}
                    Curation
                  </a>
                </li>
                <li
                  className={active === "news" ? "active" : ""}
                  onClick={() => {
                    onClickMenuButton("news")
                    setActive("news")
                  }}
                >
                  <a
                    href="https://artistvaultx.wpcomstaging.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>
                      <img src="../assets/img/sidebar_ico_4.svg" alt="" />
                    </span>{" "}
                    Magazine
                  </a>
                </li>
                <li
                  className={active === "howtowork" ? "active" : ""}
                  onClick={() => {
                    onClickMenuButton("howtowork")
                    setActive("howtowork")
                  }}
                >
                  <a href="#">
                    <span>
                      <img src="../assets/img/sidebar_ico_5.svg" alt="" />
                    </span>{" "}
                    How to work
                  </a>
                </li>
              </ul>
              <h6 className="mt-25">Account</h6>
              <ul>
                <li
                  className={active === "myProfile" ? "active" : ""}
                  onClick={() => {
                    onClickMenuButton("myProfile")
                    setActive("myProfile")
                  }}
                >
                  <a href="#">
                    <span>
                      <img src="../assets/img/sidebar_ico_6.svg" alt="" />
                    </span>{" "}
                    My Profile
                  </a>
                </li>
                <li
                  className={active === "myFavorite" ? "active" : ""}
                  onClick={() => {
                    onClickMenuButton("myFavorite")
                    setActive("myFavorite")
                  }}
                >
                  <a href="#">
                    <span>
                      <img src="../assets/img/sidebar_ico_7.svg" alt="" />
                    </span>{" "}
                    My favorite
                  </a>
                </li>
                <li
                  className={active === "myOrder" ? "active" : ""}
                  onClick={() => {
                    onClickMenuButton("myOrder")
                    setActive("myOrder")
                  }}
                >
                  <a href="#">
                    <span>
                      <img src="../assets/img/sidebar_ico_8.svg" alt="" />
                    </span>{" "}
                    My Order
                  </a>
                </li>
                <li
                  className={active === "language" ? "active" : ""}
                  onClick={() => {
                    onClickMenuButton("language")
                    setActive("language")
                  }}
                >
                  <a href="#">
                    <span>
                      <img src="../assets/img/sidebar_ico_9.svg" alt="" />
                    </span>{" "}
                    Language
                  </a>
                </li>
                <li
                  className={active === "settings" ? "active" : ""}
                  onClick={() => {
                    onClickMenuButton("settings")
                    setActive("settings")
                  }}
                >
                  <a href="#">
                    <span>
                      <img src="../assets/img/sidebar_ico_10.svg" alt="" />
                    </span>{" "}
                    Settings
                  </a>
                </li>
                {/* <li className={active === "edit-profile" ? "active" : ""}>
              <a href="#">
                <span>
                  <img src="../assets/img/sidebar_ico_10.svg" alt="" />
                </span>{" "}
                Edit Profile
              </a>
            </li> */}
              </ul>
              <ul>
                <li
                  className={active === "helpCenter" ? "active" : ""}
                  onClick={() => {
                    onClickMenuButton("helpCenter")
                    setActive("helpCenter")
                  }}
                >
                  <a href="#">
                    <span>
                      <img src="../assets/img/sidebar_ico_11.svg" alt="" />
                    </span>{" "}
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="sidebar__copyright">
            <p>© 2023 MonsterX</p>
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
      <div className={`sidebar__area flex flex-col max-h-screen`}>
        <div className="sidebar__logo">
          <a href="#" onClick={() => navigate("/")}>
            <img src="../../assets/img/brand.svg" alt="" />
          </a>
        </div>
        <div className="profile__search desk__none">
          <input type="text" placeholder="Search artwork, collection..." />
          <button type="button">
            <i className="fa-solid fa-magnifying-glass" />
          </button>
        </div>
        <div className="sidebar__create__file mb-[25px]">
          <div
            className="single_upload__btn"
            onClick={() => onClickMenuButton("create")}
          >
            <label className="custom-file-upload">
              Create <img src="../assets/img/file_plus.svg" alt="" />
            </label>
          </div>
        </div>
        <div className="overflow-y-auto border-t border-[#292929]">
          <div className="sidebar__list min-h-[675px] !mt-0 !border-none">
            <h6>Marketplace</h6>
            <ul>
              <li
                className={active === "appreciate" ? "active" : ""}
                onClick={() => {
                  onClickMenuButton("appreciate")
                  setActive("appreciate")
                }}
              >
                <a href="#">
                  <span>
                    <img src="../assets/img/sidebar_ico_1.svg" alt="" />
                  </span>{" "}
                  Appreciation
                </a>
              </li>
              {/* <li
                className={active === "artist" ? "active" : ""}
                onClick={() => {
                  onClickMenuButton("artist")
                  setActive("artist")
                }}
              >
                <a href="#">
                  <span>
                    <img src="../assets/img/sidebar_ico_2.svg" alt="" />
                  </span>{" "}
                  Artist
                </a>
              </li> */}
              <li
                className={active === "curation" ? "active" : ""}
                onClick={() => {
                  onClickMenuButton("curation")
                  setActive("curation")
                }}
              >
                <a href="#">
                  <span>
                    <img src="../assets/img/sidebar_ico_3.svg" alt="" />
                  </span>{" "}
                  Curation
                </a>
              </li>
              <li
                className={active === "news" ? "active" : ""}
                onClick={() => {
                  onClickMenuButton("news")
                  setActive("news")
                }}
              >
                <a 
                 href="https://artistvaultx.wpcomstaging.com/"
                 target="_blank"
                 rel="noopener noreferrer"
                 >
                  <span>
                    <img src="../assets/img/sidebar_ico_4.svg" alt="" />
                  </span>{" "}
                  Magazine
                </a>
              </li>
              <li
                className={active === "howtowork" ? "active" : ""}
                onClick={() => {
                  onClickMenuButton("howtowork")
                  setActive("howtowork")
                }}
              >
                <a href="#">
                  <span>
                    <img src="../assets/img/sidebar_ico_5.svg" alt="" />
                  </span>{" "}
                  How to work
                </a>
              </li>
            </ul>
            <h6 className="mt-25">Account</h6>
            <ul>
              <li
                className={active === "myProfile" ? "active" : ""}
                onClick={() => {
                  onClickMenuButton("myProfile")
                  setActive("myProfile")
                }}
              >
                <a href="#">
                  <span>
                    <img src="../assets/img/sidebar_ico_6.svg" alt="" />
                  </span>{" "}
                  My Profile
                </a>
              </li>
              <li
                className={active === "myFavorite" ? "active" : ""}
                onClick={() => {
                  onClickMenuButton("myFavorite")
                  setActive("myFavorite")
                }}
              >
                <a href="#">
                  <span>
                    <img src="../assets/img/sidebar_ico_7.svg" alt="" />
                  </span>{" "}
                  My favorite
                </a>
              </li>
              <li
                className={active === "myOrder" ? "active" : ""}
                onClick={() => {
                  onClickMenuButton("myOrder")
                  setActive("myOrder")
                }}
              >
                <a href="#">
                  <span>
                    <img src="../assets/img/sidebar_ico_8.svg" alt="" />
                  </span>{" "}
                  My Order
                </a>
              </li>
              <li
                className={active === "language" ? "active" : ""}
                onClick={() => {
                  onClickMenuButton("language")
                  setActive("language")
                }}
              >
                <a href="#">
                  <span>
                    <img src="../assets/img/sidebar_ico_9.svg" alt="" />
                  </span>{" "}
                  Language
                </a>
              </li>
              <li
                className={active === "settings" ? "active" : ""}
                onClick={() => {
                  onClickMenuButton("settings")
                  setActive("settings")
                }}
              >
                <a href="#">
                  <span>
                    <img src="../assets/img/sidebar_ico_10.svg" alt="" />
                  </span>{" "}
                  Settings
                </a>
              </li>
              {/* <li className={active === "edit-profile" ? "active" : ""}>
              <a href="#">
                <span>
                  <img src="../assets/img/sidebar_ico_10.svg" alt="" />
                </span>{" "}
                Edit Profile
              </a>
            </li> */}
            </ul>
            <ul>
              <li
                className={active === "helpCenter" ? "active" : ""}
                onClick={() => {
                  onClickMenuButton("helpCenter")
                  setActive("helpCenter")
                }}
              >
                <a href="#">
                  <span>
                    <img src="../assets/img/sidebar_ico_11.svg" alt="" />
                  </span>{" "}
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="sidebar__copyright">
          <p>© 2023 MonsterX</p>
        </div>
        <div className="close__sidebar none__desk">
          <i className="fa fa-times" onClick={close} />
        </div>
      </div>
    </>
  )
}

export default Sidebar
