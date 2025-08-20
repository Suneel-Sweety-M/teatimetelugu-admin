import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { deleteGallery, getFilteredGallery } from "../../helper/apis";
import { toast } from "react-toastify";

const Galleries = () => {
  const { user, lang } = useSelector((state) => state.teatimetelugu_admin);
  const navigate = useNavigate();

  const [allGallery, setAllGallery] = useState([]);
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deletePopup, setDeletePopup] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalItems, setTotalItems] = useState(0);

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
  const currentGallery = allGallery?.slice(indexOfFirstItem, indexOfLastItem);

  const filteredGallery = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getFilteredGallery(
        category,
        time,
        searchText,
        currentPage,
        itemsPerPage
      );

      if (res?.status === "success") {
        setAllGallery(res?.gallery);
        setTotalItems(res?.pagination?.totalItems || 0);
      } else {
        toast.error(res?.message);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }, [time, category, searchText, currentPage, itemsPerPage]);

  const handleLink = (id) => {
    navigate(`/${user?._id}/dashboard/edit-gallery/${id}`);
  };

  const handleView = (item) => {
    navigate(`/gallery/${item?.newsId}`);
  };

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
      const res = await deleteGallery(deleteId);
      if (res?.status === "success") {
        toast.success(res?.message);
        setDeleteId("");
        setDeletePopup(false);
        filteredGallery();
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
    filteredGallery();
  }, [filteredGallery]);

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
              <div className="">
                {allGallery?.length > 0 ? (
                  <div className="das-all-galleries">
                    {allGallery?.map((item, index) => (
                      <div className="das-gallery-card" key={index}>
                        <div className="gallery-card">
                          <img
                            src={
                              item?.galleryPics[0] ||
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

export default Galleries;
