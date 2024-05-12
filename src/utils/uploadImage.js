import React, { useState } from "react";
import ErrorPopup from "../components/Dashboard/Sidebar/Popup";

const UploadImage = ({ uploadfile, setUploadfile }) => {
  const [showProportionsError, setShowProportionsError] = useState(false);
  const [showPropertiesError, setshowPropertiesError] = useState(false);
  const MediaData=JSON.parse(localStorage.getItem("media"))

  const handleCloseModal = () => {
    setShowProportionsError(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
   
    console.log('called',e.target.files)
    const files = e.target.files;
    console.log('hi',files.length)
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (uploadedFile) => {
    // Fetch media object from local storage

    
    if (!uploadedFile) return;
    console.log('file',uploadedFile)

    const mediaData = JSON.parse(localStorage.getItem("media"));

    // Check if mediaData exists and contains the required keys
    if (mediaData && mediaData.nftUploadSize) {
      console.log('if',uploadedFile)
      // Retrieve nftUploadSize and nftThumbnailQuality from mediaData
      const nftUploadSize = mediaData.nftUploadSize;
      const nftThumbnailQuality = mediaData.nftThumbnailQuality;

      // // Now you have nftUploadSize and nftThumbnailQuality values to use
      // console.log('nftUploadSize:', nftUploadSize);
      // console.log('nftThumbnailQuality:', nftThumbnailQuality);

      // Split resolution to get width and height
      // const [width, height] = nftThumbnailQuality.split('x').map(value => parseInt(value));

      const regex = /(\d+)x(\d+)/;
      // const match = nftThumbnailQuality.match(regex);

      // const width = match[1]; // width will be "720"
      // const height = match[2]; // height will be "702"

      // Check image size and resolution here
      const fileSizeLimit = parseInt(nftUploadSize) * 1024 * 1024; // Convert MB to bytes

      // Check image size
      console.log('return',uploadedFile)
      if (uploadedFile.size > fileSizeLimit) {
        console.log('return')
        setShowProportionsError(true);
        setUploadfile(null);
        return; // Exit function if size exceeds the limit
      }

      // Check image resolution
      const img = new Image();
      img.onload = function () {
        setUploadfile(uploadedFile);
        // const uploadedWidth = this.width;
        // const uploadedHeight = this.height;

        // if (uploadedWidth > Number(width) || uploadedHeight > Number(height)) {
        //   setShowProportionsError(true);
        //   setUploadfile(null);
        // } else {
        //   console.log("else",uploadedFile)
        //   setUploadfile(uploadedFile);

        //   setShowProportionsError(false);
        // }
      };
      img.src = URL.createObjectURL(uploadedFile);
      console.log(img)
    } else {
      setshowPropertiesError(true)
      console.log("main else")
      return;
    }
  };
  const handlePropertyModal = ()=>{
    setshowPropertiesError(false)
  }

  const handleReset = () => {
    setUploadfile(null);
  };

  return (
    <div>
      <div
        id="connectedForm"
        className="connected__form"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <form action="#">
          <div className="col-xxl-5 col-xl-12 col-lg-12 mt-35 w-auto">
            <div className="upload__file">
              {uploadfile ? null : (
                <div className="upload__content flex flex-col items-center justify-center">
                  <div className="uipload__ico flex flex-col justify-center items-center">
                    <img src="assets/img/Upload.svg" alt="" />
                    <h5>Upload file</h5>
                  </div>
                  <p className="flex flex-col justify-center items-center">
                    Drag or choose your file to upload <br />
                    <span>PNG, GIF, WEBP, MP4, or MP3. Max 1GB.</span>
                  </p>
                </div>
              )}
              {uploadfile && (
                <>
                  <img
                    src={typeof uploadfile === 'string' ? uploadfile : URL.createObjectURL(uploadfile)}
                    alt="Preview"
                    style={{ width: "70%", height: "auto" }}
                  />
                  <br />
                  <span className="text-white">{uploadfile?.name? uploadfile?.name: "File Uploaded"}</span>
                </>
              )}
              <div className="flex flex-col  single_upload__btn">
                <label className="custom-file-upload my-2">
                  Browse file{" "}
                  <span>
                    <img src="assets/img/arrow_ico.svg" alt="" />
                  </span>
                  <input
                    // id="file-upload"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </label>

                <div className="text-white">
                  {uploadfile && (
                    <label onClick={handleReset} className="custom-file-upload">
                      Reset
                      <span>
                        <img src="assets/img/delete_icon.svg" alt="" />
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <ErrorPopup
        isOpen={showProportionsError}
        onClose={handleCloseModal}
        messege={
          `Please upload an image with Dimensions ${MediaData?.nftThumbnailQuality?.split('-')[1]} Pixels and Size less than ${MediaData?.nftUploadSize}MB`
        }
      />
      <ErrorPopup
        isOpen={showPropertiesError}
        onClose ={handlePropertyModal}
        messege={'Media properties are not set by admin.'}/>
    </div>
  );
};


export default UploadImage