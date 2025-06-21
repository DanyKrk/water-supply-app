import TopNavbar from "../common/topNavbar/TopNavbar.tsx";
import FormCreator from "./formCreator/FormCreator.tsx"
import FormEditor from "./formsEditor/FormsEditor.tsx"
import FormsService from "../../services/forms/FormsService.ts";
import { AxiosResponse } from "axios";
import FormEntity from "../../constants/inputs/forms/FormEntity.ts";
import React, {useEffect} from "react";
import EventBus from "../../common/EventBus.ts";
import {useNavigate} from "react-router-dom";
import AuthService from "../../services/users/AuthService.ts";

const FormsManagerPage = () => {

    const [formEntities, setFormEntities] = React.useState([] as FormEntity[]);
    const nav = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!(user && user.roles.includes("ROLE_ADMIN"))) {
            nav(`/`);
        }
    }, [nav]);

    const refreshForms = () => {
        getForms();
    };

    const getForms = async () => {
        await FormsService.getForms().then(
            (response: AxiosResponse<FormEntity[]>) => {
                setFormEntities(response.data);
            }
        ).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            }
        });
    };

    React.useEffect(() => {
        getForms();
    }, []);

    return (
        <div className="container">
            <TopNavbar />
            <div className="row align-items-start mt-5">
                <div className="col">
                    <FormEditor
                        formEntities={formEntities}
                        refreshForms={refreshForms}
                    />
                </div>
                <div className="col">
                    <h1 className="mb-5">Utwórz nowy formularz</h1>
                    <FormCreator refreshForms={refreshForms} />
                </div>
            </div>
        </div>
    );
};

export default FormsManagerPage;
