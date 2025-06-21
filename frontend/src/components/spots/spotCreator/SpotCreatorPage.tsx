import TopNavbar from "../../common/topNavbar/TopNavbar.tsx";
import SpotCreator from "./SpotCreator.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import AuthService from "../../../services/users/AuthService.ts";


const SpotCreatorPage = () => {
    const nav = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!(user && user.roles.includes("ROLE_ADMIN"))) {
            nav(`/`);
        }
    }, [nav]);

    return (
        <div>
            <TopNavbar/>
            <div className="container align-items-center w-75">
                <h1 className="mt-5">Utwórz punkt pomiarowy</h1>
                <SpotCreator/>
            </div>
        </div>
    )
}

export default SpotCreatorPage;