import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestedUser } from "../redux/userSlice";
import { API_BASE_URL } from "../config";

const serverUrl = API_BASE_URL.replace(/\/api$/, "");

function getSuggestedUser() {
    const dispatch = useDispatch();
    const userdata=useSelector(state=>state.user.userData)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/suggested`, { withCredentials: true });
                dispatch(setSuggestedUser(result.data));
            } catch (error) {
                console.log(error);
            }
        };
        fetchUser();
    }, [userdata]);
}

export default getSuggestedUser;