import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import PopupNews from "./PopupNews";
import { addBreakingNews, getBreakingNews } from "../../helper/apis";

const BreakingNews = () => {
  const { user, lang } = useSelector((state) => state.teatimetelugu_admin);

  const [popupNews, setPopupNews] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [gridNews, setGridNews] = useState([]);
  const [selected, setSelected] = useState([]); // [{ id, position }]

  const navigate = useNavigate();
  const maxLimit = 10;

  const allBreakingNewsPosts = async () => {
    setIsLoading(true);
    try {
      const res = await getBreakingNews();
      if (res?.status === "success") {
        setGridNews(res?.news);
        const ids = res?.news.map((newsItem) => ({
          id: newsItem._id,
          position: newsItem.position,
        }));
        setSelected(ids);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    const incomplete = selected.some((s) => !s.position);
    if (incomplete) {
      toast.error("Please assign position to all selected posts.");
      return;
    }

    const items = selected.map((s) => ({
      news: s.id,
      position: s.position,
    }));

    setIsUploading(true);
    try {
      const res = await addBreakingNews({ items });
      if (res?.status === "success") {
        toast.success(res?.message);
        setPopupNews(false);
        allBreakingNewsPosts();
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
    setIsUploading(false);
  };

  const handleLink = (id) => {
    navigate(`/${user?._id}/dashboard/edit-news/${id}`);
  };

  const handleView = (news) => {
    window.open(`https://teatimetelugu.com/${news?.category?.en}/${news?.newsId}`, "_blank");
  };

  useEffect(() => {
    allBreakingNewsPosts();
  }, []);
  return (
    <>
      <div className="das-news-container">
        <i
          className="fa fa-pen-to-square das-float-right cp"
          onClick={() => setPopupNews(true)}
        ></i>
        <div className="das-news-container-title">Breaking News</div>

        {!isLoading ? (
          <table className="das-all-news-section">
            <thead>
              <tr>
                <th className="table-sn">S.No.</th>
                <th className="table-title">Title</th>
                <th className="table-image">Image</th>
                <th className="table-category">Category</th>
                <th className="table-date">Date</th>
                <th className="table-status">Writer</th>
                <th className="table-action">Action</th>
              </tr>
            </thead>
            {gridNews?.length > 0 ? (
              <tbody>
                {gridNews?.map((item, index) => (
                  <tr key={index}>
                    <td className="table-sn">{index + 1}</td>
                    <td className="table-title">
                      {lang === "en" ? item?.title?.en : item?.title?.te}
                    </td>
                    <td className="table-image">
                      <img src={item?.mainUrl} alt="pic" />
                    </td>
                    <td className="table-category">
                      {lang === "en" ? item?.category?.en : item?.category?.te}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <p className="m10 dfc w100">No posts</p>
            )}
          </table>
        ) : (
          <div>
            <div className="snlc-text"></div>
            <div className="snlc-text"></div>
            <div className="snlc-text"></div>
            <div className="snlc-text"></div>
            <div className="snlc-text"></div>
            <div className="snlc-text"></div>
          </div>
        )}
      </div>

      {popupNews && (
        <PopupNews
          setPopupNews={setPopupNews}
          selected={selected}
          setSelected={setSelected}
          handleSave={handleSave}
          isUploading={isUploading}
          maxLimit={maxLimit}
        />
      )}
    </>
  );
};

export default BreakingNews;
