import React, { useState } from "react";
import { toast } from "react-toastify";
import { addVideo } from "../../helper/apis";

const VideoAdd = ({ setPopupBox, fetchVideos }) => {
  const [titleEn, setTitleEn] = useState("");
  const [titleTe, setTitleTe] = useState("");
  const [ytId, setYtId] = useState("");
  const [subCategoryEn, setSubCategoryEn] = useState("latest");
  const [subCategoryTe, setSubCategoryTe] = useState("తాజా వీడియోలు");
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async () => {
    if (!titleEn || !titleTe || !ytId) {
      toast.error("English Title, Telugu Title and YouTube ID are required!");
      return;
    }

    setIsSaving(true);
    try {
      const res = await addVideo({
        title: { en: titleEn, te: titleTe },
        ytId,
        subCategory: { en: subCategoryEn, te: subCategoryTe },
      });

      if (res?.status === "success") {
        toast.success(res?.message);
        setTitleEn("");
        setTitleTe("");
        setYtId("");
        setSubCategoryEn("");
        setSubCategoryTe("");
        fetchVideos();
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.error(error);
      // toast.error("Something went wrong!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="popup-news-container popup-container">
      <div className="br5 popup-img p10">
        <div className="das-news-container">
          <div className="popup-news-top das-d-flex das-jcsb">
            <div className="das-news-container-title">Add Video</div>
            <span className="popup-news-top-x das-mx20">
              <i className="fa fa-xmark" onClick={() => setPopupBox(false)}></i>
            </span>
          </div>

          {/* English Title */}
          <div className="wns-box das-my20 das-py20">
            <h3 className="text-start">Title (English)</h3>
            <input
              type="text"
              placeholder="English Title..."
              className="br5"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
            />
          </div>

          {/* Telugu Title */}
          <div className="wns-box das-my20 das-py20">
            <h3 className="text-start">Title (Telugu)</h3>
            <input
              type="text"
              placeholder="Telugu Title..."
              className="br5"
              value={titleTe}
              onChange={(e) => setTitleTe(e.target.value)}
            />
          </div>

          {/* YouTube ID */}
          <div className="wns-box das-my20 das-py20">
            <h3 className="text-start">YouTube Video Id</h3>
            <input
              type="text"
              placeholder="e.g., dQw4w9WgXcQ"
              className="br5"
              value={ytId}
              onChange={(e) => setYtId(e.target.value)}
            />
          </div>

          {/* SubCategory EN */}
          <div className="wns-box das-my20 das-py20">
            <h3 className="text-start">Sub Category (English)</h3>
            <select
              className="br5"
              value={subCategoryEn}
              onChange={(e) => setSubCategoryEn(e.target.value)}
            >
              <option value="latest">Select Here</option>
              <option value="trailers">Trailer</option>
              <option value="video_songs">Video Songs</option>
              <option value="lyrical_songs">Lyrical Songs</option>
              <option value="events">Events</option>
              <option value="shows">Shows</option>
              <option value="ott">OTT</option>
            </select>
          </div>

          {/* SubCategory TE */}
          <div className="wns-box das-my20 das-py20">
            <h3 className="text-start">Sub Category (Telugu)</h3>
            <select
              className="br5"
              value={subCategoryTe}
              onChange={(e) => setSubCategoryTe(e.target.value)}
            >
              <option value="తాజా వీడియోలు">ఇక్కడ ఎంచుకోండి</option>
              <option value="ట్రైలర్">ట్రైలర్</option>
              <option value="వీడియో సాంగ్స్">వీడియో సాంగ్స్</option>
              <option value="లిరికల్ సాంగ్స్">లిరికల్ సాంగ్స్</option>
              <option value="ఈవెంట్స్">ఈవెంట్స్</option>
              <option value="షోలు">షోలు</option>
              <option value="ఓటిటి">ఓటిటి</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="other-details">
            <div
              className="cancel-news-btn btn"
              onClick={() => setPopupBox(false)}
            >
              Cancel
            </div>
            {!isSaving ? (
              <div className="post-news-btn btn" onClick={onSubmit}>
                Post
              </div>
            ) : (
              <button type="submit" className="is-submitting-btn btn">
                Submitting...
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAdd;
