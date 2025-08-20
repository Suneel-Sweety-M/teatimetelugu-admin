import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { langChange } from "../../redux/userSlice";

const Topbar = ({ setBars }) => {
  const { user, lang } = useSelector((state) => state.teatimetelugu_admin);
  const dispatch = useDispatch();

  const handleLanguageChange = (e) => {
    dispatch(langChange(e.target.value));
  };

  return (
    <div className="dashboard-topbar">
      <div className="das-topbar-left">
        <Link to="/" className="das-topbar-left-logo">
          <img src="/assets/ttt-logo.jpg" alt="logo" />
        </Link>
      </div>

      <div className="das-topbar-right">
        <div className="lang-toggle">
          <select value={lang} onChange={handleLanguageChange}>
            <option value="en">English</option>
            <option value="te">Telugu</option>
          </select>
        </div>
        <div className="das-topbar-right-user">
          <div className="das-tru-text">
            <b>{user?.fullName}</b>
            <span className="text-capital">{user?.role}</span>
          </div>
          <img src={user?.profileUrl} alt="pic" />
        </div>
        <i className="fa fa-bars" onClick={() => setBars(true)}></i>
      </div>
    </div>
  );
};

export default Topbar;
