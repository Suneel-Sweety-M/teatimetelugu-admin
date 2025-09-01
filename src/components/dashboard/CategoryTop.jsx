import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { addCategoryTopPosts, getCategoryTopPosts } from "../../helper/apis";
import CategoryPopupNews from "./CategoryPopupNews";

const categories = [
  "news",
  "politics",
  "movies",
  "gossips",
  "reviews",
  "ott",
  "sports",
];

const CategoryTop = () => {
  const { user, lang } = useSelector((state) => state.teatimetelugu_admin);

  const [popupNews, setPopupNews] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [gridNews, setGridNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("news");
  const [selected, setSelected] = useState({}); // {category: [{ id, position }]}

  const navigate = useNavigate();
  const maxLimit = 10;

  const allCategoryTopPosts = async () => {
    setIsLoading(true);
    try {
      const res = await getCategoryTopPosts(selectedCategory);
      if (res?.status === "success") {
        setGridNews(res?.posts);
        // Store category-specific selections
        setSelected((prev) => ({
          ...prev,
          [selectedCategory]: res?.posts.map((newsItem) => ({
            id: newsItem._id,
            position: newsItem.position,
          })),
        }));
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    // Get selections for the current category only
  const currentSelections = selected[selectedCategory] || [];

    const incomplete = currentSelections.some((s) => !s.position);
    if (incomplete) {
      toast.error("Please assign position to all selected posts.");
      return;
    }

    const items = currentSelections.map((s) => ({
      news: s.id,
      position: s.position,
    }));

    setIsUploading(true);
    try {
      const res = await addCategoryTopPosts({
        category: selectedCategory,
        posts: items,
      });
      if (res?.status === "success") {
        toast.success(res?.message);
        setPopupNews(false);
        allCategoryTopPosts();
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
    allCategoryTopPosts();
  }, [selectedCategory]);
  return (
    <>
      <div className="das-news-container">
        <div className="das-d-flex das-jcsb">
          <div className="das-news-container-title">Category Top Posts</div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="cp nfc-filter mr10"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <i
              className="fa fa-pen-to-square das-ml10 cp"
              onClick={() => setPopupNews(true)}
            ></i>
          </div>
        </div>

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
        <CategoryPopupNews
          setPopupNews={setPopupNews}
          selected={selected}
          setSelected={setSelected}
          handleSave={handleSave}
          isUploading={isUploading}
          maxLimit={maxLimit}
          currentCategory={selectedCategory}
        />
      )}
    </>
  );
};

export default CategoryTop;
