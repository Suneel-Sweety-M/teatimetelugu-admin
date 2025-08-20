import React, { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import GalleryEdit from "../components/gallery/GalleryEdit";
import Topbar from "../components/topbar/Topbar";

const EditGallery = () => {
  const [bars, setBars] = useState(false);
  return (
    <div className="dashboard-page">
      <div className={bars ? "mobile-left das-left" : "das-left"}>
        <Sidebar setBars={setBars} />
      </div>
      <div className={bars ? "mobile-right das-right" : "das-right"}>
        <Topbar setBars={setBars} />
        <div className="das-display">
          <GalleryEdit />
        </div>
      </div>
    </div>
  );
};

export default EditGallery;
