import EntryForm from "../entryForm/EntryForm.tsx";
import React, {useEffect} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import TopNavbar from "../../../common/topNavbar/TopNavbar.tsx";
import AuthService from "../../../../services/users/AuthService.ts";
import {getSpotName} from "../../../../common/Utils.ts";

const EntryFormPage = () => {
    const location = useLocation();
    const { spotId } = useParams();
    const parameters = location.state?.form?.parameters || [];
    const formName = location.state?.form?.name || "";
    const [spotName, setSpotName] = React.useState("");
    const nav = useNavigate();


    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            nav(`/`);
        }
    }, [nav]);

    React.useEffect(() => {
        getSpotName(spotId, setSpotName);
    }, [spotName]);


    return (
        <div>
            <TopNavbar/>
            <h1 className="mt-5 mb-5">Wprowadzanie danych dla punktu pomiarowego {spotName}</h1>
            <h2 className="mt-5 mb-5">{formName}</h2>
            <div className="container align-items-center w-75">
                <EntryForm parameters={parameters}
                           spotId={spotId}/>
            </div>
        </div>
    );
};

export default EntryFormPage;