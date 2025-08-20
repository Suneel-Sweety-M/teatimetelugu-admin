import React, { useCallback, useEffect, useState } from "react";
import VideoAdd from "./VideoAdd";
import { deleteVideo, getFilteredVideos } from "../../helper/apis";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Videos = () => {
  const { lang } = useSelector((state) => state.teatimetelugu_admin);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [popupBox, setPopupBox] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deletePopup, setDeletePopup] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [searchText, setSearchText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const totalItems = videos?.length;

  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVideos = videos?.slice(indexOfFirstItem, indexOfLastItem);

  const fetchVideos = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getFilteredVideos(category, time, searchText);
      if (res?.status === "success") {
        setVideos(res?.data);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }, [time, category, searchText]);

  const handleDeletePopup = async (id) => {
    setDeleteId(id);
    setDeletePopup(true);
  };

  const handleDeleteCancel = async () => {
    setDeleteId("");
    setDeletePopup(false);
  };

  const handleDelete = async () => {
    try {
      setIsUploading(true);
      const res = await deleteVideo(deleteId);
      if (res?.status === "success") {
        toast.success(res?.message);
        setDeleteId("");
        setDeletePopup(false);
        fetchVideos();
      } else {
        toast.error(res?.message);
      }
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);
  return (
    <>
      <div className="das-news-container">
        <div className="das-news-container-top">
          <i
            className="fa fa-plus das-float-right cp fs22"
            onClick={() => setPopupBox(true)}
          ></i>
          <div className="das-news-container-title">All Videos</div>
        </div>
        <div className="das-news-container-bottom">
          <div className="das-news-filter-container">
            <div className="nfc-left das-d-flex">
              <div className="nfc-search">
                <input
                  type="input"
                  name=""
                  id=""
                  placeholder="Search here..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <i className="fa fa-search"></i>
              </div>
            </div>
            <div className="nfc-right das-d-flex">
              <div className="nfc-filters">
                <select
                  className="nfc-filter mr10"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="trailers">Trailer</option>
                  <option value="video songs">Video Songs</option>
                  <option value="lyrical videos">Lyrical Songs</option>
                  <option value="events">Events</option>
                  <option value="shows">Shows</option>
                  <option value="ott">OTT</option>
                </select>
              </div>
              <div className="nfc-filters">
                <select
                  className="nfc-filter"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                >
                  <option value="">Select Time</option>
                  <option value="last24h">Last 1 day</option>
                  <option value="last1week">Last 1 week</option>
                  <option value="last1month">Last 1 month</option>
                  <option value="last6months">Last 6 months</option>
                  <option value="above6months">Above 6 months</option>
                </select>
              </div>
            </div>
          </div>
          {!isLoading ? (
            <div>
              {videos?.length > 0 ? (
                <div className="das-all-videos-container das-mt20">
                  {videos.map((item, index) => (
                    <div className="das-video-card box-shadow" key={index}>
                      <img
                        src={item?.mainUrl}
                        alt="yt-thumbnail"
                        className="br5"
                      />
                      <div className="das-video-card-texts">
                        <p className="text-capital">
                          {lang === "en"
                            ? item?.subCategory?.en
                            : item?.subCategory?.te}
                        </p>
                        <Link to={`/${item?.category}/v/${item?.newsId}`}>
                          <h4 className="threelineselpsis">
                            {lang === "en" ? item?.title?.en : item?.title?.te}
                          </h4>
                        </Link>
                      </div>
                      <div className="das-video-card-btns">
                        <Link
                          to={`/${item?.category}/v/${item?.newsId}`}
                          className="das-video-card-btn view-btn"
                        >
                          <i className="fa fa-eye"></i> <span>View</span>
                        </Link>
                        <div
                          className="das-video-card-btn das-delete-btn"
                          onClick={() => handleDeletePopup(item?._id)}
                        >
                          <i className="fa fa-trash"></i> <span>Delete</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <b>No posts available</b>
              )}
            </div>
          ) : (
            <div className="das-all-videos-container das-mt20">
              {[...Array(8)].map((_, index) => (
                <div className="das-video-card box-shadow" key={index}>
                  <img
                    src="https://res.cloudinary.com/demmiusik/image/upload/v1729620426/post-default-pic_jbf1gl.png"
                    alt="yt-thumbnail"
                    className="br5"
                  />
                </div>
              ))}
            </div>
          )}

          {!isLoading && videos?.length > 0 && (
            <div className="das-all-news-pagenation das-mt20">
              <div className="dan-pagenation-sec">
                <span>News per page: </span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="cp"
                >
                  <option value="8">8</option>
                  <option value="16">16</option>
                  <option value="20">20</option>
                </select>
                <div className="page-now">
                  {currentPage} / {Math.ceil(totalItems / itemsPerPage)} of{" "}
                  {totalItems} items
                </div>
                <div className="page-arrows">
                  <i
                    className="fa fa-angle-left cp"
                    onClick={handlePreviousPage}
                  ></i>
                  <i
                    className="fa fa-angle-right cp"
                    onClick={handleNextPage}
                  ></i>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {popupBox && (
        <VideoAdd setPopupBox={setPopupBox} fetchVideos={fetchVideos} />
      )}

      {deletePopup && (
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
      )}
    </>
  );
};

export default Videos;
