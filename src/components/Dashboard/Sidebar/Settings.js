import { useEffect, useState } from "react";
import { userServices } from "../../../services/supplier";
import { getCookie } from "../../../utils/cookie";
import { checkUrl } from "../../../utils/checkUrl";
import { trimString } from "../../../utils/helpers";
import { useNavigate } from "react-router-dom";
import * as bootstrap from "bootstrap";
import ErrorPopup from "./Popup";
import { isPropertySignature } from "typescript";
import MainSearch from "../Search/MainSearch";

function Settings(props) {
  const [avatar, setAvatar] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [banner, setBanner] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [links, setLinks] = useState({
    website: "",
    instagram: "",
    facebook: "",
    facebooktwitter: "",
  });
  const [user, setUser] = useState();
  const [alerts, setAlerts] = useState({
    title: "",
    messsage: "",
  });

  const navigae = useNavigate();

  const getUser = async () => {
    try {
      const {
        data: { user },
      } = await userServices.getSingleUser();
      setUsername(user?.username);
      setBio(user?.bio);
      setEmail(user?.email);
      user?.instagram &&
        user?.instagram !== "undefined" &&
        setLinks({
          ...links,
          instagram: user?.instagram,
        });
      user?.facebook &&
        user?.facebook !== "undefined" &&
        setLinks({
          ...links,
          facebook: user?.facebook,
        });
      user?.twitter &&
        user?.twitter !== "undefined" &&
        setLinks({
          ...links,
          twitter: user?.twitter,
        });
      user?.website &&
        user?.website !== "undefined" &&
        setLinks({
          ...links,
          website: user?.website,
        });
      setUser(user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
   
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setShowErrorPopup(true);
      return;
    }

    setAvatar(file);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
   
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setShowErrorPopup(true);
      return;
    }

    setBanner(file);
  };


  useEffect(() => {
    getUser();
  }, []);

  const updateDetails = async () => {
    const elem = new bootstrap.Modal(
      document.getElementById("exampleModalToggl")
    );
    elem.show();
    try {
      const data = new FormData();
      if (links?.website && !checkUrl(links.website, "website")) {
        setAlerts({
          title: "website",
          messsage: "Website url is not correct",
        });
        return;
      }
      if (links?.twitter && !checkUrl(links.twitter, "twitter")) {
        setAlerts({
          title: "twitter",
          messsage: "Twitter url is not correct",
        });
        return;
      }
      if (links?.facebook && !checkUrl(links.facebook, "facebook")) {
        setAlerts({
          title: "facebook",
          messsage: "Facebook url is not correct",
        });
        return;
      }
      if (links?.instagram && !checkUrl(links.instagram, "instagram")) {
        setAlerts({
          title: "instagram",
          messsage: "Instagram url is not correct",
        });
        return;
      }

      data.append("userImage", avatar);
      data.append("bannerImage", banner);
      data.append("username", username);
      data.append("email", email);
      data.append("bio", bio);
      data.append("facebook", links.facebook);
      data.append("twitter", links.twitter);
      data.append("instagram", links.instagram);
      data.append("website", links.website);
      await userServices.updateProfile(data);
      setAvatar("");
      setBanner("");
      setBio("");
      setEmail("");
      setLinks({
        website: "",
        instagram: "",
        facebook: "",
        facebooktwitter: "",
      });
      await getUser();
      setTimeout(() => {
        elem.hide();
        navigae("/dashboard?myProfile");
      }, 1000);
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        elem.hide();
      }, 1000);
    }
  };

  return (
    <div className="profile__wrapper">
      {props.render}
      <MainSearch />
      <div className="edit__profile__wrapper">
        <div className="edit__profile__title text-center">
          <h4>Edit Profile</h4>
        </div>

        <div className="common__edit__proe__wrap mt-20">
          {showErrorPopup && (
            <ErrorPopup
              isOpen={true}
              onClose={() => setShowErrorPopup(false)}
              messege="Please upload an image with Size less than 10MB"
            />
          )}
          <div className="edit__profilfile__inner__top__blk">
            <div className="edit__profile__inner__title">
              <h5>Edit your avatar</h5>
            </div>
            <div className="edit_profile_inner_top_right">
              <div className="edit__profile__angle__ico">
                <span>
                  <img src="assets/img/angle_up.svg" alt="" />
                </span>
              </div>
            </div>
          </div>
          <div className="edit__profile__upload__image">
            <div className="upload__wrapper">
              <div className="upload__inner__blk">
                <div className="upload__profile">
                  <div className="imageWrapper">
                    {avatar ? (
                      <img
                        className="image"
                        src={URL.createObjectURL(avatar)}
                      />
                    ) : user?.avatar?.url ? (
                      <img className="image" src={user?.avatar?.url} />
                    ) : (
                      <img
                        className="image"
                        src="https://i.ibb.co/sCQzL0f/user-img.png"
                      />
                    )}
                  </div>
                </div>
                <div className="uplo_content">
                  <h6>Upload a new avatar”</h6>
                  <button className="file-upload">
                    <input
                      type="file"
                      className="file-input"
                      onChange={handleAvatarChange}
                    />
                    <span>
                      <img src="assets/img/image_ico.svg" alt="" /> Choose file
                    </span>{" "}
                    {avatar ? avatar.name : "No files selected"}
                  </button>
                  <p>JPEG 100x100</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="common__edit__proe__wrap mt-30">
          {showErrorPopup && (
            <ErrorPopup
              isOpen={true}
              onClose={() => setShowErrorPopup(false)}
              messege="Please upload an image with Size less than 10MB"
            />
          )}

          <div className="edit__profilfile__inner__top__blk">
            <div className="edit__profile__inner__title">
              <h5>Edit your Cover Image</h5>
            </div>
            <div className="edit_profile_inner_top_right">
              <div className="edit__profile__angle__ico">
                <span>
                  <img src="assets/img/angle_up.svg" alt="" />
                </span>
              </div>
            </div>
          </div>
          <div className="edit__profile__upload__image">
            <div className="upload__wrapper">
              <div className="upload__inner__blk">
                <div className="upload__profile">
                  <div className="imageWrapper">
                    {banner ? (
                      <img
                        className="image-2"
                        src={URL.createObjectURL(banner)}
                      />
                    ) : user?.banner?.url ? (
                      <img className="image-2" src={user?.banner?.url} />
                    ) : (
                      <img
                        className="image-2"
                        src="https://i.ibb.co/sCQzL0f/user-img.png"
                      />
                    )}
                  </div>
                </div>
                <div className="uplo_content">
                  <h6>Upload a new banner”</h6>
                  <button className="file-upload">
                    <input
                      type="file"
                      className="file-input-2"
                      onChange={handleBannerChange}
                    />
                    <span>
                      <img src="assets/img/image_ico.svg" alt="" /> Choose file
                    </span>{" "}
                    {banner ? banner.name : "No files selected"}
                  </button>
                  <p>JPEG 100x100</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="common__edit__proe__wrap mt-30">
          <div className="edit__profilfile__inner__top__blk">
            <div className="edit__profile__inner__title">
              <h5>Basic Information</h5>
            </div>
            <div className="edit_profile_inner_top_right">
              <div className="edit__profile__angle__ico">
                <span>
                  <img src="assets/img/angle_up.svg" alt="" />
                </span>
              </div>
            </div>
          </div>
          <div className="edit__profile__form">
            <form action="#">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="single__edit__profile__step">
                    <label htmlFor="#">Username</label>
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    {/* <span className="alart">
                      This username is already exists!
                    </span> */}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="single__edit__profile__step">
                    <label htmlFor="#">Email address</label>
                    <input
                      type="text"
                      placeholder="Enter Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="single__edit__profile__step">
                    <label htmlFor="#">Your Bio</label>
                    <textarea
                      name="#"
                      placeholder="Say something about yourself"
                      id=""
                      cols={30}
                      rows={10}
                      defaultValue={""}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="common__edit__proe__wrap mt-30">
          <div className="edit__profilfile__inner__top__blk">
            <div className="edit__profile__inner__title">
              <h5>Your links</h5>
            </div>
            <div className="edit_profile_inner_top_right">
              <div className="add_new">
                <a href="#">
                  <span>
                    <img src="assets/img/Plus_circle.svg" alt="" />
                  </span>{" "}
                  Add New
                </a>
              </div>
              <div className="edit__profile__angle__ico">
                <span>
                  <img src="assets/img/angle_up.svg" alt="" />
                </span>
              </div>
            </div>
          </div>
          <div className="edit__profile__form">
            <form action="#">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="single__edit__profile__step">
                    <label htmlFor="#">Website</label>
                    <input
                      type="text"
                      placeholder="Enter your website link"
                      value={links.website}
                      onChange={(e) =>
                        setLinks({ ...links, website: e.target.value })
                      }
                    />
                    <button className="delete_btn" type="button">
                      <img src="assets/img/Trash.svg" alt="" />
                    </button>
                  </div>
                  {alerts?.title === "website" && links?.website && (
                    <span className="alart alart__red">{alerts?.messsage}</span>
                  )}
                </div>
                <div className="col-md-6">
                  <div className="single__edit__profile__step">
                    <label htmlFor="#">X(Twitter)</label>
                    <input
                      type="text"
                      placeholder="Enter your twitter link"
                      value={links.twitter}
                      onChange={(e) =>
                        setLinks({ ...links, twitter: e.target.value })
                      }
                    />
                    <button className="delete_btn" type="button">
                      <img src="assets/img/Trash.svg" alt="" />
                    </button>
                  </div>
                  {alerts?.title === "twitter" && links?.twitter && (
                    <span className="alart alart__red">{alerts?.messsage}</span>
                  )}
                </div>
                <div className="col-md-6">
                  <div className="single__edit__profile__step">
                    <label htmlFor="#">Facebook</label>
                    <input
                      type="text"
                      placeholder="Enter your facebook link"
                      value={links.facebook}
                      onChange={(e) =>
                        setLinks({ ...links, facebook: e.target.value })
                      }
                    />
                    <button className="delete_btn" type="button">
                      <img src="assets/img/Trash.svg" alt="" />
                    </button>
                  </div>
                  {alerts?.title === "facebook" && links?.facebook && (
                    <span className="alart alart__red">{alerts?.messsage}</span>
                  )}
                </div>
                <div className="col-md-6">
                  <div className="single__edit__profile__step">
                    <label htmlFor="#">Instagram</label>
                    <input
                      type="text"
                      placeholder="Enter your instagram link"
                      value={links.instagram}
                      onChange={(e) =>
                        setLinks({ ...links, instagram: e.target.value })
                      }
                    />
                    <button className="delete_btn" type="button">
                      <img src="assets/img/Trash.svg" alt="" />
                    </button>
                  </div>
                  {alerts?.title === "instagram" && links?.instagram && (
                    <span className="alart alart__red">{alerts?.messsage}</span>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="edit__profile__bottom__btn">
          <a
            href="#"
            className="cancel"
            onClick={() => navigae("/dashboard?myProfile")}
          >
            Cancel
          </a>
          <a href="#" onClick={() => updateDetails()}>
            Save
          </a>
        </div>
      </div>
      <div
        className="modal fade common__popup__blk"
        id="exampleModalToggl"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body similar__site__popup">
              <div className="popup__inner__blk text-center">
                <div className="congrats__img">
                  <img src="../../assets/img/refresh_ico_1.svg" alt="" />
                </div>
                <div className="popup__common__title mt-3">
                  <h4>Please wait while we update your details</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
