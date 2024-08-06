// In a React component or a custom hook
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/features/auth/authSlice'; // Adjust path as needed

const useInitializeUser = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserInfo = localStorage.getItem("userInfo");
      if (storedUserInfo && !userInfo) {
        dispatch(setCredentials(JSON.parse(storedUserInfo)));
      }
    }
  }, [dispatch, userInfo]);

  return userInfo;
};

export default useInitializeUser;
