import "./App.css";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AllNews from "./pages/AllNews";
import AddNews from "./pages/AddNews";
import EditNews from "./pages/EditNews";
import AddWriter from "./pages/AddWriter";
import PageNotFound from "./pages/PageNotFound";
import AllWriters from "./pages/AllWriters";
import AddGallery from "./pages/AddGallery";
import AllGallery from "./pages/AllGallery";
import AllVideos from "./pages/AllVideos";
import EditGallery from "./pages/EditGallery";
import CollectionsReleases from "./pages/CollectionsReleases";
import AdsPosters from "./pages/AdsPosters";
import Profile from "./pages/Profile";
import UpdateUserProfile from "./pages/UpdateUserProfile";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { login } from "./redux/userSlice";
import { ToastContainer } from "react-toastify";
import { getLoggedinUser } from "./helper/apis";
import Login from "./pages/Login";
import "./components/dashboard/dashboard.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.teatimetelugu_admin);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getLoggedinUser();
        if (res?.status !== "fail") {
          dispatch(login(res));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="app-loading">
        <img
          src="/assets/new-ttt-logo.jpg"
          alt="logo"
          className="loading-logo"
        />
        <p className="loading-text">Loading......</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Redirect to dashboard if user is logged in and tries to access login page */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={`/${user._id}/dashboard`} replace />
            ) : (
              <Login />
            )
          }
        />

        {/* Protected Routes - Redirect to login if not authenticated */}
        <Route
          path="/:uid/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" replace />}
        />
        <Route
          path="/:uid/dashboard/news"
          element={user ? <AllNews /> : <Navigate to="/" replace />}
        />
        <Route
          path="/:uid/dashboard/add-news"
          element={user ? <AddNews /> : <Navigate to="/" replace />}
        />
        <Route
          path="/:uid/dashboard/edit-news/:newsId"
          element={user ? <EditNews /> : <Navigate to="/" replace />}
        />
        <Route
          path="/:uid/dashboard/add-gallery"
          element={user ? <AddGallery /> : <Navigate to="/" replace />}
        />
        <Route
          path="/:uid/dashboard/all-gallery"
          element={user ? <AllGallery /> : <Navigate to="/" replace />}
        />
        <Route
          path="/:uid/dashboard/all-videos"
          element={user ? <AllVideos /> : <Navigate to="/" replace />}
        />
        <Route
          path="/:uid/dashboard/edit-gallery/:gid"
          element={user ? <EditGallery /> : <Navigate to="/" replace />}
        />
        <Route
          path="/:uid/dashboard/add-account"
          element={user ? <AddWriter /> : <Navigate to="/" replace />}
        />
        <Route
          path="/:uid/dashboard/collections-releases"
          element={user ? <CollectionsReleases /> : <Navigate to="/" replace />}
        />
        <Route
          path="/:uid/dashboard/posters-ads"
          element={user ? <AdsPosters /> : <Navigate to="/" replace />}
        />
        <Route
          path="/:uid/dashboard/writers"
          element={user ? <AllWriters /> : <Navigate to="/" replace />}
        />
        <Route
          path="/:uid/dashboard/profile"
          element={user ? <Profile /> : <Navigate to="/" replace />}
        />
        <Route
          path="/:uid/dashboard/update-profile/:userId"
          element={user ? <UpdateUserProfile /> : <Navigate to="/" replace />}
        />

        {/* Catch all route - redirect based on auth status */}
        <Route
          path="*"
          element={user ? <PageNotFound /> : <Navigate to="/" replace />}
        />
      </Routes>
    </>
  );
}

export default App;
