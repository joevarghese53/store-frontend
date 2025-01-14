import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useProfileMutation } from "../redux/api/usersApiSlice";
import { setCredentials } from "../redux/features/auth/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // for password validation error
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggle for password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // Toggle for confirm password visibility

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  // Toggle password visibility
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
      setError((
        <>
          Password must include:
          <br /> - At least one uppercase letter
          <br /> - One lowercase letter
          <br /> - One number
          <br /> - One special character
          <br /> - Be at least 8 characters long.
        </>
      ));

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
    <div className="update-profile-main-container">
      <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={submitHandler}>
        <div className="update-form-input">
          <label className="block text-black mb-2">Name</label>
          <input
            type="text"
            placeholder="Enter name"
            className="form-input p-4 rounded-sm w-full"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className="update-form-input">
          <label className="block text-black mb-2">Email Address</label>
          <input
            type="email"
            placeholder="Enter email"
            className="form-input p-4 rounded-sm w-full"
            value={email}
            readOnly
          />
        </div>

        <div className="update-form-input">
          <label className="block text-black mb-2">Password</label>
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Enter new password"
            className="form-input p-4 rounded-sm w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="update-profile-password-field-eye-icon"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />} {/* Toggle icon */}
          </button>
        </div>

        <div className="update-form-input">
          <label className="block text-black mb-2">Confirm Password</label>
          <input
            type={confirmPasswordVisible ? "text" : "password"}  // Toggle between text and password
            placeholder="Confirm new password"
            className="form-input p-4 rounded-sm w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className="update-profile-password-field-eye-icon"
            onClick={toggleConfirmPasswordVisibility}
          >
            {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />} {/* Toggle icon */}
          </button>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
          >
            Update
          </button>

        </div>
        {loadingUpdateProfile && <Loader />}
      </form>
    </div>
  );
};

export default Profile;
