import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { useAuthContext } from "./hooks/useAuthContext";
import Navbar from './components/Navbar';
import Usage from "./pages/Usage";

function App() {

  const { user } = useAuthContext();

  return (

    <div className='App'>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* <Route path='/' element={<Dashboard/>} /> */}
          <Route path='/' element={user ? <Dashboard /> : <Navigate to='/login' />} />
          <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />
          <Route path='/signup' element={!user ? <Signup /> : <Navigate to='/' />} />
          <Route path='/usage' element={<Usage />} />
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;
