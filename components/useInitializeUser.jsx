// In a React component or a custom hook
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/features/auth/authSlice'; // Adjust path as needed

const useInitializeUser = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserInfo = localStorage.getItem("userInfo");
      if (storedUserInfo && !userInfo) {
        dispatch(setCredentials(JSON.parse(storedUserInfo)));
      }
      setLoading(false);
    }
  }, [dispatch, userInfo]);

  return { userInfo, loading };
};

export default useInitializeUser;
