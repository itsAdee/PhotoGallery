import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Flex, Box } from "@chakra-ui/react";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { useAuthContext } from "./hooks/useAuthContext";
import Sidebar from './components/Sidebar';
import Usage from "./pages/Usage";
import { useState } from "react";

function App() {
  const { user } = useAuthContext();
  const [usedStorage, setUsedStorage] = useState(0);

  return (
    <div className='App'>
      <BrowserRouter>
        <Flex>
          {user && <Sidebar usedStorage={usedStorage} />}
          <Box overflowY="auto" overflowX="hidden" h="100vh" w="100%" p="5">
            <Routes>
              <Route path='/login' element={user ? <Navigate to='/' /> : <Login />} />
              <Route path='/signup' element={user ? <Navigate to='/' /> : <Signup />} />
              <Route path='/' element={user ? <Dashboard setUsedStorage={setUsedStorage} usedStorage={usedStorage} /> : <Navigate to='/login' />} />
              <Route path='/usage' element={user ? <Usage /> : <Navigate to='/login' />} />
            </Routes>
          </Box>
        </Flex>
      </BrowserRouter>
    </div>
  );
}

export default App;