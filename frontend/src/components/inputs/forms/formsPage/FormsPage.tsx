import FormsService from "../../../../services/forms/FormsService.ts";
import React, {useEffect, useState} from "react";
import FormEntity from "../../../../constants/inputs/forms/FormEntity.ts";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Collapse} from 'react-bootstrap';
import TopNavbar from "../../../common/topNavbar/TopNavbar.tsx";
import {AxiosResponse} from "axios";
import EventBus from "../../../../common/EventBus.ts";
import AuthService from "../../../../services/users/AuthService.ts";
import {getSpotName} from "../../../../common/Utils.ts";
import EntryFormDisplay from "../entryForm/EntryFormDisplay.tsx";

const FormsPage = () => {

    const {spotId} = useParams();
    const [spotName, setSpotName] = React.useState("");
    const [formEntities, setFormEntities] = React.useState([] as FormEntity[]);
    const nav = useNavigate();

    const getSpotForms = async () => {
        await FormsService.getFormsBySpotId(spotId).then((response: AxiosResponse<FormEntity[]>) => {
            const formEntitiesToAdd: FormEntity[] = []
            response.data.forEach((formData: FormEntity) => {
                const newFormEntity: FormEntity = {
                    name: formData.name,
                    parameters: formData.parameters
                } as FormEntity
                formEntitiesToAdd.push(newFormEntity);
            })
            setFormEntities(formEntitiesToAdd);
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            } else if (error.response && error.response.status === 404) {
                // TODO WSA-110 Handle not found entity exception
            }
        });
    }

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            nav(`/`);
        }
    }, [nav]);

    React.useEffect(() => {
        getSpotName(spotId, setSpotName);
    }, [spotName]);

    React.useEffect(() => {
        getSpotForms()
    }, []);

    const [openStates, setOpenStates] = useState(Array(formEntities.length).fill(false));

    const toggleCollapse = (index: number) => {
        const updatedOpenStates = [...openStates];
        updatedOpenStates[index] = !updatedOpenStates[index];
        setOpenStates(updatedOpenStates);
    };

    const navigateToEntryFormPage = (formEntity: FormEntity) => {
        nav(`/entryFormPage/${spotId}`, { state: { form: formEntity } });
    };

    return (
        <div>
            <TopNavbar/>
            <h1 className="mt-5 mb-5">Wprowadzanie danych dla punktu pomiarowego {spotName}</h1>
            <h1 className="mt-5 mb-5">Wybierz formularz:</h1>
            <div className="container align-items-center">
                {formEntities.map((formEntity, index) => (
                    <div key={formEntity.name}>
                        <Button
                            className="w-75"
                            onClick={() => toggleCollapse(index)}
                            aria-controls={`example-collapse-text-${index}`}
                            aria-expanded={openStates[index]}
                        >
                            {formEntity.name}
                        </Button>
                        <br/>
                        <Collapse className="container align-items-center" in={openStates[index]}>
                            <div className="bg-light w-75" id={`example-collapse-text-${index}`}>
                                <EntryFormDisplay parameters={formEntity.parameters} />
                                <Button className="m-2 w-auto btn-success" onClick={() => navigateToEntryFormPage(formEntity)}>Wybierz</Button>
                            </div>
                        </Collapse>
                        <br/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FormsPage;