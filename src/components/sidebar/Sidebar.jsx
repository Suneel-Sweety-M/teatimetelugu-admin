import React, { useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../helper/apis";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = ({ setBars }) => {
  const { user } = useSelector((state) => state.teatimetelugu_admin);
  const location = useLocation();
  //   const { uid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutPopup, setLogoutPopup] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutCancel = useCallback(() => {
    setLogoutPopup(false);
  }, []);

  const basePath = `/${user?._id}/dashboard`;

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser(dispatch, navigate);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [dispatch, navigate]);

  //   useEffect(() => {
  //     if (!user || !uid) return;

  //     // validate uid length
  //     if (uid.length !== 24) {
  //       navigate("/");
  //       return;
  //     }

  //     // check if uid matches user._id
  //     if (String(uid) !== String(user._id)) {
  //       navigate("/");
  //       return;
  //     }

  //     // check role
  //     if (!(user.role === "writer" || user.role === "admin")) {
  //       navigate("/");
  //       return;
  //     }
  //   }, [navigate, uid, user]);

  document.title = "Dashboard | Tea Time Telugu";

  return (
    <>
      <div className="das-sidebar">
        <Link to="/" className="sidebar-logo">
          <img src="/assets/new-ttt-logo.jpg" alt="logo" />
        </Link>
        <div className="sidebar-tabs">
          <Link
            to={basePath}
            className={`sidebar-tab ${
              location.pathname === basePath ? "sb-active" : ""
            }`}
          >
            <i className="fa fa-home"></i>
            <span>Dashboard</span>
          </Link>
          <Link
            to={`${basePath}/news`}
            className={`sidebar-tab ${
              location.pathname === `${basePath}/news` ? "sb-active" : ""
            }`}
          >
            <i className="fa fa-newspaper"></i>
            <span>All News</span>
          </Link>
          <Link
            to={`${basePath}/add-news`}
            className={`sidebar-tab ${
              location.pathname === `${basePath}/add-news` ? "sb-active" : ""
            }`}
          >
            <i className="fa fa-plus"></i>
            <span>Add News</span>
          </Link>
          <Link
            to={`${basePath}/all-gallery`}
            className={`sidebar-tab ${
              location.pathname === `${basePath}/all-gallery` ||
              location.pathname === `${basePath}/add-gallery`
                ? "sb-active"
                : ""
            }`}
          >
            <i className="fa fa-image"></i>
            <span>Gallery</span>
          </Link>
          <Link
            to={`${basePath}/all-videos`}
            className={`sidebar-tab ${
              location.pathname === `${basePath}/all-videos` ? "sb-active" : ""
            }`}
          >
            <i className="fa fa-video"></i>
            <span>Videos</span>
          </Link>
          <Link
            to={`${basePath}/collections-releases`}
            className={`sidebar-tab ${
              location.pathname === `${basePath}/collections-releases`
                ? "sb-active"
                : ""
            }`}
          >
            <i className="fa fa-ticket"></i>
            <span>Collections & Releases</span>
          </Link>
          <Link
            to={`${basePath}/posters-ads`}
            className={`sidebar-tab ${
              location.pathname === `${basePath}/posters-ads` ? "sb-active" : ""
            }`}
          >
            <i className="fa-solid fa-rectangle-ad"></i>
            <span>Posters & Ads</span>
          </Link>
          {user?.role === "admin" && (
            <Link
              to={`${basePath}/add-account`}
              className={`sidebar-tab ${
                location.pathname === `${basePath}/add-account`
                  ? "sb-active"
                  : ""
              }`}
            >
              <i className="fa fa-user-plus"></i>
              <span>Add Account</span>
            </Link>
          )}
          {user?.role === "admin" && (
            <Link
              to={`${basePath}/writers`}
              className={`sidebar-tab ${
                location.pathname === `${basePath}/writers` ? "sb-active" : ""
              }`}
            >
              <i className="fa fa-users"></i>
              <span>Writers</span>
            </Link>
          )}
          <Link
            to={`${basePath}/profile`}
            className={`sidebar-tab ${
              location.pathname === `${basePath}/profile` ? "sb-active" : ""
            }`}
          >
            <i className="fa fa-user"></i>
            <span>Profile</span>
          </Link>
          <div className="sidebar-tab" onClick={() => setLogoutPopup(true)}>
            <i className="fa fa-right-from-bracket"></i>
            <span>Logout</span>
          </div>
          <div
            className="sidebar-tab sidebar-close-btn color-grey"
            onClick={() => setBars(false)}
          >
            <i className="fa fa-xmark"></i>
            <span>Close</span>
          </div>
        </div>
      </div>
      {logoutPopup && (
        <div className="popup-news-container popup-container">
          <div className="br5 popup-img p10">
            <div className="das-news-container">
              <div className="popup-news-top das-d-flex das-jcsb">
                <div className="das-news-container-title">
                  Are you sure want to logout ?
                </div>
                <span className="popup-news-top-x das-mx20">
                  <i
                    className="fa fa-xmark"
                    onClick={() => setLogoutPopup(false)}
                  ></i>
                </span>
              </div>
              <div className="das-all-news-bottom das-mt20">
                <div className="news-popup-btns das-mx10">
                  <button className="btn" onClick={handleLogoutCancel}>
                    Cancel
                  </button>
                </div>

                <div className="news-popup-btns">
                  {!isLoggingOut ? (
                    <button className="btn save-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  ) : (
                    <button className="btn is-sending-btn">
                      Logging out...
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
