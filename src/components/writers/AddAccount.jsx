import React, { useState } from "react";
import { registerUserByAdmin } from "../../helper/apis";
import { toast } from "react-toastify";

const AddAccount = () => {
  const [accountData, setAccountData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleJoin = async () => {
    if (
      !accountData.fullName ||
      !accountData.email ||
      !accountData.password ||
      !accountData.role
    ) {
      toast.info("Fill all fields");
      return;
    }
    try {
      const res = await registerUserByAdmin(accountData);
      if (res?.status === "success") {
        setAccountData({
          fullName: "",
          email: "",
          password: "",
          role: "",
        });
        toast.success(res?.message);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="add-writer-container das-m20 bgc-fff br5 p20">
      <div className="add-writer-container-title fw5 fs22">Add Account</div>
      <div className="add-writer-form">
        {/* <div className="add-writer-form-left dfc">
          <div className="add-writer-form-img-section das-d-flex fdc">
            <img src="https://res.cloudinary.com/demmiusik/image/upload/v1711703262/s66xmxvaoqky3ipbxskj.jpg" alt="default-img" className="img-default" />
            <button className="btn mt10">Upload</button>
          </div>
        </div> */}
        <div className="add-writer-form-right dfc fdc">
          <div className="aw-form-input-section">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullName"
              placeholder="eg. Suneel Mekala"
              value={accountData.fullName}
              onChange={handleChange}
            />
          </div>
          <div className="aw-form-input-section">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="eg. suneel@eetnews.com"
              value={accountData.email}
              onChange={handleChange}
            />
          </div>
          <div className="aw-form-input-section">
            <label htmlFor="password">Password</label>
            <input
              type="text"
              id="password"
              name="password"
              placeholder="eg. x$25YaffcRjn9#9x"
              value={accountData.password}
              onChange={handleChange}
            />
          </div>
          <div className="aw-form-input-section">
            <label htmlFor="role">Role</label>
            <select
              name="role"
              id="role"
              className="br5 p10 cp"
              value={accountData.role}
              onChange={handleChange}
            >
              <option value="">Select Here</option>
              <option value="writer">Writer</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <button className="add-writer-btn btn" onClick={handleJoin}>
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAccount;
