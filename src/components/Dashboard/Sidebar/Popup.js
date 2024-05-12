import React from "react";

const ErrorPopup = ({ isOpen, onClose, messege }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-75 flex items-center justify-center">
      <div className="text-white bg-[#161616] rounded-lg shadow-lg relative p-8">
        <div className=" justify-center items-center">
          <div className="modal-image">
            <img
              src="/assets/img/exclamation.svg"
              alt="Error"
              className="mx-auto mt-4"
              style={{ width: "100px", height: "100px" }}
            />
          </div>
          <div className="modal-header bg-[#161616] text-white p-4 rounded-t-lg text-center justify-center">
            <h5 className="modal-title text-white font-bold">
              Incorrect proportions
            </h5>
          </div>
          <div className="modal-body px-4 pb-4 text-center justify-center">
            <p>{messege} </p>
          </div>
          <div className="modal-footer bg-[#161616] p-4 rounded-b-lg text-center items-center justify-center">
            <button
              type="button"
              className="btn btn-secondary font-bold"
              onClick={onClose}
              style={{ backgroundColor: '#DDF247', color: '#000000' }}
            >
              Retry
            </button>
          </div>
        </div>
        <button
          type="button"
          className="close absolute top-2 right-4 text-white"
          onClick={onClose}
          style={{ fontSize: "30px" }}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;
