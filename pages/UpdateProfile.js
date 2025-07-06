import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useProfileMutation } from "../redux/api/usersApiSlice";
import { setCredentials } from "../redux/features/auth/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "../styles/Auth.module.css";
import Link from "next/link";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordPattern.test(password)) {
      setError(
        <>
          Password must include:<br />- At least one uppercase letter<br />- One lowercase letter<br />- One number<br />- One special character<br />- Be at least 8 characters long.
        </>
      );
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
        setPassword("");
        setConfirmPassword("");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className={styles["auth-bg"]}>
      <div className={styles["auth-card"]}>
        <h2 className={styles["auth-title"]}>Update Profile</h2>
        {error && <div className={styles["auth-error"]}>{error}</div>}
        <form className={styles["auth-form"]} onSubmit={submitHandler} autoComplete="off">
          <div className={styles["auth-label"]} style={{marginBottom: 0}}>
            <label htmlFor="name">Name</label>
          </div>
          <input
            id="name"
            type="text"
            placeholder="Enter name"
            className={styles["auth-input"]}
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            autoComplete="off"
            required
          />
          <div className={styles["auth-label"]} style={{marginBottom: 0}}>
            <label htmlFor="email">Email Address</label>
          </div>
          <input
            id="email"
            type="email"
            placeholder="Enter email"
            className={styles["auth-input"]}
            value={email}
            readOnly
          />
          <div className={styles["auth-label"]} style={{marginBottom: 0}}>
            <label htmlFor="password">Password</label>
          </div>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter new password"
              className={styles["auth-input"]}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className={styles["auth-eye"]}
              onClick={togglePasswordVisibility}
              tabIndex={-1}
              aria-label={passwordVisible ? "Hide password" : "Show password"}
            >
              {passwordVisible ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <div className={styles["auth-label"]} style={{marginBottom: 0}}>
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>
          <div style={{ position: "relative" }}>
            <input
              id="confirmPassword"
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Confirm new password"
              className={styles["auth-input"]}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className={styles["auth-eye"]}
              onClick={toggleConfirmPasswordVisibility}
              tabIndex={-1}
              aria-label={confirmPasswordVisible ? "Hide password" : "Show password"}
            >
              {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <button
            type="submit"
            className={styles["auth-button"]}
            disabled={loadingUpdateProfile}
          >
            {loadingUpdateProfile ? <Loader /> : "Update"}
          </button>
        </form>
        <p className={styles['auth-link']}>
          Want to go back? <Link href="/ProfilePage">Profile</Link>
        </p>
      </div>
    </div>
  );
};

export default Profile;
