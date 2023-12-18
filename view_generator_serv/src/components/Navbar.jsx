import React from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import "./css/styles.css";

function Navbar() {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  }

  return (
    <nav>
      <p>Photo Gallery</p>

      {user && (
        <div>
          <span>{user.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>

  )
}

export default Navbar;