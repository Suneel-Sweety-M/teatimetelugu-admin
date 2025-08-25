import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllAdminsWriters, updateActiveStatus } from "../../helper/apis";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const WritersAdmins = () => {
  const { user } = useSelector((state) => state.teatimetelugu_admin);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await getAllAdminsWriters();
      if (res?.status === "success") {
        setAllUsers(res?.users);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const setActive = async (id) => {
    try {
      setUpdatingUserId(id); // Set the ID of the user being updated
      const res = await updateActiveStatus(id);

      if (res?.status === "success") {
        fetchData();
        toast.success("User active status updated successfully");
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dash-writers-container">
      <div className="das-news-container writers-container">
        <div className="das-news-container-title">Writers</div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="all-writers-section">
            {allUsers?.length < 1 ? (
              <p>No Admins or Writers found</p>
            ) : (
              allUsers?.map((u, index) => (
                <div
                  className="writer-profile-card box-shadow p20 m5 br5"
                  key={index}
                >
                  <img
                    src={
                      u?.profileUrl ||
                      "https://res.cloudinary.com/demmiusik/image/upload/v1711703262/s66xmxvaoqky3ipbxskj.jpg"
                    }
                    alt="pic"
                  />
                  <div className="writer-profile-details">
                    <div className="wpd-row">
                      <i className="fa fa-user"></i>
                      <span>{u?.fullName}</span>
                    </div>
                    <div className="wpd-row">
                      <i className="fa fa-envelope"></i>
                      <span>{u?.email}</span>
                    </div>
                    <div className="wpd-row">
                      <i className="fa fa-pen"></i>
                      <span>{u?.role}</span>
                    </div>
                    <div className="das-d-flex aic">
                      {updatingUserId === u?._id ? ( // Check if this user is being updated
                        <div className="is-submitting-btn btn fw5">
                          Updating...
                        </div>
                      ) : u?.isActive ? (
                        <button
                          className="add-writer-btn btn fw5 cp c-fff"
                          style={{ backgroundColor: "rgba(2, 211, 2, 0.7)" }}
                          onClick={() => setActive(u?._id)}
                        >
                          Active
                        </button>
                      ) : (
                        <button
                          className="add-writer-btn btn fw5 cp c-fff"
                          style={{ backgroundColor: "rgba(244, 6, 6, 0.6)" }}
                          onClick={() => setActive(u?._id)}
                        >
                          Inactive
                        </button>
                      )}
                      <Link
                        to={`/${user?._id}/dashboard/update-profile/${u?._id}`}
                        className="ml20"
                      >
                        <i className="fa fa-pen-to-square fs20"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WritersAdmins;
