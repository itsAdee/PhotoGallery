// UserContext.js
import React from 'react';

const UserContext = React.createContext({
  username: null,
  id: null,
  setUserData: () => {},
});

export default UserContext;