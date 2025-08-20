import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
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
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { login } from "./redux/userSlice";
import { ToastContainer } from "react-toastify";
import { getLoggedinUser } from "./helper/apis";
import Login from "./pages/Login";
import "./components/dashboard/dashboard.css";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getLoggedinUser();
        if (res?.status !== "fail") {
          dispatch(login(res));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/:uid/dashboard" element={<Dashboard />} />
        <Route path="/:uid/dashboard/news" element={<AllNews />} />
        <Route path="/:uid/dashboard/add-news" element={<AddNews />} />
        <Route
          path="/:uid/dashboard/edit-news/:newsId"
          element={<EditNews />}
        />
        <Route path="/:uid/dashboard/add-gallery" element={<AddGallery />} />
        <Route path="/:uid/dashboard/all-gallery" element={<AllGallery />} />
        <Route path="/:uid/dashboard/all-videos" element={<AllVideos />} />
        <Route
          path="/:uid/dashboard/edit-gallery/:gid"
          element={<EditGallery />}
        />
        <Route path="/:uid/dashboard/add-account" element={<AddWriter />} />
        <Route
          path="/:uid/dashboard/collections-releases"
          element={<CollectionsReleases />}
        />
        <Route path="/:uid/dashboard/posters-ads" element={<AdsPosters />} />
        <Route path="/:uid/dashboard/writers" element={<AllWriters />} />
        <Route path="/:uid/dashboard/profile" element={<Profile />} />
        <Route
          path="/:uid/dashboard/update-profile/:userId"
          element={<UpdateUserProfile />}
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
