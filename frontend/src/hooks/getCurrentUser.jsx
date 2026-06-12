import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { API_BASE_URL } from "../config";

const serverUrl = API_BASE_URL.replace(/\/api$/, "");

function getCurrentUser() {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
                dispatch(setUserData(result.data));
            } catch (error) {
                console.log(error);
            }
        };
        fetchUser();
    }, []);
}

export default getCurrentUser;