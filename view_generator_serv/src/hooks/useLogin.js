import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from 'axios';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    axios.post('http://photogallery.com/api/userAcc/login', formData)
      .then(response => {
        console.log(response.data);

        if (!response.status === 200) {
          setIsLoading(false);
          setError(response.data.error);
        }
        if (response.status === 200) {
          localStorage.setItem('user', JSON.stringify(response.data));

          dispatch({ type: 'LOGIN', payload: response.data });
          setIsLoading(false);
          setError(false);
        }

      })
      .catch((error) => {
        setIsLoading(false);
        if (error.response) {
          setError(error.response.data.message);
        } else if (error.request) {
          console.log(error.request);
        } else {
          setError(error.message);
        }
      });
  };

  return { login, isLoading, error };
};
