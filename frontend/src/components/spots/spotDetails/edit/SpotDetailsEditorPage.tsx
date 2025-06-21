import {useNavigate, useParams} from "react-router-dom";
import SpotsDetailsEdition from "./SpotsDetailsEdition.tsx";
import TopNavbar from "../../../common/topNavbar/TopNavbar.tsx";
import {useEffect} from "react";
import AuthService from "../../../../services/users/AuthService.ts";

const SpotEditorPage = () => {
    const {spotId} = useParams();
    const nav = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!(user && user.roles.includes("ROLE_ADMIN"))) {
            nav(`/`);
        }
    }, [nav]);

    return (
        <>
            <TopNavbar/>
            <h1 className="mt-5">Edytuj punkt pomiarowy</h1>
            <SpotsDetailsEdition spotId={spotId}/>
        </>
    )
}

export default SpotEditorPage;