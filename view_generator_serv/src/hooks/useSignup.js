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
    formData.append('email', email);

    
  
    axios.post('http://localhost:4003/register', formData)
      .then(async (response) => {
        console.log(response.data);
        
        if (!response.status === 201) {
          setIsLoading(false);
          setError(response.data.error);
        }
        if (response.status === 201) {
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

  return { signup, isLoading, error };
};
