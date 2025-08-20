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

//========= NEWS ==========
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
  safeCursor,
  direction,
  itemsPerPage
) => {
  try {
    const params = new URLSearchParams({
      category: category || "",
      time: time || "",
      searchText: searchText || "",
      writer: writer || "",
      direction: direction || "next",
      limit: itemsPerPage || 10,
    });

    // 🚀 Only append if valid
    if (safeCursor && safeCursor !== "null" && safeCursor !== "undefined") {
      params.append("cursor", safeCursor);
    }

    const res = await apiRequest({
      url: `/news/filter?${params.toString()}`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getWritersAndAdmins = async () => {
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
      url: "/dashboard/set-files-links",
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
      url: "/dashboard/get-files-links",
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

//========== GALLERY ===========
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
    const query = new URLSearchParams({
      category,
      time,
      searchText,
      page,
      limit,
    });

    const res = await apiRequest({
      url: `/gallery/filter?${query.toString()}`,
      method: "GET",
    });
    return res;
  } catch (error) {
    console.error(error);
    return { status: "fail", message: "API error" };
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

//========== VIDEOS ==========
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

export const getFilteredVideos = async (category, time, searchText) => {
  try {
    const params = new URLSearchParams({
      category: category || "",
      time: time || "",
      searchText: searchText || "",
    });

    const res = await apiRequest({
      url: `/videos/query?${params.toString()}`,
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
