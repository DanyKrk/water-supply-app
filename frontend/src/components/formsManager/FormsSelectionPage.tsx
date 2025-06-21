import React, {useEffect, useState} from "react";
import {Collapse, Button, Row, Col} from "react-bootstrap";
import FormEntity from "../../constants/inputs/forms/FormEntity.ts";
import FormsService from "../../services/forms/FormsService.ts";
import {AxiosResponse} from "axios";
import {useNavigate, useParams} from "react-router-dom";
import TopNavbar from "../common/topNavbar/TopNavbar.tsx";
import Switch from "react-bootstrap/Switch";
import EntryFormDisplay from "../inputs/forms/entryForm/EntryFormDisplay.tsx";
import SpotService, {CreateSpotRequest} from "../../services/spots/SpotService.ts";
import {SpotEditorEntry} from "../spots/spotDetails/edit/SpotsDetailsEdition.tsx";
import EventBus from "../../common/EventBus.ts";
import AuthService from "../../services/users/AuthService.ts";
import {getSpotName} from "../../common/Utils.ts";
import FormSwitches from "../../constants/formsManager/FormSwitches.ts";


const FormsSelectionPage = () => {
    const nav = useNavigate();
    const {spotId} = useParams();

    const [hasInitialSwitchesBeenSet, setHasInitialSwitchesBeenSet] = useState(false);
    const [formEntities, setFormEntities] = React.useState([] as FormEntity[]);
    const [formSwitches, setFormSwitches] = useState<FormSwitches>({});
    const [newSpot, setNewSpot] = React.useState<SpotEditorEntry>({
        name: "",
        foundationDate: new Date(),
        type: "",
        address: "",
        longitude: 0,
        latitude: 0,
        description: "",
        additionalInfo: {},
        selectedFormIds: []
    } as SpotEditorEntry);
    const [spotName, setSpotName] = React.useState("");

    const getForms = async () => {
        FormsService.getForms().then((response: AxiosResponse<FormEntity[]>) => {
            const formEntitiesToAdd: FormEntity[] = response.data.map((formData) => ({
                id: formData.id,
                name: formData.name,
                parameters: formData.parameters,
            }));
            setFormEntities(formEntitiesToAdd);
            const initialSwitches: Record<string, boolean> = {};
            formEntitiesToAdd.forEach((formEntity) => {
                initialSwitches[formEntity.id] = false;
            });
            setFormSwitches(initialSwitches);
            if (Object.keys(initialSwitches).length == 0) {
                getSpot()
            }
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            }
        });
    };

    React.useEffect(() => {
        getSpotName(spotId, setSpotName);
    }, [spotName]);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!(user && user.roles.includes("ROLE_ADMIN"))) {
            nav(`/`);
        }
    }, [nav]);

    React.useEffect(() => {
        getForms();
        // getSpot();
    }, []);

    React.useEffect(() => {
        if (!hasInitialSwitchesBeenSet && Object.keys(formSwitches).length > 0) {
            setHasInitialSwitchesBeenSet(true);
            getSpot()
        }
        updateSpotSelectedFormIds();
    }, [formSwitches]);

    const [openStates, setOpenStates] = useState(Array(formEntities.length).fill(false));

    const toggleCollapse = (index: number) => {
        const updatedOpenStates = [...openStates];
        updatedOpenStates[index] = !updatedOpenStates[index];
        setOpenStates(updatedOpenStates);
    };

    function toggleSwitch(formId: string) {
        // Toggle the switch state
        setFormSwitches((prevSwitches) => ({
            ...prevSwitches,
            [formId]: !((prevSwitches as Record<string, boolean>)[formId] || false),
        }));
    }

    function updateSpotSelectedFormIds() {
        const selectedFormIds = Object.keys(formSwitches)
            .filter((formId) => formSwitches[formId])
            .map((formId) => formId)
            .filter((id) => id !== null) as string[];

        setNewSpot((newSpot) => ({
            ...newSpot,
            selectedFormIds: selectedFormIds,
        }));
    }


    function saveSelectedFormIds() {
        updateSpot(spotId, newSpot)
        nav("/details/" + spotId);
    }


    const getSpot = async () => {
        await SpotService.getSpotById(spotId).then((response) => {
            const data: SpotEditorEntry = {
                name: response.data.name,
                foundationDate: response.data.foundationDate,
                type: response.data.type,
                longitude: response.data.location.x,
                latitude: response.data.location.y,
                description: response.data.description,
                additionalInfo: response.data.additionalInfo,
                selectedFormIds: response.data.selectedFormIds
            } as SpotEditorEntry;
            const updatedSwitches: FormSwitches = {...formSwitches};
            if (Array.isArray(data.selectedFormIds)) {
                data.selectedFormIds.forEach((formId) => {
                    if (formId in updatedSwitches) {
                        updatedSwitches[formId] = true;
                    }
                });
            }

            setFormSwitches(updatedSwitches);
            setNewSpot(data);
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            } else if (error.response && error.response.status === 404) {
                // TODO WSA-110 Handle not found entity exception
            }
        });
    }

    const updateSpot = async (spotId: string | undefined, spot: CreateSpotRequest) => {
        await SpotService.updateSpot(spotId, spot).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            } else if (error.response && error.response.status === 404) {
                // TODO WSA-110 Handle not found entity exception
            }
        });
    }


    return (
        <div>
            <TopNavbar/>
            <h1 className="mt-5 mb-5">Formularze dostępne dla punktu pomiarowego {spotName}</h1>
            <div className="container align-items-center w-75">
                {formEntities.map((formEntity, index) => (
                    <div key={formEntity.id}>
                        <Row>
                            <Col xs={1}>
                                <Switch
                                    checked={formSwitches[formEntity.id] || false}
                                    onChange={() => toggleSwitch(formEntity.id)}
                                />
                            </Col>
                            <Col xs={10}>
                                <Button
                                    className="w-100"
                                    onClick={() => toggleCollapse(index)}
                                    aria-controls={`example-collapse-text-${index}`}
                                    aria-expanded={openStates[index]}
                                >
                                    {formEntity.name}
                                </Button>
                            </Col>
                        </Row>
                        <br/>
                        <Collapse className="container align-items-center" in={openStates[index]}>
                            <div className="bg-light w-50" id={`example-collapse-text-${index}`}>
                                <EntryFormDisplay parameters={formEntity.parameters}/>
                            </div>
                        </Collapse>
                        <br/>
                    </div>
                ))}
                <Button onClick={saveSelectedFormIds}>Zapisz wybór formularzy</Button>
            </div>
        </div>
    );
};

export default FormsSelectionPage;
