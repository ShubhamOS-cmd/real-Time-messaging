import { useState  , useEffect} from 'react'
import './App.css'
import { useDispatch } from 'react-redux';
import {getCurrentUser} from "./services/user.services.js"
import {setUser , clearUser} from "./store/authSlice.js" 
import {connectSocket} from "./socket/socket.js"
import { Outlet } from "react-router";
import { Toaster } from 'react-hot-toast';
// sidebar imported 

function App() {
  const [loading , setLoading] = useState(true);
  const dispatch = useDispatch(); 
  useEffect(() => {
    const fetchCurrentUser = async() => {
      try {
        const res = await getCurrentUser();
        dispatch(setUser(res.data));
        connectSocket(); // connect to socket 
      } catch (error) {
        dispatch(clearUser());
      }
      finally{
        setLoading(false);
      }
    }
     fetchCurrentUser();
  } , []);
  return loading ? <div className='flex items-center justify-center h-screen'><h1>Loading ......... </h1></div> : (
    <div className="flex h-screen bg-[#0A0F1E] overflow-hidden">
            <main className="flex-1 overflow-hidden">
                <Toaster />
                <Outlet />
            </main>
    </div>
  );
}

export default App
