import axios from "axios";
import { logout } from "../redux/userSlice";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL;

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
  withCredentials: true,
});

export const apiRequest = async ({ url, data, method }) => {
  try {
    const result = await API(url, {
      method: method || "GET",
      data: data || {},
    });

    return result?.data;
  } catch (error) {
    const err = error.response?.data || { message: "Something went wrong" };
    toast.error(err.message);
    return { status: "fail", message: err.message };
  }
};

/*========= API REQUESTES ===========*/

export const loginUser = async (data) => {
  try {
    const res = await apiRequest({
      url: "/auth/login",
      data: data,
      method: "POST",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const logoutUser = async (dispatch, navigate) => {
  try {
    dispatch(logout());
    const res = await apiRequest({
      url: "/auth/logout",
      method: "POST",
    });
    navigate("/");
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getLoggedinUser = async () => {
  try {
    const uri = "/user/me";
    const res = await apiRequest({
      url: uri,
      method: "GET",
    });

    return res;
  } catch (error) {
    const err = error?.response?.data;
    console.log(error);
    return { status: "fail", message: err.message };
  }
};

//========= ADMIN ==== NEWS ==========
export const addNewsPost = async (data) => {
  try {
    const res = await apiRequest({
      url: "/news/add",
      data,
      method: "POST",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getNewsById = async (id) => {
  try {
    const res = await apiRequest({
      url: `/news/${id}`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getFilteredNews = async (
  category,
  time,
  searchText,
  writer,
  page,
  limit
) => {
  try {
    const params = new URLSearchParams({
      category: category || "",
      time: time || "",
      searchText: searchText || "",
      writer: writer || "",
      page: page || 1,
      limit: limit || 10,
    });

    const res = await apiRequest({
      url: `/news/filter?${params.toString()}`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateNewsPost = async (id, data) => {
  try {
    const res = await apiRequest({ 
      url: `/news/edit/${id}`,
      data,
      method: "PUT",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteNewsPost = async (id) => {
  try {
    const res = await apiRequest({
      url: `/news/delete/${id}`,
      method: "DELETE",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};
//===============================

export const addFileForLink = async (data) => {
  try {
    const res = await apiRequest({
      url: "/home/set-files-links",
      method: "POST",
      data,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getFileLink = async () => {
  try {
    const res = await apiRequest({
      url: "/home/get-files-links",
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

//========== ADMIN ==== GALLERY ===========
export const addGallery = async (data) => {
  try {
    const res = await apiRequest({
      url: "/gallery/add",
      data,
      method: "POST",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getGalleryById = async (id) => {
  try {
    const res = await apiRequest({
      url: `/gallery/${id}`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getFilteredGallery = async (
  category,
  time,
  searchText,
  page,
  limit
) => {
  try {
    const params = new URLSearchParams({
      category: category || "",
      time: time || "",
      searchText: searchText || "",
      page: page || 1,
      limit: limit || 8,
    });

    const res = await apiRequest({
      url: `/gallery/filter?${params.toString()}`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const editGallery = async (id, data) => {
  try {
    const res = await apiRequest({
      url: `/gallery/edit/${id}`,
      data,
      method: "PUT",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteGallery = async (id) => {
  try {
    const res = await apiRequest({
      url: `/gallery/delete/${id}`,
      method: "DELETE",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

//========== ADMIN ==== VIDEOS ==========
export const addVideo = async (data) => {
  try {
    const res = await apiRequest({
      url: "/videos/add",
      method: "POST",
      data,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getFilteredVideos = async (
  category,
  time,
  searchText,
  page,
  limit
) => {
  try {
    const params = new URLSearchParams({
      category: category || "",
      time: time || "",
      searchText: searchText || "",
      page: page || 1,
      limit: limit || 8,
    });

    const res = await apiRequest({
      url: `/videos/filter?${params.toString()}`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteVideo = async (id) => {
  try {
    const res = await apiRequest({
      url: `/videos/${id}`,
      method: "DELETE",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

//=========== ADMIN ==== Collections Releases =============

export const getMovieReleases = async () => {
  try {
    const res = await apiRequest({
      url: "/home/get-movie-releases",
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getMovieCollections = async () => {
  try {
    const res = await apiRequest({
      url: "/home/get-movie-collections",
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addMovieReleases = async (data) => {
  try {
    const res = await apiRequest({
      url: "/home/add-movie-releases",
      method: "POST",
      data,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const editMovieRelease = async (data) => {
  try {
    const res = await apiRequest({
      url: "/home/edit-movie-release",
      method: "PUT",
      data,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteMovieRelease = async (id) => {
  try {
    const res = await apiRequest({
      url: `/home/delete-movie-release/${id}`,
      method: "DELETE",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addMovieCollections = async (data) => {
  try {
    const res = await apiRequest({
      url: "/home/add-movie-collections",
      method: "POST",
      data,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const editMovieCollection = async (data) => {
  try {
    const res = await apiRequest({
      url: "/home/edit-movie-collection",
      method: "PUT",
      data,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteMovieCollection = async (id) => {
  try {
    const res = await apiRequest({
      url: `/home/delete-movie-collection/${id}`,
      method: "DELETE",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

//=========== Ads And Posters ====================

export const getPopupPoster = async () => {
  try {
    const res = await apiRequest({
      url: "/home/get-popup-poster",
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const setPopupPoster = async (data) => {
  try {
    const res = await apiRequest({
      url: "/home/set-popup-poster",
      method: "POST",
      data,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getMoviePoster = async () => {
  try {
    const res = await apiRequest({
      url: "/home/get-movie-poster",
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const setMoviePoster = async (data) => {
  try {
    const res = await apiRequest({
      url: "/home/set-movie-poster",
      method: "POST",
      data,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getNavbarAd = async () => {
  try {
    const res = await apiRequest({
      url: "/home/get-navbar-ad",
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const setNavbarAd = async (data) => {
  try {
    const res = await apiRequest({
      url: "/home/set-navbar-ad",
      method: "POST",
      data,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Home Ads
export const getHomeLongAd = async () => {
  try {
    const res = await apiRequest({
      url: "/home/get-home-long-ad",
      method: "GET",
    });
    return res;
  } catch (error) {
    console.error("Error getting home long ad:", error);
    throw error;
  }
};

export const setHomeLongAd = async (data) => {
  try {
    const res = await apiRequest({
      url: "/home/set-home-long-ad",
      method: "POST",
      data,
    });
    return res;
  } catch (error) {
    console.error("Error setting home long ad:", error);
    throw error;
  }
};

export const getHomeShortAd = async () => {
  try {
    const res = await apiRequest({
      url: "/home/get-home-short-ad",
      method: "GET",
    });
    return res;
  } catch (error) {
    console.error("Error getting home short ad:", error);
    throw error;
  }
};

export const setHomeShortAd = async (data) => {
  try {
    const res = await apiRequest({
      url: "/home/set-home-short-ad",
      method: "POST",
      data,
    });
    return res;
  } catch (error) {
    console.error("Error setting home short ad:", error);
    throw error;
  }
};

// Category Ads
export const getCategoryLongAd = async () => {
  try {
    const res = await apiRequest({
      url: "/home/get-category-long-ad",
      method: "GET",
    });
    return res;
  } catch (error) {
    console.error("Error getting category long ad:", error);
    throw error;
  }
};

export const setCategoryLongAd = async (data) => {
  try {
    const res = await apiRequest({
      url: "/home/set-category-long-ad",
      method: "POST",
      data,
    });
    return res;
  } catch (error) {
    console.error("Error setting category long ad:", error);
    throw error;
  }
};

export const getCategoryShortAd = async () => {
  try {
    const res = await apiRequest({
      url: "/home/get-category-short-ad",
      method: "GET",
    });
    return res;
  } catch (error) {
    console.error("Error getting category short ad:", error);
    throw error;
  }
};

export const setCategoryShortAd = async (data) => {
  try {
    const res = await apiRequest({
      url: "/home/set-category-short-ad",
      method: "POST",
      data,
    });
    return res;
  } catch (error) {
    console.error("Error setting category short ad:", error);
    throw error;
  }
};

// News Ads
export const getNewsLongAd = async () => {
  try {
    const res = await apiRequest({
      url: "/home/get-news-long-ad",
      method: "GET",
    });
    return res;
  } catch (error) {
    console.error("Error getting news long ad:", error);
    throw error;
  }
};

export const setNewsLongAd = async (data) => {
  try {
    const res = await apiRequest({
      url: "/home/set-news-long-ad",
      method: "POST",
      data,
    });
    return res;
  } catch (error) {
    console.error("Error setting news long ad:", error);
    throw error;
  }
};

export const getNewsShortAd = async () => {
  try {
    const res = await apiRequest({
      url: "/home/get-news-short-ad",
      method: "GET",
    });
    return res;
  } catch (error) {
    console.error("Error getting news short ad:", error);
    throw error;
  }
};

export const setNewsShortAd = async (data) => {
  try {
    const res = await apiRequest({
      url: "/home/set-news-short-ad",
      method: "POST",
      data,
    });
    return res;
  } catch (error) {
    console.error("Error setting news short ad:", error);
    throw error;
  }
};

//=========== ADMIN ==== User Management ==========

export const getUser = async (id) => {
  try {
    const res = await apiRequest({
      url: `/user/${id}`,
      method: "GET",
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await apiRequest({
      url: `/user/me`,
      method: "GET",
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getAdminsWriters = async () => {
  try {
    const res = await apiRequest({
      url: `/user/admins-and-writers`,
      method: "GET",
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getAllAdminsWriters = async () => {
  try {
    const res = await apiRequest({
      url: `/user/admin/admins-and-writers`,
      method: "GET",
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const editUserPic = async (data, id) => {
  try {
    const res = await apiRequest({
      url: `/user/edit-profile-pic/${id}`,
      method: "PUT",
      data,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateUserDetails = async (id, data) => {
  try {
    const res = await apiRequest({
      url: `/user/${id}/update-details`,
      method: "POST",
      data,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateUserPassword = async (data, id) => {
  try {
    const res = await apiRequest({
      url: `/user/${id}/update-password`,
      method: "PUT",
      data,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateActiveStatus = async (id) => {
  try {
    const res = await apiRequest({
      url: `/user/${id}/update-active-status`,
      method: "PUT",
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const registerUserByAdmin = async (data) => {
  try {
    const res = await apiRequest({
      url: "/user/register-user-by-admin",
      data: data,
      method: "POST",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const userLangChange = async (data) => {
  try {
    const res = await apiRequest({
      url: "/user/lang-change",
      data: data,
      method: "PUT",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

//========== Home Section Management ==========

export const getDashData = async () => {
  try {
    const res = await apiRequest({
      url: "/home/data",
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addFeaturedPosts = async (data) => {
  try {
    const res = await apiRequest({
      url: "/home/set-featured-posts",
      method: "PUT",
      data,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getFeaturedPosts = async () => {
  try {
    const res = await apiRequest({
      url: "/home/get-featured-posts",
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addBreakingNews = async (data) => {
  try {
    const res = await apiRequest({
      url: "/home/set-breaking-news",
      method: "PUT",
      data,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getBreakingNews = async () => {
  try {
    const res = await apiRequest({
      url: "/home/get-breaking-news",
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addTopNinePosts = async (data) => {
  try {
    const res = await apiRequest({
      url: "/home/set-top-nine",
      method: "POST",
      data,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getTopNinePosts = async () => {
  try {
    const res = await apiRequest({
      url: "/home/get-top-nine",
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addTrendsPosts = async (data) => {
  try {
    const res = await apiRequest({
      url: "/home/set-trends",
      method: "PUT",
      data,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getTrendsPosts = async () => {
  try {
    const res = await apiRequest({
      url: "/home/get-trends",
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addHotTopics = async (data) => {
  try {
    const res = await apiRequest({
      url: "/home/set-hot-topics",
      method: "POST",
      data,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getHotTopics = async () => {
  try {
    const res = await apiRequest({
      url: "/home/get-hot-topics",
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addCategoryTopPosts = async (data) => {
  try {
    const res = await apiRequest({
      url: "/home/set-category-top",
      method: "POST",
      data,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getCategoryTopPosts = async (category) => {
  try {
    const res = await apiRequest({
      url: `/home/get-category-top?category=${category}`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};
