import React, { useState } from "react";
import Sidebar from '../components/sidebar/Sidebar';
import Topbar from '../components/topbar/Topbar';
import UpdateUser from "../components/profile/UpdateUser";

const UpdateUserProfile = () => {
  const [bars, setBars] = useState(false);
  return (
    <div className="dashboard-page">
      <div className={bars ? "mobile-left das-left" : "das-left"}>
        <Sidebar setBars={setBars} />
      </div>
      <div className={bars ? "mobile-right das-right" : "das-right"}>
        <Topbar setBars={setBars} />
        <div className="das-display">
          <UpdateUser />
        </div>
      </div>
    </div>
  );
};

export default UpdateUserProfile;
