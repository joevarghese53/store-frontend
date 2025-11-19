// pages/UpdateProfilePage.js (or whatever filename you use)
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../redux/api/usersApiSlice";
import { setCredentials } from "../redux/features/auth/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "../styles/Auth.module.css";
import Link from "next/link";

const UpdateProfilePage = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");            // optional
  const [confirmPassword, setConfirmPassword] = useState(""); // optional
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth);

  // If not logged in, redirect to login
  useEffect(() => {
    if (!userInfo) {
      router.push("/LoginPage");
    }
  }, [userInfo, router]);

  // ✅ Get latest profile from backend
  const {
    data: profile,
    isLoading: loadingProfile,
    isError: profileError,
    error: profileErrorData,
  } = useGetProfileQuery(undefined, { skip: !userInfo });

  // ✅ Mutation for updating profile
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useUpdateProfileMutation();

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible((prev) => !prev);

  // ✅ Initialize form fields from profile (fallback to userInfo)
  useEffect(() => {
    if (profile) {
      setUserName(profile.username);
      setEmail(profile.email);
    } else if (userInfo) {
      setUserName(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [profile, userInfo]);

  // Optional: surface profile load error in UI
  useEffect(() => {
    if (profileError && profileErrorData) {
      toast.error(profileErrorData?.data?.message || profileErrorData?.error || "Failed to load profile");
    }
  }, [profileError, profileErrorData]);

  //Handle Submit
  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    // Only validate password if user typed something
    if (password || confirmPassword) {
      const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

      if (!passwordPattern.test(password)) {
        setError(
          <>
            Password must include:
            <br />- At least one uppercase letter
            <br />- One lowercase letter
            <br />- One number
            <br />- One special character
            <br />- Be at least 8 characters long.
          </>
        );
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    try {
      // Build payload: only send password if user actually wants to change it
      const payload = {
        username,
        email, // email is read-only in UI, but backend still expects it
        ...(password ? { password } : {}),
      };

      const res = await updateProfile(payload).unwrap();

      // ⚠️ Backend response does NOT include accessToken,
      // so we must keep the old one from Redux:
      dispatch(
        setCredentials({
          ...userInfo,
          username: res.username,
          email: res.email,
        })
      );

      toast.success("Profile updated successfully");
      setPassword("");
      setConfirmPassword("");

    } catch (err) {

      setError(err?.data?.message || err?.error || err?.message || "Update failed")

    }
  };

  // Initial load state
  if (!userInfo || (loadingProfile && !profile)) {
    return (
      <div className={styles["auth-bg"]}>
        <div className={styles["auth-card"]}>
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className={styles["auth-bg"]}>
      <div className={styles["auth-card"]}>
        <h2 className={styles["auth-title"]}>Update Profile</h2>

        {error && <div className={styles["auth-error"]}>{error}</div>}

        <form
          className={styles["auth-form"]}
          onSubmit={submitHandler}
          autoComplete="off"
        >
          {/* Name */}
          <div className={styles["auth-label"]} style={{ marginBottom: 0 }}>
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

          {/* Email (readonly) */}
          <div className={styles["auth-label"]} style={{ marginBottom: 0 }}>
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

          {/* Password (optional) */}
          <div className={styles["auth-label"]} style={{ marginBottom: 0 }}>
            <label htmlFor="password">New Password (optional)</label>
          </div>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter new password (leave blank to keep current)"
              className={styles["auth-input"]}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
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

          {/* Confirm Password (only needed if password is filled) */}
          <div className={styles["auth-label"]} style={{ marginBottom: 0 }}>
            <label htmlFor="confirmPassword">Confirm New Password</label>
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
            // not `required` so user can update profile without changing password
            />
            <button
              type="button"
              className={styles["auth-eye"]}
              onClick={toggleConfirmPasswordVisibility}
              tabIndex={-1}
              aria-label={
                confirmPasswordVisible ? "Hide password" : "Show password"
              }
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

        <p className={styles["auth-link"]}>
          Want to go back? <Link href="/ProfilePage">Profile</Link>
        </p>
      </div>
    </div>
  );
};

export default UpdateProfilePage;
