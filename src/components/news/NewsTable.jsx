import React, { useCallback, useEffect, useState } from "react";
import {
  deleteNewsPost,
  getFilteredNews,
  getWritersAndAdmins,
} from "../../helper/apis";
import { toast } from "react-toastify";
import moment from "moment";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NewsTable = () => {
  const { user, lang } = useSelector((state) => state.teatimetelugu_admin);
  const navigate = useNavigate();

  const [news, setNews] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [writer, setWriter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [deletePopup, setDeletePopup] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentCursor, setCurrentCursor] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [prevCursor, setPrevCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [pageHistory, setPageHistory] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const fetchData = async () => {
    try {
      const res = await getWritersAndAdmins();
      if (res?.status === "success") {
        setAllUsers(res?.users);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredNews = useCallback(
    async (cursor = null, direction = "next") => {
      try {
        setIsLoading(true);
        const safeCursor =
          cursor && cursor !== "null" && cursor !== "undefined" ? cursor : null;
        const res = await getFilteredNews(
          category,
          time,
          searchText,
          writer,
          safeCursor,
          direction,
          itemsPerPage
        );

        if (res?.status === "success") {
          setNews(res.news || []);
          setTotalItems(res.pagination?.totalItems || 0);

          setNextCursor(res.pagination?.nextCursor || null);
          setPrevCursor(res.pagination?.prevCursor || null);
          setHasNextPage(res.pagination?.hasNextPage || false);
          setHasPrevPage(res.pagination?.hasPrevPage || false);

          setPageHistory((prev) => {
            if (direction === "next" && safeCursor) {
              setCurrentPageNumber((p) => p + 1);
              setCurrentCursor(
                direction === "next"
                  ? safeCursor
                  : res.pagination?.prevCursor || null
              );
              return [...prev, safeCursor];
            } else if (direction === "prev" && prev.length > 0) {
              setCurrentPageNumber((p) => p - 1);
              setCurrentCursor(
                direction === "next"
                  ? safeCursor
                  : res.pagination?.prevCursor || null
              );
              return prev.slice(0, -1);
            } else {
              setCurrentPageNumber(1);
              setCurrentCursor(null);
              return [];
            }
          });
        } else {
          toast.error(res?.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch news");
      } finally {
        setIsLoading(false);
      }
    },
    [time, category, searchText, writer, itemsPerPage]
  );

  const handleNextPage = () => {
    if (hasNextPage && nextCursor) {
      filteredNews(nextCursor, "next");
    }
  };

  const handlePreviousPage = () => {
    if (pageHistory.length > 0) {
      // Go back to previous page from history
      const previousCursor = pageHistory[pageHistory.length - 1];
      filteredNews(previousCursor, "prev");
    } else if (hasPrevPage && prevCursor) {
      // First page but has previous data
      filteredNews(prevCursor, "prev");
    }
  };

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = parseInt(event.target.value);
    setItemsPerPage(newItemsPerPage);
    // Reset to first page when changing items per page
    setCurrentCursor(null);
    setPageHistory([]);
    setCurrentPageNumber(1);
    filteredNews(null, "next");
  };

  const handleLink = (id) => {
    navigate(`/${user?._id}/dashboard/edit-news/${id}`);
  };

  const handleView = (newsItem) => {
    if (newsItem?.category?.en && newsItem?.newsId) {
      navigate(`/${newsItem.category.en}/${newsItem.newsId}`);
    } else {
      toast.error("Cannot view this news item");
    }
  };

  const handleDeletePopup = (id) => {
    setDeleteId(id);
    setDeletePopup(true);
  };

  const handleDeleteCancel = () => {
    setDeleteId("");
    setDeletePopup(false);
  };

  const handleDelete = async () => {
    try {
      setIsUploading(true);
      const res = await deleteNewsPost(deleteId);
      if (res?.status === "success") {
        toast.success(res?.message);
        setDeleteId("");
        setDeletePopup(false);
        // Refresh the current view
        filteredNews(currentCursor, "next");
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete news");
    } finally {
      setIsUploading(false);
    }
  };

  // Load initial data when filters change
  useEffect(() => {
    // Reset pagination when filters change
    setCurrentCursor(null);
    setPageHistory([]);
    setCurrentPageNumber(1);
    filteredNews(null, "next");
  }, [time, category, searchText, writer, filteredNews]);

  // Load users on mount
  useEffect(() => {
    fetchData();
  }, []);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <>
      <div className="das-mt20">
        <div className="das-news-container">
          <div className="das-news-container-title">All News</div>

          {/* Filter Section */}
          <div className="das-news-filter-container">
            <div className="nfc-left das-d-flex">
              <select
                className="nfc-filter mr10"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="news">News</option>
                <option value="politics">Politics</option>
                <option value="movies">Movies</option>
                <option value="gossips">Gossips</option>
                <option value="show">Show</option>
                <option value="reviews">Reviews</option>
                <option value="ott">OTT</option>
                <option value="sports">Sports</option>
              </select>

              <div className="nfc-search">
                <input
                  type="text"
                  placeholder="Search here..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <i className="fa fa-search"></i>
              </div>
            </div>

            <div className="nfc-right das-d-flex">
              <div className="nfc-filters mr10">
                <select
                  className="nfc-filter"
                  value={writer}
                  onChange={(e) => setWriter(e.target.value)}
                >
                  <option value="">Select Writer</option>
                  <option value={user?._id}>{user?.fullName}</option>
                  {allUsers?.map((userItem, index) => (
                    <option value={userItem?._id} key={index}>
                      {userItem?.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="nfc-filters">
                <select
                  className="nfc-filter"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                >
                  <option value="">Select Time</option>
                  <option value="1day">Last 24h</option>
                  <option value="1week">Last week</option>
                  <option value="1month">Last 1 month</option>
                  <option value="6month">Last 6 month</option>
                  <option value="older">Above 6 month</option>
                </select>
              </div>
            </div>
          </div>

          {/* News Table */}
          <table className="das-all-news-section">
            <thead>
              <tr>
                <th className="table-sn">Index</th>
                <th className="table-title">Title</th>
                <th className="table-image">Image</th>
                <th className="table-category">Category</th>
                <th className="table-date">Date</th>
                <th className="table-status">Writer</th>
                <th className="table-action">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    <div className="loading-spinner">Loading news...</div>
                  </td>
                </tr>
              ) : news.length > 0 ? (
                news.map((item, index) => (
                  <tr key={item._id || index}>
                    <td className="table-sn">
                      {(currentPageNumber - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="table-title">
                      {lang === "en" ? item?.title?.en : item?.title?.te}
                      {!item?.title?.en && !item?.title?.te && "No title"}
                    </td>
                    <td className="table-image">
                      <img
                        src={item?.mainUrl || "/default-news.png"}
                        alt="news"
                        onError={(e) => {
                          e.target.src = "/default-news.png";
                        }}
                      />
                    </td>
                    <td className="table-category">
                      {lang === "en" ? item?.category?.en : item?.category?.te}
                      {!item?.category?.en &&
                        !item?.category?.te &&
                        "Uncategorized"}
                    </td>
                    <td className="table-date">
                      {item?.createdAt
                        ? moment(item.createdAt).format("h:mm a, D MMMM YYYY")
                        : "No date"}
                    </td>
                    <td className="table-status">
                      <span>{item?.postedBy?.fullName || "Unknown"}</span>
                    </td>
                    <td className="table-action">
                      <i
                        className="fa fa-eye cp color-green"
                        onClick={() => handleView(item)}
                        title="View News"
                      ></i>
                      <i
                        className="fa fa-pen-to-square cp"
                        onClick={() => handleLink(item?._id)}
                        title="Edit News"
                      ></i>
                      <i
                        className="fa fa-trash cp"
                        onClick={() => handleDeletePopup(item?._id)}
                        title="Delete News"
                      ></i>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No news articles found.{" "}
                    {totalItems > 0 ? "Try changing your filters." : ""}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination - Keep your existing UI */}
          {!isLoading && news.length > 0 && (
            <div className="das-all-news-pagenation">
              <div className="dan-pagenation-sec">
                <span>News per page: </span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="cp"
                  disabled={isLoading}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>

                <div className="page-now">
                  Page {currentPageNumber} of {totalPages} • {totalItems} total
                  items
                </div>

                <div className="page-arrows">
                  <i
                    className={`fa fa-angle-left cp ${
                      hasPrevPage || pageHistory.length > 0 ? "" : "disabled"
                    }`}
                    onClick={
                      hasPrevPage || pageHistory.length > 0
                        ? handlePreviousPage
                        : undefined
                    }
                    style={{
                      cursor:
                        hasPrevPage || pageHistory.length > 0
                          ? "pointer"
                          : "not-allowed",
                      opacity: hasPrevPage || pageHistory.length > 0 ? 1 : 0.5,
                    }}
                    title="Previous page"
                  ></i>

                  <i
                    className={`fa fa-angle-right cp ${
                      hasNextPage ? "" : "disabled"
                    }`}
                    onClick={hasNextPage ? handleNextPage : undefined}
                    style={{
                      cursor: hasNextPage ? "pointer" : "not-allowed",
                      opacity: hasNextPage ? 1 : 0.5,
                    }}
                    title="Next page"
                  ></i>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {deletePopup && (
        <div className="popup-news-container popup-container">
          <div className="br5 popup-img p10">
            <div className="das-news-container">
              <div className="popup-news-top das-d-flex das-jcsb">
                <div className="das-news-container-title">
                  Are you sure you want to delete this news article?
                </div>
                <span className="popup-news-top-x das-mx20">
                  <i
                    className="fa fa-xmark cp"
                    onClick={handleDeleteCancel}
                    title="Close"
                  ></i>
                </span>
              </div>

              <div className="das-all-news-bottom das-mt20">
                <div className="news-popup-btns das-mx10">
                  <button
                    className="btn"
                    onClick={handleDeleteCancel}
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                </div>

                <div className="news-popup-btns">
                  {!isUploading ? (
                    <button className="btn save-btn" onClick={handleDelete}>
                      Delete
                    </button>
                  ) : (
                    <button className="btn is-sending-btn" disabled>
                      Deleting...
                    </button>
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

export default NewsTable;
