import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  editUserPic,
  getUser,
  updateUserDetails,
  updateUserPassword,
} from "../../helper/apis";
import { toast } from "react-toastify";

const UpdateUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [update, setUpdate] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [mainFile, setMainFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [cnewPassword, setCNewPassword] = useState("");

  const findUser = useCallback(async () => {
    if (!userId || userId?.length !== 24) {
      navigate("/");
      toast.error("Invalid user ID.");
      return;
    }

    try {
      const res = await getUser(userId);
      if (res?.status === "fail") {
        navigate("/");
        toast.error("User not found.");
        return;
      }
      setCurrentUser(res?.user);
      setFullName(res?.user?.fullName);
      setEmail(res?.user?.email);
      setRole(res?.user?.role);
    } catch (error) {
      console.log(error);
    }
  }, [userId, navigate]);

  const handleImageUpload = (event) => {
    try {
      const file = event.target.files[0];
      setMainFile(file);

      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveProfile = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("profilePic", mainFile);

      const res = await editUserPic(formData, userId);
      if (res?.status === "success") {
        toast.success(res?.message);
        setPreview(null);
        setMainFile(null);
        findUser();
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const editProfile = async () => {
    try {
      setIsUpdating(true);

      const res = await updateUserDetails(userId, { fullName, email, role });
      if (res?.status === "success") {
        toast.success(res?.message);
        setUpdate("");
        setFullName("");
        setEmail("");
        setRole("");
        findUser();
      } else {
        toast.error(res?.message);
      }
      setIsUpdating(false);
    } catch (error) {
      console.log(error);
      setIsUpdating(false);
    }
  };

  const editPassword = async () => {
    try {
      setIsUpdating(true);

      const res = await updateUserPassword(
        { newPassword, cnewPassword },
        userId
      );
      if (res?.status === "success") {
        toast.success(res?.message);
        setUpdate("");
        setNewPassword("");
        setCNewPassword("");
        findUser();
      } else {
        toast.error(res?.message);
      }
      setIsUpdating(false);
    } catch (error) {
      console.log(error);
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    findUser();
  }, [findUser]);

  return (
    <>
      <div className="write-news-container das-profile-container das-my20">
        <div className="das-news-container">
          <div className="das-news-container-title">{fullName} Profile</div>
          <div className="add-writer-form">
            <div className="add-writer-form-left dfc">
              <div className="add-writer-form-img-section das-d-flex fdc">
                <label htmlFor="profilePic">
                  {preview ? (
                    <img
                      src={preview}
                      alt="default-img"
                      className="img-default cp"
                    />
                  ) : (
                    <img
                      src={
                        currentUser?.profileUrl ||
                        "https://res.cloudinary.com/demmiusik/image/upload/v1711703262/s66xmxvaoqky3ipbxskj.jpg"
                      }
                      alt="default-img"
                      className="img-default cp"
                    />
                  )}
                </label>
                <input
                  type="file"
                  accept="image/*, gif/*"
                  onChange={handleImageUpload}
                  name="profilePic"
                  id="profilePic"
                  style={{ display: "none" }}
                />

                {preview && !isSaving && (
                  <button className="btn mt10" onClick={saveProfile}>
                    Change
                  </button>
                )}

                {isSaving && (
                  <button className="is-submitting-btn btn mt10">
                    Submitting...
                  </button>
                )}
              </div>
            </div>
            <div className="add-writer-form-right dfc fdc">
              <div className="aw-form-input-section">
                <label htmlFor="fullname">Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  className="profile-input"
                  value={currentUser?.fullName || ""}
                  readOnly
                />
              </div>
              <div className="aw-form-input-section">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="profile-input"
                  value={currentUser?.email || ""}
                  readOnly
                />
              </div>
              <div className="aw-form-input-section">
                <label htmlFor="role">Role</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  className="profile-input"
                  value={currentUser?.role || ""}
                  readOnly
                />
              </div>
              <div className="das-profile-btns das-d-flex w100">
                <button
                  className="add-writer-btn btn"
                  onClick={() => setUpdate("details")}
                >
                  Edit Details
                </button>
                <button
                  className="add-writer-btn btn"
                  onClick={() => setUpdate("password")}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {update === "details" && (
        <div className="das-news-container">
          <div className="das-news-container-title">Update Details</div>
          <div className="add-writer-form-right w100 dfc fdc">
            <div className="aw-form-input-section">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="aw-form-input-section">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="aw-form-input-section">
              <label htmlFor="email">Role</label>
              <select
                type="text"
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="profile-input"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="writer">Writer</option>
              </select>
            </div>
            {isUpdating ? (
              <button className="is-submiting-btn btn w100">Saving...</button>
            ) : (
              <button className="add-writer-btn btn" onClick={editProfile}>
                Save
              </button>
            )}
          </div>
        </div>
      )}

      {update === "password" && (
        <div className="das-news-container">
          <div className="das-news-container-title">Update Password</div>
          <div className="add-writer-form-right w100 dfc fdc">
            <div className="aw-form-input-section">
              <label htmlFor="password">New Password</label>
              <input
                type="text"
                id="password"
                name="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="aw-form-input-section">
              <label htmlFor="password">Confirm Password</label>
              <input
                type="text"
                id="password"
                name="password"
                value={cnewPassword}
                onChange={(e) => setCNewPassword(e.target.value)}
              />
            </div>
            {isUpdating ? (
              <button className="is-submiting-btn btn w100">Saving...</button>
            ) : (
              <button className="add-writer-btn btn" onClick={editPassword}>
                Save
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateUser;
