import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteGallery, getFilteredGallery } from "../../helper/apis"; // new API function
import Popup from "../confirmation-popup/Popup";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Galleries = () => {
  const { user, lang } = useSelector((state) => state.teatimetelugu_admin);
  const [category, setCategory] = useState("");
  const [time, setTime] = useState("");
  const [searchText, setSearchText] = useState("");

  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [cache, setCache] = useState({});
  const [currentGallery, setCurrentGallery] = useState([]);
  const [allGallery, setAllGallery] = useState([]); // keep all fetched
  const [isLoading, setIsLoading] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  // 🔑 build cache key based on filters
  const buildKey = useCallback(() => {
    return `${category}|${time}|${searchText}|${itemsPerPage}`;
  }, [category, time, searchText, itemsPerPage]);

  // fetch gallery
  const fetchGallery = async (page = 1, replace = false) => {
    const key = buildKey();

    if (cache[key] && cache[key][page] && !replace) {
      setCurrentGallery(cache[key][page]);
      setAllGallery(Object.values(cache[key]).flat());
      return;
    }

    try {
      setIsLoading(true);
      const res = await getFilteredGallery(
        category,
        time,
        searchText,
        page,
        itemsPerPage
      );

      if (res) {
        const { gallery, pagination } = res;
        setTotalItems(pagination.totalItems);

        // cache the response
        setCache((prev) => ({
          ...prev,
          [key]: {
            ...(prev[key] || {}),
            [page]: gallery,
          },
        }));

        setCurrentGallery(gallery);
        setAllGallery((prev) =>
          replace
            ? gallery
            : [
                ...prev.filter((g) => !gallery.some((x) => x._id === g._id)),
                ...gallery,
              ]
        );
      }
    } catch (err) {
      console.error("Error fetching gallery:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // fetch on filters or itemsPerPage change
  useEffect(() => {
    setCurrentPage(1);
    fetchGallery(1, true);
  }, [category, time, searchText, itemsPerPage]);

  // handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchGallery(newPage);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchGallery(newPage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleLink = (id) => {
    navigate(`/${user?._id}/dashboard/edit-gallery/${id}`);
  };

  const handleView = (news) => {
    window.open(`https://teatimetelugu.com/gallery/${news?.newsId}`, "_blank");
  };

  const handleDeletePopup = async (id) => {
    setDeleteId(id);
    setDeletePopup(true);
  };

  const handleDelete = async () => {
    try {
      setIsUploading(true);
      const res = await deleteGallery(deleteId);
      if (res?.status === "success") {
        toast.success(res?.message);
        setDeleteId("");
        setDeletePopup(false);
        fetchGallery();
      } else {
        toast.error(res?.message);
      }
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
      console.log(error);
    }
  };

  // UI (yours, unchanged)
  return (
    <>
      <div className="das-all-gallery-container das-m20 p20 box-shadow">
        <div className="das-all-gallery-section">
          <div className="das-all-gallery-section-top das-d-flex das-jcsb aic">
            <span className="das-news-container-title">Galleries</span>
            <Link
              to={`/${user?._id}/dashboard/add-gallery`}
              className="das-d-flex aic color-blue"
            >
              <h3 className="mr10">Add</h3>{" "}
              <i className="fa fa-plus cp fw6"></i>
            </Link>
          </div>
          <div className="das-all-gallery-section-bottom">
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
                    <option value="actress">Actress</option>
                    <option value="hero">Hero</option>
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
              <div className="">
                {allGallery?.length > 0 ? (
                  <div className="das-all-galleries">
                    {currentGallery?.map((item, index) => (
                      <div className="das-gallery-card" key={index}>
                        <div className="gallery-card">
                          <img
                            src={
                              item?.galleryPics?.[0] ||
                              "https://res.cloudinary.com/demmiusik/image/upload/v1729620719/EET_cyxysf.png"
                            }
                            alt=""
                          />
                          <span className="gallery-name">
                            {lang === "en" ? item?.name?.en : item?.name?.te}
                          </span>
                        </div>
                        <div className="das-gallery-card-activities">
                          <span onClick={() => handleView(item)}>
                            <i className="fa fa-eye"></i>
                          </span>
                          <span onClick={() => handleLink(item?._id)}>
                            <i className="fa fa-pen-to-square"></i>
                          </span>
                          <span onClick={() => handleDeletePopup(item?._id)}>
                            <i className="fa fa-trash"></i>
                          </span>
                        </div>
                        <h3 className="das-gallery-card-title twolineselpsis das-mx10">
                          {lang === "en" ? item?.title?.en : item?.title?.te}
                        </h3>
                      </div>
                    ))}
                  </div>
                ) : (
                  <h2>No data exist</h2>
                )}
              </div>
            ) : (
              <div className="das-all-galleries">
                {[...Array(8)].map((_, index) => (
                  <div className="das-gallery-card" key={index}>
                    <div className="gallery-card">
                      <img
                        src="https://res.cloudinary.com/demmiusik/image/upload/v1729620719/EET_cyxysf.png"
                        alt=""
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && allGallery?.length > 0 && (
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

export default Galleries;
