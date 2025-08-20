import React, { useState } from "react";
import JoditEditor from "jodit-react";
import { toast } from "react-toastify";
import { addNewsPost } from "../../helper/apis";
import UploadFile from "./UploadFile";

const WriteNews = () => {
  const [titleEn, setTitleEn] = useState("");
  const [titleTe, setTitleTe] = useState("");
  const [categoryEn, setCategoryEn] = useState("");
  const [categoryTe, setCategoryTe] = useState("");
  const [subCategoryEn, setSubCategoryEn] = useState("");
  const [subCategoryTe, setSubCategoryTe] = useState("");
  const [movieRating, setMovieRating] = useState(0);
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionTe, setDescriptionTe] = useState("");
  const [isUpload, setIsUpload] = useState(false);
  const [mainFile, setMainFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [tagsTextEn, setTagsTextEn] = useState("");
  const [tagsTextTe, setTagsTextTe] = useState("");
  const [tagsEn, setTagsEn] = useState([]);
  const [tagsTe, setTagsTe] = useState([]);

  // ✅ Image upload
  const handleImageUpload = (event) => {
    try {
      const file = event.target.files[0];
      setMainFile(file);
      if (file) setPreview(URL.createObjectURL(file));
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Handle Post
  const handlePost = async () => {
    try {
      if (!mainFile) return toast.error("Please upload main image!");
      if (!titleEn || !titleTe) return toast.error("Both titles are required!");
      if (!descriptionEn || !descriptionTe)
        return toast.error("Both descriptions are required!");
      if (!categoryEn || !categoryTe)
        return toast.error("Both categories are required!");
      if (!tagsEn.length && !tagsTe.length)
        return toast.error("At least one tag is required!");

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
      formData.append("mainFile", mainFile);
      formData.append("tagsEn", tagsEn.join(","));
      formData.append("tagsTe", tagsTe.join(","));

      const res = await addNewsPost(formData);

      if (res?.status === "success") {
        toast.success(res?.message);
        resetForm();
      } else {
        toast.error(res?.message || "Failed to add news");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while posting!");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setTitleEn("");
    setTitleTe("");
    setCategoryEn("");
    setCategoryTe("");
    setSubCategoryEn("");
    setSubCategoryTe("");
    setDescriptionEn("");
    setDescriptionTe("");
    setMainFile(null);
    setPreview(null);
    setTagsEn([]);
    setTagsTe([]);
    setMovieRating(0);
  };

  // ✅ Tags handling
  const handleTags = (e, lang) => {
    e.preventDefault();
    if (lang === "en" && tagsTextEn.trim()) {
      setTagsEn([...tagsEn, ...tagsTextEn.split(",").map((t) => t.trim())]);
      setTagsTextEn("");
    }
    if (lang === "te" && tagsTextTe.trim()) {
      setTagsTe([...tagsTe, ...tagsTextTe.split(",").map((t) => t.trim())]);
      setTagsTextTe("");
    }
  };

  const removeTag = (tagToRemove, lang) => {
    if (lang === "en") setTagsEn(tagsEn.filter((t) => t !== tagToRemove));
    else setTagsTe(tagsTe.filter((t) => t !== tagToRemove));
  };

  return (
    <>
      <div className="write-news-container das-my20">
        <div className="das-news-container">
          <div className="das-news-container-title">Write News</div>
          <div className="write-news-section">
            {/* ✅ English & Telugu Titles */}
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

            {/* ✅ Image */}
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

            {/* ✅ Descriptions */}
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

            {/* ✅ Tags */}
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
                  {categoryEn === "news" && (
                    <option value="ts">Telengana</option>
                  )}
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

                  {categoryEn === "ott" && (
                    <option value="review">Review</option>
                  )}
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
                  {categoryTe === "news" && (
                    <option value="ts">TelTegana</option>
                  )}
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

                  {categoryTe === "ott" && (
                    <option value="review">Review</option>
                  )}
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

            {/* ✅ Rating for Reviews */}
            {categoryEn === "reviews" && (
              <div className="wns-box das-my20 das-py20">
                <h3>Movie Rating</h3>
                <select
                  className="br5"
                  value={movieRating}
                  onChange={(e) => setMovieRating(e.target.value)}
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            )}

            {/* ✅ Buttons */}
            <div className="other-details">
              <div className="cancel-news-btn btn" onClick={resetForm}>
                Cancel
              </div>
              {!isSaving ? (
                <div className="post-news-btn btn" onClick={handlePost}>
                  Post
                </div>
              ) : (
                <button className="is-submitting-btn btn">Submitting...</button>
              )}
            </div>
          </div>
        </div>
      </div>
      {isUpload && <UploadFile setIsUpload={setIsUpload} />}
    </>
  );
};

export default WriteNews;
