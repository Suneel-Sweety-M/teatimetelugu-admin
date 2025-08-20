import JoditEditor from "jodit-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { editGallery, getGalleryById } from "../../helper/apis";
import UploadFile from "../news/UploadFile";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const GalleryEdit = () => {
  const { user } = useSelector((state) => state.teatimetelugu_admin);
  const { gid } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState({ en: "", te: "" });
  const [name, setName] = useState({ en: "", te: "" });
  const [category, setCategory] = useState({ en: "", te: "" });
  const [description, setDescription] = useState({ en: "", te: "" });

  const [isUpload, setIsUpload] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]); // new uploads
  const [mediaLinks, setMediaLinks] = useState([]); // already uploaded
  const [removedImages, setRemovedImages] = useState([]); // to delete from AWS/Cloudinary

  const [isSaving, setIsSaving] = useState(false);

  // ✅ File input handler
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setMediaFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  // ✅ Remove pending new file
  const removeFile = (index) => {
    setMediaFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // ✅ Remove already uploaded image (keeps track for backend deletion)
  // ✅ Remove already uploaded image - FIXED
  const removeMediaLink = (index) => {
    const removed = mediaLinks[index];

    // Extract URL if it's an object, or use directly if it's a string
    const urlToRemove =
      typeof removed === "string" ? removed : removed.url || removed;

    setRemovedImages((prev) => [...prev, urlToRemove]);
    setMediaLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
  };

  // ✅ File Preview
  const renderPreview = (file, index) => {
    const fileURL = URL.createObjectURL(file);
    return (
      <div key={index} className="das-gg-img">
        <i className="fa fa-xmark" onClick={() => removeFile(index)}></i>
        <img src={fileURL} alt="preview" />
      </div>
    );
  };

  const fetchGallery = useCallback(async () => {
    try {
      const res = await getGalleryById(gid);

      if (res?.status === "success") {
        setTitle({
          en: res?.data?.title?.en || "",
          te: res?.data?.title?.te || "",
        });
        setName({
          en: res?.data?.name?.en || "",
          te: res?.data?.name?.te || "",
        });
        setDescription({
          en: res?.data?.description?.en || "",
          te: res?.data?.description?.te || "",
        });
        setMediaLinks(res?.data?.galleryPics);
        setCategory({
          en: res?.data?.category?.en || "",
          te: res?.data?.category?.te || "",
        });
      } else {
        toast.error(res?.message);
        navigate(`/${user?._id}/dashboard/all-gallery/`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while posting!");
    } finally {
      setIsSaving(false);
    }
  }, [gid, navigate, user?._id]);

  // ✅ Submit
  // ✅ Submit - FIXED VERSION
  const handlePost = async () => {
    if (!title.en || !title.te) {
      toast.error("Please enter title in both languages!");
      return;
    }

    setIsSaving(true);
    const formData = new FormData();

    // Text fields
    formData.append("titleEn", title.en);
    formData.append("titleTe", title.te);
    formData.append("nameEn", name.en);
    formData.append("nameTe", name.te);
    formData.append("categoryEn", category.en);
    formData.append("categoryTe", category.te);
    formData.append("descriptionEn", description.en);
    formData.append("descriptionTe", description.te);

    // ✅ New media uploads
    mediaFiles.forEach((file) => {
      formData.append("mediaFiles", file);
    });

    // ✅ FIX: Send removedImages as JSON string instead of individual entries
    if (removedImages.length > 0) {
      // Convert to array of URLs if objects, or use directly if strings
      const urlsToRemove = removedImages.map((img) =>
        typeof img === "string" ? img : img.url || img
      );
      formData.append("removedImages", JSON.stringify(urlsToRemove));
    } else {
      // Send empty array to avoid undefined
      formData.append("removedImages", JSON.stringify([]));
    }

    try {
      const res = await editGallery(gid, formData);

      if (res?.status === "success") {
        toast.success(res?.message);
        // Optional: redirect after success
        // navigate(`/${user?._id}/dashboard/all-gallery`);
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

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  return (
    <>
      <div className="write-news-container das-my20">
        <div className="das-news-container">
          <div className="das-all-gallery-section-top das-d-flex das-jcsb aic">
            <span className="das-news-container-title">Edit Gallery</span>
            <Link
              to={`/${user?._id}/dashboard/all-gallery`}
              className="das-d-flex aic"
            >
              <b className="color-blue">View All</b>
            </Link>
          </div>

          <div className="write-news-section">
            {/* ===== Name ===== */}
            <div className="wns-box das-my20 das-py20">
              <h3>Edit English Name</h3>
              <input
                type="text"
                placeholder="eg. Elon Musk (EN)"
                className="br5"
                value={name.en}
                onChange={(e) => setName({ ...name, en: e.target.value })}
              />
              <h3 className="das-mt10">Edit Telugu Name</h3>
              <input
                type="text"
                placeholder="ఉదా: ఎలాన్ మస్క్ (TE)"
                className="br5"
                value={name.te}
                onChange={(e) => setName({ ...name, te: e.target.value })}
              />
            </div>

            {/* ===== Title ===== */}
            <div className="wns-box das-my20 das-py20">
              <h3>Edit English Title</h3>
              <input
                type="text"
                placeholder="eg. Elon started... (EN)"
                className="br5"
                value={title.en}
                onChange={(e) => setTitle({ ...title, en: e.target.value })}
              />
              <h3 className="das-mt10">Edit Telugu Title</h3>
              <input
                type="text"
                placeholder="ఉదా: ఎలాన్ ప్రారంభించారు... (TE)"
                className="br5"
                value={title.te}
                onChange={(e) => setTitle({ ...title, te: e.target.value })}
              />
            </div>

            {/* ===== Description ===== */}
            <div className="wns-box das-my20 das-py20">
              <div className="das-d-flex das-jcsb">
                <h3>Edit Description</h3>
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
              <h3 className="das-mt10">Telugu</h3>
              <JoditEditor
                className="jodit-editor"
                value={description.te}
                onChange={(newContent) =>
                  setDescription({ ...description, te: newContent })
                }
              />
            </div>

            {/* ===== Images ===== */}
            <div className="wns-box das-my20 das-py20">
              <h3>Edit Images</h3>
              <div className="das-gallery-grid">
                {/* ✅ Already uploaded links */}
                {mediaLinks?.map((file, index) => (
                  <div key={index} className="das-gg-img">
                    <i
                      className="fa fa-xmark"
                      onClick={() => removeMediaLink(index)}
                    ></i>
                    <img src={file} alt="uploaded" />
                  </div>
                ))}
                {/* ✅ New uploads */}
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

            {/* ===== Categories ===== */}
            <div className="wns-box das-my20 das-py20">
              <h3>English Category</h3>
              <select
                className="br5"
                value={category.en}
                onChange={(e) =>
                  setCategory({ ...category, en: e.target.value })
                }
              >
                <option value="">Select Here</option>
                <option value="hero">Hero</option>
                <option value="actress">Actress</option>
              </select>

              <h3 className="das-mt10">Telugu Category</h3>
              <select
                className="br5"
                value={category.te}
                onChange={(e) =>
                  setCategory({ ...category, te: e.target.value })
                }
              >
                <option value="">ఎంచుకోండి</option>
                <option value="హీరో">హీరో</option>
                <option value="నటి">నటి</option>
              </select>
            </div>

            {/* ===== Buttons ===== */}
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

export default GalleryEdit;
