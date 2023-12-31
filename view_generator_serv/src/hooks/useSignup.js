import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from 'axios';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (
    username,
    email,
    password,
    confirmPassword
  ) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);
    formData.append('email', email);



    axios.post('http://photogallery.com/api/userAcc/register', formData)
      .then(async (response) => {
        console.log(response.data);

        if (!response.status === 201) {
          setIsLoading(false);
          setError(response.data.error);
        }
        if (response.status === 201) {
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

  return { signup, isLoading, error };
};
