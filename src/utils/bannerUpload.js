"use client"

import {useRef} from "react"

const Banner = ({bannerImage, setBannerImage}) => {
  const bannerImageRef = useRef(null)

  console.log(bannerImage, 'bannerImage')

  return (
    <div className="common__edit__proe__wrap mt-4">
      <div className="edit__profilfile__inner__top__blk">
        <div className="edit__profile__inner__title">
          <h5>Banner Image</h5>
        </div>
        <div className="edit_profile_inner_top_right">
          {bannerImage && (
            <div className="add_new">
              <a href="#" onClick={() => setBannerImage(null)}>
                Remove
              </a>
            </div>
          )}
          <div className="edit__profile__angle__ico">
            <span>
              <img src="assets/img/angle_up.svg" alt="" />
            </span>
          </div>
        </div>
      </div>
      <div className="file__formate">
        <p>PNG, GIF, WEBP, JPG, or JPEG. Max 1Gb.</p>
      </div>
      <div className="upload__file__padding__bottom">
        <div className="upload__file__with__name">
          <input
            type="file"
            id="banner-image"
            ref={bannerImageRef}
            style={{display: "none"}}
            onChange={e => setBannerImage(e.target.files[0])}
          />
          <button
            type="button"
            id="custom-button"
            onClick={() => bannerImageRef.current.click()}
          >
            Upload{" "}
            <span>
              <img src="assets/img/Upload_ico.svg" alt="" />
            </span>
          </button>
          <span id="custom-text">
            {bannerImage ? "Banner Image Uploaded" : "Choose File"}
          </span>
          {/* {bannerImage && (
            <img
            src={typeof bannerImage === 'string' ? bannerImage : URL.createObjectURL(bannerImage)}
              // src={bannerImage}
              alt="Banner Image"
              style={{maxWidth: "100px", maxHeight: "100px"}}
            />
          )} */}
        </div>
      </div>
    </div>
  )
}

export default Banner
