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

    axios.post('http://localhost:4003/login', formData)
      .then(response => {
        console.log(response.data);

        if (!response.status === 200) {
          setIsLoading(false);
          setError(response.data.error);
        }
        if (response.status === 200) {
          // save the user to local storage
          localStorage.setItem('user', JSON.stringify(response.data));

          // update the authContext
          dispatch({ type: 'LOGIN', payload: response.data });
          setIsLoading(false);
          setError(false);
        }

      })
      .catch((error) => {
        console.error(error);
      });
  };

  return { login, isLoading, error };
};
