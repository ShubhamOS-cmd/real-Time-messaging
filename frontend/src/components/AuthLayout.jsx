import React , {useEffect , useState} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
export default function Protected({children , authentication=true}){
    const navigate = useNavigate();
    //const [loader, setLoader] = useState(true);
    const authStatus = useSelector(state => state.auth.isAuthenticated); // useSelector reads data from Redux store while useDispatch sends actions to update the Redux store
    useEffect(() => {
        if(authentication && !authStatus){
            navigate("/login");
        }
        else if(!authentication && authStatus){
            navigate("/messages")
        }
        // else setLoader(false);
    } , [authStatus , navigate , authentication]);
    return children
}
/**
 * App.jsx already waits for getCurrentUser() to finish before rendering anything. By the time AuthLayout runs — Redux already has the correct isAuthenticated value. There's nothing left to wait for.
 */