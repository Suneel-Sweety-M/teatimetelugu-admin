// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../components/login/login.css";
import { toast } from "react-toastify";
import { login } from "../redux/userSlice";
import { loginUser } from "../helper/apis";
import { useDispatch } from "react-redux";

const Login = () => {
  const [seePassword, setSeePassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await loginUser(data);

      if (res?.status === "fail") {
        toast.error(res?.message || "Error");
      } else if (res?.status === "success") {
        toast.success(res?.message || "Success");
        const newData = {
          user: res?.user,
        };

        dispatch(login(newData));
        setData({
          email: "",
          password: "",
        });
        navigate(`${res?.user?._id}/dashboard`);
      } else {
        toast.info(res?.message || "Info");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <h1>Login Here</h1>

      <form onSubmit={onSubmit} className="login-page-signin-form" noValidate>
        <div className="login-page-join-input">
          <h3>Email</h3>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
            placeholder="Enter your email"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="login-page-join-input">
          <h3 className="login-page-password-label">Password</h3>
          <i
            className={
              seePassword
                ? "fa fa-eye password-see-hide"
                : "fa fa-eye-slash password-see-hide"
            }
            onClick={() => setSeePassword(!seePassword)}
          ></i>
          <input
            type={seePassword ? "text" : "password"}
            name="password"
            value={data.password}
            onChange={handleChange}
            className={errors.password ? "error" : ""}
            placeholder="Enter your password"
          />
          {errors.password && (
            <span className="error-text">{errors.password}</span>
          )}
        </div>

        <button
          type="submit"
          className={`login-page-login-btn login-btn ${
            isSubmitting ? "is-submitting-btn" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <Link to={"/forgot-password"} className="cp">
        <p>Forgot password?</p>
      </Link>

      {/* <div className="signup-link">
        <p>Don't have an account? <Link to="/register">Sign up</Link></p>
      </div> */}
    </div>
  );
};

export default Login;
