import React, { useEffect, useState } from "react";
import JoditEditor from "jodit-react";
import { toast } from "react-toastify";
import { getNewsById, updateNewsPost } from "../../helper/apis";
import UploadFile from "./UploadFile";
import { useParams, useNavigate } from "react-router-dom";

const NewsEdit = () => {
  const { newsId } = useParams();
  const navigate = useNavigate();

  const [titleEn, setTitleEn] = useState("");
  const [titleTe, setTitleTe] = useState("");
  const [categoryEn, setCategoryEn] = useState("");
  const [categoryTe, setCategoryTe] = useState("");
  const [subCategoryEn, setSubCategoryEn] = useState("");
  const [subCategoryTe, setSubCategoryTe] = useState("");
  const [movieRating, setMovieRating] = useState(0);
  const [descriptionEn, setDescriptionEn] = useState(""); 
  const [descriptionTe, setDescriptionTe] = useState("");
  const [mainFile, setMainFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [tagsEn, setTagsEn] = useState([]);
  const [tagsTe, setTagsTe] = useState([]);
  const [tagsTextEn, setTagsTextEn] = useState("");
  const [tagsTextTe, setTagsTextTe] = useState("");
  const [isUpload, setIsUpload] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ✅ Fetch existing news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getNewsById(newsId);
        if (res?.status === "success") {
          const data = res.news;

          setTitleEn(data.title.en);
          setTitleTe(data.title.te);
          setCategoryEn(data.category.en);
          setCategoryTe(data.category.te);
          setSubCategoryEn(data.subCategory.en);
          setSubCategoryTe(data.subCategory.te);
          setMovieRating(data.movieRating || 0);
          setDescriptionEn(data.description.en);
          setDescriptionTe(data.description.te);
          setPreview(data.mainUrl);
          setTagsEn(data.tags.en || []);
          setTagsTe(data.tags.te || []);
        } else {
          toast.error("Failed to load news");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching news");
      }
    };
    fetchNews();
  }, [newsId]);

  // ✅ Image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setMainFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // ✅ Add Tags
  const handleTags = (e, lang) => {
    e.preventDefault();
    if (lang === "en" && tagsTextEn.trim() !== "") {
      if (!tagsEn.includes(tagsTextEn.trim())) {
        setTagsEn([...tagsEn, tagsTextEn.trim()]);
      }
      setTagsTextEn("");
    }
    if (lang === "te" && tagsTextTe.trim() !== "") {
      if (!tagsTe.includes(tagsTextTe.trim())) {
        setTagsTe([...tagsTe, tagsTextTe.trim()]);
      }
      setTagsTextTe("");
    }
  };

  // ✅ Remove Tag
  const removeTag = (tagToRemove, lang) => {
    if (lang === "en") setTagsEn(tagsEn.filter((t) => t !== tagToRemove));
    else setTagsTe(tagsTe.filter((t) => t !== tagToRemove));
  };

  // ✅ Update Post
  const handleUpdate = async () => {
    try {
      if (!titleEn || !titleTe) return toast.error("Both titles are required!");
      if (!descriptionEn || !descriptionTe)
        return toast.error("Both descriptions are required!");
      if (!categoryEn || !categoryTe)
        return toast.error("Both categories are required!");

      setIsSaving(true);

      const formData = new FormData();
      formData.append("titleEn", titleEn);
      formData.append("titleTe", titleTe);
      formData.append("descriptionEn", descriptionEn);
      formData.append("descriptionTe", descriptionTe);
      formData.append("categoryEn", categoryEn);
      formData.append("categoryTe", categoryTe);
      formData.append("subCategoryEn", subCategoryEn);
      formData.append("subCategoryTe", subCategoryTe);
      formData.append("movieRating", movieRating);
      if (mainFile) formData.append("mainFile", mainFile);
      formData.append("tagsEn", tagsEn.join(","));
      formData.append("tagsTe", tagsTe.join(","));

      const res = await updateNewsPost(newsId, formData);

      if (res?.status === "success") {
        toast.success("News updated successfully!");
      } else {
        toast.error(res?.message || "Failed to update news");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="write-news-container das-my20">
      <div className="das-news-container">
        <div className="das-news-container-title">Edit News</div>
        <div className="write-news-section">
          {/* ✅ Title Inputs */}
          <div className="wns-box das-my20 das-py20">
            <h3>Title (English)</h3>
            <input
              type="text"
              className="br5"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
            />
          </div>
          <div className="wns-box das-my20 das-py20">
            <h3>Title (Telugu)</h3>
            <input
              type="text"
              className="br5"
              value={titleTe}
              onChange={(e) => setTitleTe(e.target.value)}
            />
          </div>

          {/* ✅ Image Upload */}
          {preview ? (
            <div className="wns-box das-my20 das-py20">
              <h3>Main Image</h3>
              <label htmlFor="file" className="preview-img cp">
                <img src={preview} alt="uploaded-pic" />
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="file"
                style={{ display: "none" }}
              />
            </div>
          ) : (
            <div className="wns-box das-my20 das-py20">
              <h3>Add Image</h3>
              <label htmlFor="mainPic" className="br5 upload-news-img cp">
                <div className="upload-news-img-box dfc fdc">
                  <i className="fa fa-cloud-arrow-up"></i>
                  <span>Upload or Drag & Drop Image</span>
                </div>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="mainPic"
                style={{ display: "none" }}
              />
            </div>
          )}

          {/* ✅ Description Editors */}
          <div className="wns-box das-my20 das-py20">
            <h3>Description (English)</h3>
            <JoditEditor
              value={descriptionEn}
              onChange={(c) => setDescriptionEn(c)}
            />
          </div>
          <div className="wns-box das-my20 das-py20">
            <h3>Description (Telugu)</h3>
            <JoditEditor
              value={descriptionTe}
              onChange={(c) => setDescriptionTe(c)}
            />
          </div>

          {/* ✅ Tags English */}
          <div className="wns-box das-my20 das-py20">
            <h3>Tags (English)</h3>
            <form
              onSubmit={(e) => handleTags(e, "en")}
              className="das-d-flex pt10"
            >
              <input
                type="text"
                value={tagsTextEn}
                onChange={(e) => setTagsTextEn(e.target.value)}
                className="br5"
                placeholder="Ex. Chandrababu, AP Politics"
              />
              <button type="submit" className="btn save-btn">
                Add
              </button>
            </form>
            {tagsEn.length > 0 && (
              <div className="wns-box-all-tags">
                {tagsEn.map((tag, i) => (
                  <div className="wns-box-tag box-shadow p10 m10" key={i}>
                    <span className="mr10">{tag}</span>
                    <i
                      className="fa fa-xmark cp"
                      onClick={() => removeTag(tag, "en")}
                    ></i>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ✅ Tags Telugu */}
          <div className="wns-box das-my20 das-py20">
            <h3>Tags (Telugu)</h3>
            <form
              onSubmit={(e) => handleTags(e, "te")}
              className="das-d-flex pt10"
            >
              <input
                type="text"
                value={tagsTextTe}
                onChange={(e) => setTagsTextTe(e.target.value)}
                className="br5"
                placeholder="ఉదా: చంద్రబాబు, రాజకీయాలు"
              />
              <button type="submit" className="btn save-btn">
                Add
              </button>
            </form>
            {tagsTe.length > 0 && (
              <div className="wns-box-all-tags">
                {tagsTe.map((tag, i) => (
                  <div className="wns-box-tag box-shadow p10 m10" key={i}>
                    <span className="mr10">{tag}</span>
                    <i
                      className="fa fa-xmark cp"
                      onClick={() => removeTag(tag, "te")}
                    ></i>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ✅ Categories + Subcategories (English & Telugu) */}
          {/* ✅ En Categories */}
          <div className="other-details">
            <div className="wns-box das-my20 das-py20">
              <h3 className="">English Category</h3>
              <select
                name=""
                id=""
                className="br5"
                value={categoryEn}
                onChange={(e) => setCategoryEn(e.target.value)}
              >
                <option value="">Select Here</option>
                <option value="news">News</option>
                <option value="politics">Politics</option>
                <option value="movies">Movies</option>
                <option value="ott">OTT</option>
                <option value="show">Show</option>
                <option value="gossips">Gossips</option>
                <option value="reviews">Reviews</option>
                <option value="sports">Sports</option>
              </select>
            </div>
            <div className="wns-box das-my20 das-py20">
              <h3 className="">English Sub Category</h3>
              <select
                name=""
                id=""
                className="br5"
                value={subCategoryEn}
                onChange={(e) => setSubCategoryEn(e.target.value)}
              >
                <option value="">Select Here</option>

                {categoryEn === "news" && <option value="ap">Andhra</option>}
                {categoryEn === "news" && <option value="ts">Telengana</option>}
                {categoryEn === "news" && (
                  <option value="national">National</option>
                )}
                {categoryEn === "news" && (
                  <option value="international">International</option>
                )}

                {categoryEn === "politics" && (
                  <option value="ap">Andhra</option>
                )}
                {categoryEn === "politics" && (
                  <option value="ts">Telengana</option>
                )}
                {categoryEn === "politics" && (
                  <option value="national">National</option>
                )}
                {categoryEn === "politics" && (
                  <option value="international">International</option>
                )}

                {categoryEn === "movies" && (
                  <option value="tollywood">Tollywood</option>
                )}
                {categoryEn === "movies" && (
                  <option value="bollywood">Bollywood</option>
                )}
                {categoryEn === "movies" && (
                  <option value="hollywood">Hollywood</option>
                )}
                {categoryEn === "movies" && (
                  <option value="south">South Cinema</option>
                )}
                {categoryEn === "movies" && (
                  <option value="collections">Collections</option>
                )}

                {categoryEn === "ott" && <option value="review">Review</option>}
                {categoryEn === "ott" && (
                  <option value="release">Release</option>
                )}

                {categoryEn === "show" && <option value="tv">TV</option>}

                {categoryEn === "gossips" && (
                  <option value="movies">Movies</option>
                )}

                {categoryEn === "gossips" && (
                  <option value="ts-political">TS Political</option>
                )}

                {categoryEn === "gossips" && (
                  <option value="ap-political">AP Political</option>
                )}

                {categoryEn === "reviews" && (
                  <option value="theater">Theater</option>
                )}
                {categoryEn === "reviews" && <option value="ott">OTT</option>}
                {categoryEn === "reviews" && (
                  <option value="rerelease">Re-release</option>
                )}

                {categoryEn === "sports" && (
                  <option value="cricket">Cricket</option>
                )}
                {categoryEn === "sports" && (
                  <option value="football">Football</option>
                )}
                {categoryEn === "sports" && (
                  <option value="olympics">Olympics</option>
                )}
              </select>
            </div>
          </div>

          <div className="other-details">
            <div className="wns-box das-my20 das-py20">
              <h3 className="">Telugu Category</h3>
              <select
                name=""
                id=""
                className="br5"
                value={categoryTe}
                onChange={(e) => setCategoryTe(e.target.value)}
              >
                <option value="">Select Here</option>
                <option value="news">News</option>
                <option value="politics">Politics</option>
                <option value="movies">Movies</option>
                <option value="ott">OTT</option>
                <option value="show">Show</option>
                <option value="gossips">Gossips</option>
                <option value="reviews">Reviews</option>
                <option value="sports">Sports</option>
              </select>
            </div>
            <div className="wns-box das-my20 das-py20">
              <h3 className="">Telugu Sub Category</h3>
              <select
                name=""
                id=""
                className="br5"
                value={subCategoryTe}
                onChange={(e) => setSubCategoryTe(e.target.value)}
              >
                <option value="">Select Here</option>

                {categoryTe === "news" && <option value="ap">Andhra</option>}
                {categoryTe === "news" && <option value="ts">TelTegana</option>}
                {categoryTe === "news" && (
                  <option value="national">National</option>
                )}
                {categoryTe === "news" && (
                  <option value="international">International</option>
                )}

                {categoryTe === "politics" && (
                  <option value="ap">Andhra</option>
                )}
                {categoryTe === "politics" && (
                  <option value="ts">TelTegana</option>
                )}
                {categoryTe === "politics" && (
                  <option value="national">National</option>
                )}
                {categoryTe === "politics" && (
                  <option value="international">International</option>
                )}

                {categoryTe === "movies" && (
                  <option value="tollywood">Tollywood</option>
                )}
                {categoryTe === "movies" && (
                  <option value="bollywood">Bollywood</option>
                )}
                {categoryTe === "movies" && (
                  <option value="hollywood">Hollywood</option>
                )}
                {categoryTe === "movies" && (
                  <option value="south">South Cinema</option>
                )}
                {categoryTe === "movies" && (
                  <option value="collections">Collections</option>
                )}

                {categoryTe === "ott" && <option value="review">Review</option>}
                {categoryTe === "ott" && (
                  <option value="release">Release</option>
                )}

                {categoryTe === "show" && <option value="tv">TV</option>}

                {categoryTe === "gossips" && (
                  <option value="movies">Movies</option>
                )}

                {categoryTe === "gossips" && (
                  <option value="ts-political">TS Political</option>
                )}

                {categoryTe === "gossips" && (
                  <option value="ap-political">AP Political</option>
                )}

                {categoryTe === "reviews" && (
                  <option value="theater">Theater</option>
                )}
                {categoryTe === "reviews" && <option value="ott">OTT</option>}
                {categoryTe === "reviews" && (
                  <option value="rerelease">Re-release</option>
                )}

                {categoryTe === "sports" && (
                  <option value="cricket">Cricket</option>
                )}
                {categoryTe === "sports" && (
                  <option value="football">Football</option>
                )}
                {categoryTe === "sports" && (
                  <option value="olympics">Olympics</option>
                )}
              </select>
            </div>
          </div>

          {/* ✅ Movie Rating (only for reviews) */}
          {categoryEn === "reviews" && (
            <div className="wns-box das-my20 das-py20">
              <h3>Movie Rating</h3>
              <select
                className="br5"
                value={movieRating}
                onChange={(e) => setMovieRating(e.target.value)}
              >
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ✅ Buttons */}
          <div className="other-details">
            <div className="cancel-news-btn btn" onClick={() => navigate(-1)}>
              Cancel
            </div>
            {!isSaving ? (
              <div className="post-news-btn btn" onClick={handleUpdate}>
                Update
              </div>
            ) : (
              <button className="is-submitting-btn btn">Updating...</button>
            )}
          </div>
        </div>
      </div>
      {isUpload && <UploadFile setIsUpload={setIsUpload} />}
    </div>
  );
};

export default NewsEdit;
