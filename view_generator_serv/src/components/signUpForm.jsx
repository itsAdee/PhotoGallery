import { useState } from "react";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signup, isLoading, error } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(userName, email, password, confirmPassword);
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      <label>User Name</label>
      <input
        type="text"
        onChange={(e) => setUserName(e.target.value)}
        value={userName}
      />
      <label>Email</label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <label>Password</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <label>Confirm Password</label>
      <input
        type="password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        value={confirmPassword}
      />
      <button disabled={isLoading}>Sign Up</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Signup;
