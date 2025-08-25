import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";
import { getAdminsWriters, getFilteredNews } from "../../helper/apis";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const CategoryPopupNews = ({
  setPopupNews,
  selected,
  setSelected,
  handleSave,
  isUploading,
  maxLimit,
  currentCategory,
}) => {
  const { user, lang } = useSelector((state) => state.teatimetelugu_admin);

  // Filter states
  const [category, setCategory] = useState(currentCategory);
  const [time, setTime] = useState("");
  const [searchText, setSearchText] = useState("");
  const [writer, setWriter] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Data states
  const [cache, setCache] = useState({}); // { "category|time|search|writer|limit": {1: [..], 2:[..]} }
  const [currentNews, setCurrentNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allWriters, setAllWriters] = useState([]);

  // 🔑 build cache key based on filters
  const buildKey = useCallback(() => {
    return `${category}|${time}|${searchText}|${writer}|${itemsPerPage}`;
  }, [category, time, searchText, writer, itemsPerPage]);

  // fetch data if not cached
  const fetchNews = async (page = 1, replace = false) => {
    const key = buildKey();

    // check cache first
    if (cache[key] && cache[key][page] && !replace) {
      setCurrentNews(cache[key][page]);
      setTotalItems(cache[key].totalItems || 0);
      return;
    }

    try {
      setIsLoading(true);

      const res = await getFilteredNews(
        category,
        time,
        searchText,
        writer,
        page,
        itemsPerPage
      );

      if (res) {
        const { news, pagination } = res;
        setTotalItems(pagination.totalItems);

        // save into cache
        setCache((prev) => ({
          ...prev,
          [key]: {
            ...(prev[key] || {}),
            [page]: news,
            totalItems: pagination.totalItems,
          },
        }));

        setCurrentNews(news);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      toast.error("Failed to fetch news");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllWriters = async () => {
    try {
      const res = await getAdminsWriters();
      if (res?.status === "success") {
        setAllWriters(res?.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllWriters();
  }, []);

  // fetch on filter or perPage change
  useEffect(() => {
    setCurrentPage(1);
    fetchNews(1, true);
  }, [category, time, searchText, writer, itemsPerPage]);

  // handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchNews(newPage);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchNews(newPage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleCheckboxChange = (id) => {
    // Get current category selections from parent
    const currentSelections = selected[category] || [];

    const exists = currentSelections.find((s) => s.id === id);

    if (exists) {
      setSelected((prev) => ({
        ...prev,
        [category]: prev[category].filter((s) => s.id !== id),
      }));
    } else {
      if (currentSelections.length === maxLimit) {
        toast.info(`You have reached max limit of ${maxLimit} posts.`);
        return;
      }
      setSelected((prev) => ({
        ...prev,
        [category]: [...(prev[category] || []), { id, position: null }],
      }));
    }
  };

  const handlePositionChange = (id, position) => {
    // Get current category selections
    const currentSelections = selected[category] || [];

    if (currentSelections.some((s) => s.position === position && s.id !== id)) {
      toast.error(
        "Position already selected for another post in this category."
      );
      return;
    }

    setSelected((prev) => ({
      ...prev,
      [category]: prev[category].map((s) =>
        s.id === id ? { ...s, position } : s
      ),
    }));
  };

  // Update the checkbox and select values to use category-specific selections
  const currentSelections = selected[category] || [];

  // In the checkbox input:
  // checked={currentSelections.some((s) => s.id === item?._id)}

  // In the position select:
  // value={currentSelections.find((s) => s.id === item._id)?.position || ""}

  // index for SN column
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  return (
    <div className="popup-news-container popup-container">
      <div className="br5 popup-img p10">
        <div className="das-news-container">
          <div className="popup-news-top das-d-flex das-jcsb">
            <div className="das-news-container-title">Select News</div>
            <span className="popup-news-top-x das-mx20">
              <i
                className="fa fa-xmark cp"
                onClick={() => setPopupNews(false)}
              ></i>
            </span>
          </div>

          {/* Filter Section */}
          <div className="das-news-filter-container">
            <div className="nfc-left das-d-flex">
              <select
                className="nfc-filter mr10"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
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
                  type="input"
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
                  <option value="">Selecte Writer</option>
                  <option value={user?._id}>{user?.fullName}</option>
                  {allWriters?.map((user, index) => (
                    <option value={user?._id} key={index}>
                      {user?.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="nfc-filters mr10">
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

          <table className="das-all-news-section">
            <thead>
              <tr>
                <th className="table-checkbox">Check</th>
                <th className="table-sn">S.No.</th>
                <th className="table-title">Title</th>
                <th className="table-image">Image</th>
                <th className="table-category">Category</th>
                <th className="table-date">Date</th>
                <th className="table-status">Writer</th>
                <th>Position</th>
              </tr>
            </thead>

            {!isLoading ? (
              <tbody>
                {currentNews?.length > 0 ? (
                  currentNews?.map((item, index) => (
                    <tr key={index}>
                      <td className="table-checkbox">
                        <input
                          type="checkbox"
                          checked={currentSelections.some(
                            (s) => s.id === item?._id
                          )}
                          onChange={() => handleCheckboxChange(item?._id)}
                        />
                      </td>
                      <td className="table-sn">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="table-title">
                        {lang === "en" ? item?.title?.en : item?.title?.te}
                      </td>
                      <td className="table-image">
                        <img src={item?.mainUrl} alt="pic" />
                      </td>
                      <td className="table-category">
                        {lang === "en"
                          ? item?.category?.en
                          : item?.category?.te}
                      </td>
                      <td className="table-date">
                        {moment(item?.createdAt).format("h:mm a, D MMMM YYYY")}
                      </td>
                      <td className="table-status">
                        <span>{item?.postedBy?.fullName}</span>
                      </td>
                      <td>
                        <select
                          className="ml10"
                          disabled={!currentSelections.some((s) => s.id === item._id)}
                          value={
                            currentSelections.find((s) => s.id === item._id)?.position ||
                            ""
                          }
                          onChange={(e) =>
                            handlePositionChange(
                              item._id,
                              parseInt(e.target.value)
                            )
                          }
                        >
                          <option value="">Pos</option>
                          {Array.from(
                            { length: maxLimit },
                            (_, i) => i + 1
                          ).map((pos) => (
                            <option key={pos} value={pos}>
                              {pos}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No posts available
                    </td>
                  </tr>
                )}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="8" className="text-center">
                    <h3>Loading...</h3>
                  </td>
                </tr>
              </tbody>
            )}
          </table>

          <div className="das-all-news-bottom">
            <div className="news-popup-btns das-mx10">
              {!isUploading ? (
                <button className="btn save-btn" onClick={handleSave}>
                  Save
                </button>
              ) : (
                <button className="btn is-sending-btn">Saving...</button>
              )}
            </div>

            <div className="dan-pagenation-sec">
              <span>News per page: </span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="cp"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
              <div className="page-now">
                {currentPage} / {Math.ceil(totalItems / itemsPerPage)} of{" "}
                {totalItems} items
              </div>
              <div className="page-arrows">
                <i
                  className={`fa fa-angle-left cp ${
                    currentPage === 1 ? "disabled" : ""
                  }`}
                  onClick={handlePreviousPage}
                ></i>
                <i
                  className={`fa fa-angle-right cp ${
                    currentPage === Math.ceil(totalItems / itemsPerPage)
                      ? "disabled"
                      : ""
                  }`}
                  onClick={handleNextPage}
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPopupNews;
