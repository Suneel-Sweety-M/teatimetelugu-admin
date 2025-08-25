const Popup = ({ setDeletePopup, setDeleteId, handleDelete, isUploading }) => {
  const handleDeleteCancel = async () => {
    setDeleteId("");
    setDeletePopup(false);
  };

  return (
    <div className="popup-news-container popup-container">
      <div className="br5 popup-img p10">
        <div className="das-news-container">
          <div className="popup-news-top das-d-flex das-jcsb">
            <div className="das-news-container-title">
              Are you sure want to delete ?
            </div>
            <span className="popup-news-top-x das-mx20">
              <i
                className="fa fa-xmark"
                onClick={() => setDeletePopup(false)}
              ></i>
            </span>
          </div>
          <div className="das-all-news-bottom das-mt20">
            <div className="news-popup-btns das-mx10">
              <button className="btn" onClick={handleDeleteCancel}>
                Cancel
              </button>
            </div>

            <div className="news-popup-btns">
              {!isUploading ? (
                <button className="btn save-btn" onClick={handleDelete}>
                  Delete
                </button>
              ) : (
                <button className="btn is-sending-btn">Deleting...</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
