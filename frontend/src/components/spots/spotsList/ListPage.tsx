import SpotsList from "./SpotsList.tsx";
import TopNavbar from "../../common/topNavbar/TopNavbar.tsx";
import {useEffect} from "react";
import AuthService from "../../../services/users/AuthService.ts";
import {useNavigate} from "react-router-dom";


const ListPage = () => {
    const nav = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            nav(`/`);
        }
    }, [nav]);

    return (
        <div>
            <TopNavbar/>
            <h1 style={{position: "absolute", top: "100px", left: 0, width: "100vw"}}>Lista punktów pomiarowych</h1>
            <div style={{position: "absolute", bottom: 0, left: 0, top: "160px", width: "100vw"}}>
                <SpotsList/>
            </div>
        </div>
    );
}

export default ListPage;