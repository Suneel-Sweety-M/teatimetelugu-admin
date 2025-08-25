import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { deleteVideo, getFilteredVideos } from "../../helper/apis"; // API wrapper
import VideoAdd from "./VideoAdd";
import Popup from "../confirmation-popup/Popup";
import { toast } from "react-toastify";

const Videos = () => {
  const [category, setCategory] = useState("");
  const [time, setTime] = useState("");
  const [searchText, setSearchText] = useState("");

  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [cache, setCache] = useState({}); // { "filters|limit": {1:[..], 2:[..]} }
  const [currentVideos, setCurrentVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [popupBox, setPopupBox] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // 🔑 build cache key
  const buildKey = useCallback(() => {
    return `${category}|${time}|${searchText}|${itemsPerPage}`;
  }, [category, time, searchText, itemsPerPage]);

  // fetch API if not cached
  const fetchVideos = async (page = 1, replace = false) => {
    const key = buildKey();

    if (cache[key] && cache[key][page] && !replace) {
      setCurrentVideos(cache[key][page]);
      return;
    }

    try {
      setIsLoading(true);

      const res = await getFilteredVideos(
        category,
        time,
        searchText,
        page,
        itemsPerPage
      );

      if (res) {
        const { videos, pagination } = res;
        setTotalItems(pagination.totalItems);

        setCache((prev) => ({
          ...prev,
          [key]: {
            ...(prev[key] || {}),
            [page]: videos,
          },
        }));

        setCurrentVideos(videos);
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // run when filters/perPage change
  useEffect(() => {
    setCurrentPage(1);
    fetchVideos(1, true);
  }, [category, time, searchText, itemsPerPage]);

  // handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchVideos(newPage);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchVideos(newPage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
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
  return (
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
                <option value="24h">Last 1 day</option>
                <option value="week">Last 1 week</option>
                <option value="month">Last 1 month</option>
                <option value="6months">Last 6 months</option>
                <option value="above6months">Above 6 months</option>
                <option value="above1year">Above 1 year</option>
                <option value="above2years">Above 2 years</option>
                <option value="above3years">Above 3 years</option>
              </select>
            </div>
          </div>
        </div>

        {!isLoading ? (
          <div>
            {currentVideos?.length > 0 ? (
              <div className="das-all-videos-container das-mt20">
                {currentVideos.map((item, index) => (
                  <div className="das-video-card box-shadow" key={index}>
                    <img
                      src={item?.mainUrl}
                      alt="yt-thumbnail"
                      className="br5"
                    />
                    <div className="das-video-card-texts">
                      <p className="text-capital">{item?.subCategory?.en}</p>
                      <Link to={`/${item?.category}/v/${item?._id}`}>
                        <h4 className="threelineselpsis">{item?.title?.en}</h4>
                      </Link>
                    </div>
                    <div className="das-video-card-btns">
                      <Link
                        to={`/${item?.category}/v/${item?._id}`}
                        className="das-video-card-btn view-btn"
                      >
                        <i className="fa fa-eye"></i> <span>View</span>
                      </Link>
                      <div
                        className="das-video-card-btn das-delete-btn"
                        onClick={() => {
                          setDeletePopup(true);
                          setDeleteId(item?._id);
                        }}
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

        {!isLoading && currentVideos?.length > 0 && (
          <div className="das-all-news-pagenation das-mt20">
            <div className="dan-pagenation-sec">
              <span>Videos per page: </span>
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

      {popupBox && <VideoAdd setPopupBox={setPopupBox} />}
      {deletePopup && (
        <Popup
          setDeletePopup={setDeletePopup}
          deleteId={deleteId}
          handleDelete={handleDelete}
          isUploading={isUploading}
        />
      )}
    </div>
  );
};

export default Videos;
