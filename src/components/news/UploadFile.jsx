import React, { useEffect, useState } from "react";
import { addFileForLink, getFileLink } from "../../helper/apis";
import { toast } from "react-toastify";

const UploadFile = ({ setIsUpload }) => {
  const [allLinks, setAllLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const getLinks = async () => {
    try {
      setIsLoading(true);
      const res = await getFileLink();
      if (res?.status === "success") {
        setAllLinks(res?.filesLinks);
      } else {
        toast.error(res?.message);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const submitFile = async (uploadedFile) => {
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", uploadedFile);

      const res = await addFileForLink(formData);
      if (res?.status === "success") {
        toast.success(res?.message);
        getLinks();
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const addFile = (f) => {
    if (!f) {
      return toast.error("Please select a file!");
    }
    submitFile(f);
  };

  useEffect(() => {
    getLinks();
  }, []);

  return (
    <div className="popup-container files-popup">
      <div className="uploaded-files-container br5 popup-img p10">
        <i className="fa fa-xmark" onClick={() => setIsUpload(false)}></i>
        <h1>Upload Files</h1>
        <p>Click on a file to copy link</p>
        <input
          type="file"
          accept="image/*"
          multiple={false}
          onChange={(e) => addFile(e.target.files[0])}
          style={{ display: "none" }}
          id="image"
        />
        <label
          htmlFor="image"
          className={
            !isUploading
              ? "upload-file-box br5 cp"
              : "upload-file-box br5 is-submitting-btn"
          }
        >
          {!isUploading ? (
            <i className="fa fa-cloud-arrow-up"></i>
          ) : (
            <b className="c-fff">Uploading...</b>
          )}
        </label>
        {!isLoading ? (
          <div className="">
            {allLinks?.length > 0 ? (
              <div className="uploaded-file-pre-grid das-gallery-grid">
                {allLinks.map((item, index) => (
                  <div
                    className="uploaded-file-pre das-gg-img"
                    key={index}
                    onClick={() => {
                      navigator.clipboard
                        .writeText(item)
                        .then(() => toast.success("Link copied to clipboard!"))
                        .catch((error) => toast.error("Failed to copy link"));
                    }}
                  >
                    <img src={item} alt="pic" />
                  </div>
                ))}
              </div>
            ) : (
              <p>No files</p>
            )}
          </div>
        ) : (
          <div className="uploaded-file-pre-grid das-gallery-grid">
            {[...Array(8)].map((_, index) => (
              <div className="uploaded-file-pre das-gg-img" key={index}>
                <img
                  src="https://res.cloudinary.com/demmiusik/image/upload/v1729620719/EET_cyxysf.png"
                  alt="pic"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
