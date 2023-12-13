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
        const json = await response.json();
       
        if (!response.ok) {
          setIsLoading(false);
          setError(json.error);
        }
        if (response.ok) {
          // save the user to local storage
          localStorage.setItem("user", JSON.stringify(json));
    
          // update the authContext
          dispatch({ type: "LOGIN", payload: json });
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
