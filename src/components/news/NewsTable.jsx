import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";
import {
  deleteNewsPost,
  getAdminsWriters,
  getFilteredNews,
} from "../../helper/apis"; // your API wrapper
import Popup from "../confirmation-popup/Popup";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const NewsTable = () => {
  const { user, lang } = useSelector((state) => state.teatimetelugu_admin);
  const [category, setCategory] = useState("");
  const [time, setTime] = useState("");
  const [searchText, setSearchText] = useState("");
  const [writer, setWriter] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [cache, setCache] = useState({}); // { "category|time|search|writer|limit": {1: [..], 2:[..]} }
  const [currentNews, setCurrentNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [allWriters, setAllWriters] = useState([]);

  const navigate = useNavigate();

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
          },
        }));

        setCurrentNews(news);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
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

  const handleLink = (id) => {
    navigate(`/${user?._id}/dashboard/edit-news/${id}`);
  };

  const handleView = (news) => {
    navigate(`/${news?.category}/${news?._id}`);
  };

  const handleDeletePopup = async (id) => {
    setDeleteId(id);
    setDeletePopup(true);
  };

  const handleDelete = async () => {
    try {
      setIsUploading(true);
      const res = await deleteNewsPost(deleteId);
      if (res?.status === "success") {
        toast.success(res?.message);
        setDeleteId("");
        setDeletePopup(false);
        fetchNews();
      } else {
        toast.error(res?.message);
      }
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
      console.log(error);
    }
  };

  // index for SN column
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  // UI (your provided return code)
  return (
    <>
      <div className="das-mt20">
        <div className="das-news-container">
          <div className="das-news-container-title">All News</div>
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
                {/* <option value="collections">Collections</option> */}
                <option value="reviews">Reviews</option>
                <option value="ott">OTT</option>
                <option value="sports">Sports</option>
              </select>
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
              <div className="nfc-filters">
                <select
                  className="nfc-filter"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                >
                  <option value="">Selecte Time</option>
                  <option value="24h">Last 24h</option>
                  <option value="week">Last week</option>
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
            {!isLoading ? (
              <tbody>
                {currentNews?.length > 0 ? (
                  currentNews?.map((item, index) => (
                    <tr key={index}>
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
                      <td className="table-action">
                        <i
                          className="fa fa-eye cp color-green"
                          onClick={() => handleView(item)}
                        ></i>
                        <i
                          className="fa fa-pen-to-square cp"
                          onClick={() => handleLink(item?._id)}
                        ></i>
                        <i
                          className="fa fa-trash cp"
                          onClick={() => handleDeletePopup(item?._id)}
                        ></i>
                      </td>
                    </tr>
                  ))
                ) : (
                  <p>No posts available</p>
                )}
              </tbody>
            ) : (
              <h3 className="text-center">Loading...</h3>
            )}
          </table>

          {!isLoading && (
            <div className="das-all-news-pagenation">
              <div className="dan-pagenation-sec">
                <span>News per page: </span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="cp"
                >
                  {/* <option value="5">5</option> */}
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

      {deletePopup && (
        <Popup
          setDeletePopup={setDeletePopup}
          deleteId={deleteId}
          handleDelete={handleDelete}
          isUploading={isUploading}
        />
      )}
    </>
  );
};

export default NewsTable;
