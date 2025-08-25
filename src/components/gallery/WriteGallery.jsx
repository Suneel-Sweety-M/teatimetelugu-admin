import JoditEditor from "jodit-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { addGallery } from "../../helper/apis";
import UploadFile from "../news/UploadFile";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const WriteGallery = () => {
  const { user } = useSelector((state) => state.teatimetelugu_admin);

  const [title, setTitle] = useState({ en: "", te: "" });
  const [name, setName] = useState({ en: "", te: "" });
  const [category, setCategory] = useState({ en: "", te: "" });
  const [description, setDescription] = useState({ en: "", te: "" });

  const [isUpload, setIsUpload] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setMediaFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const removeFile = (index) => {
    setMediaFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const renderPreview = (file, index) => {
    const fileURL = URL.createObjectURL(file);

    return (
      <div key={index} className="das-gg-img">
        <i className="fa fa-xmark" onClick={() => removeFile(index)}></i>
        <img src={fileURL} alt="pic" />
      </div>
    );
  };

  const handlePost = async () => {
    if (!title.en || !title.te) {
      toast.error("Please write title in both languages!");
      return;
    }

    setIsSaving(true);
    const formData = new FormData();

    formData.append("titleEn", title.en);
    formData.append("titleTe", title.te);

    formData.append("nameEn", name.en);
    formData.append("nameTe", name.te);

    formData.append("categoryEn", category.en);
    formData.append("categoryTe", category.te);

    formData.append("descriptionEn", description.en);
    formData.append("descriptionTe", description.te);

    mediaFiles.forEach((file) => {
      formData.append("mediaFiles", file);
    });

    try {
      const res = await addGallery(formData);

      if (res?.status === "success") {
        toast.success(res?.message);
        setTitle({ en: "", te: "" });
        setName({ en: "", te: "" });
        setCategory({ en: "", te: "" });
        setDescription({ en: "", te: "" });
        setMediaFiles([]);
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while posting!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="write-news-container das-my20">
        <div className="das-news-container">
          <div className="das-all-gallery-section-top das-d-flex das-jcsb aic">
            <span className="das-news-container-title">Add Gallery</span>
            <Link
              to={`/${user?._id}/dashboard/all-gallery`}
              className="das-d-flex aic"
            >
              <b className="color-blue">View All</b>
            </Link>
          </div>

          <div className="write-news-section">
            {/* Name */}
            <div className="wns-box das-my20 das-py20">
              <h3>Add English Name</h3>
              <input
                type="text"
                placeholder="eg. Elon Musk (EN)"
                className="br5"
                value={name.en}
                onChange={(e) => setName({ ...name, en: e.target.value })}
              />
            </div>
            <div className="wns-box das-my20 das-py20">
              <h3>Add Telugu Name</h3>
              <input
                type="text"
                placeholder="ఉదా: ఎలాన్ మస్క్ (TE)"
                className="br5 das-mt10"
                value={name.te}
                onChange={(e) => setName({ ...name, te: e.target.value })}
              />
            </div>

            {/* Title */}
            <div className="wns-box das-my20 das-py20">
              <h3>Add English Title</h3>
              <input
                type="text"
                placeholder="eg. Elon started... (EN)"
                className="br5"
                value={title.en}
                onChange={(e) => setTitle({ ...title, en: e.target.value })}
              />
            </div>
            <div className="wns-box das-my20 das-py20">
              <h3>Add Telugu Title</h3>
              <input
                type="text"
                placeholder="ఉదా: ఎలాన్ ప్రారంభించారు... (TE)"
                className="br5 das-mt10"
                value={title.te}
                onChange={(e) => setTitle({ ...title, te: e.target.value })}
              />
            </div>

            {/* Description */}
            <div className="wns-box das-my20 das-py20">
              <div className="das-d-flex das-jcsb">
                <h3>Add Description</h3>
                <div
                  className="upload-system-files br5 cp"
                  onClick={() => setIsUpload(true)}
                >
                  <b>Upload</b>
                  <i className="fa fa-cloud-arrow-up"></i>
                </div>
              </div>

              <h3>English</h3>
              <JoditEditor
                className="jodit-editor"
                value={description.en}
                onChange={(newContent) =>
                  setDescription({ ...description, en: newContent })
                }
              />
            </div>
            <div className="wns-box das-my20 das-py20">
              <h3>Telugu</h3>
              <JoditEditor
                className="jodit-editor"
                value={description.te}
                onChange={(newContent) =>
                  setDescription({ ...description, te: newContent })
                }
              />
            </div>

            {/* Gallery Images */}
            <div className="wns-box das-my20 das-py20">
              <h3>Add Images</h3>
              <div className="das-gallery-grid">
                {mediaFiles?.map((file, index) => renderPreview(file, index))}
                <input
                  type="file"
                  multiple
                  accept="image/*, gif/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id="galleryPics"
                />
                <label
                  htmlFor="galleryPics"
                  className="das-gg-img das-add-gg-img"
                >
                  <i className="fa fa-plus"></i>
                  <span>Add image</span>
                </label>
              </div>
            </div>

            {/* ✅ En Categories */}
            <div className="other-details">
              <div className="wns-box das-my20 das-py20">
                <h3 className="">English Category</h3>
                <select
                  name=""
                  id=""
                  className="br5"
                  value={category.en}
                  onChange={(e) => setCategory({ ...category, en: e.target.value })}
                >
                  <option value="">Select Here</option>
                  <option value="hero">Hero</option>
                  <option value="actress">Actress</option>
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
                  value={category.te}
                  onChange={(e) => setCategory({ ...category, te: e.target.value })}
                >
                  <option value="">Select Here</option>
                  <option value="హీరో">హీరో</option>
                  <option value="నటి">నటి</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="other-details">
              <div className="cancel-news-btn btn">Cancel</div>
              {!isSaving ? (
                <div className="post-news-btn btn" onClick={handlePost}>
                  Post
                </div>
              ) : (
                <button type="submit" className="is-submitting-btn btn">
                  Submitting...
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isUpload && <UploadFile setIsUpload={setIsUpload} />}
    </>
  );
};

export default WriteGallery;
