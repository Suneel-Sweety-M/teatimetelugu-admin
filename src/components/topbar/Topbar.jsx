import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { langChange } from "../../redux/userSlice";
import { userLangChange } from "../../helper/apis";
import { toast } from "react-toastify";
import "./toggle.css";

const Topbar = ({ setBars }) => {
  const { user, lang } = useSelector((state) => state.teatimetelugu_admin);
  const dispatch = useDispatch();

  const handleLanguageChange = async (e) => {
    dispatch(langChange(e.target.value));
    try {
      const res = await userLangChange({ lang: e.target.value });
      if (res?.status !== "success") {
        toast.error("Failed to change language!");
      }
    } catch (error) {
      toast.error("Failed to change language!");
    }
  };

  return (
    <div className="dashboard-topbar">
      <div className="das-topbar-left">
        <Link to="/" className="das-topbar-left-logo">
          <img src="/assets/ttt-logo.jpg" alt="logo" />
        </Link>
      </div>

      <div className="das-topbar-right">
        <div
          className="toggle-container"
          onClick={() =>
            handleLanguageChange({
              target: { value: lang === "en" ? "te" : "en" },
            })
          }
        >
          <div className={`toggle-track ${lang === "te" ? "active" : ""}`}>
            <div className="toggle-thumb"></div>
          </div>
          <div className="language-labels">
            <span className={lang === "en" ? "active" : ""}>EN</span>
            <span className={lang === "te" ? "active" : ""}>TE</span>
          </div>
        </div>
        {/* <div className="lang-toggle">
          <select value={lang} onChange={handleLanguageChange}>
            <option value="en">English</option>
            <option value="te">Telugu</option>
          </select>
        </div> */}
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
