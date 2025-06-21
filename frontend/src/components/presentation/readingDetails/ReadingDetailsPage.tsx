import {useNavigate, useParams} from "react-router-dom";
import ReadingService from "../../../services/readings/ReadingService.ts";
import React, {useEffect, useState} from "react";
import SingleReadingEntity from "../../../constants/common/SingleReadingEntity.ts";
import FormField from "../../inputs/forms/formField/FormField.tsx";
import TopNavbar from "../../common/topNavbar/TopNavbar.tsx";
import EventBus from "../../../common/EventBus.ts";
import AuthService from "../../../services/users/AuthService.ts";
import {polishParameterTypeNames} from "../../../constants/inputs/forms/ParameterType.ts";
import {formatTimestamp, getSpotName} from "../../../common/Utils.ts";
import Stack from "@mui/material/Stack";
import Modal from "react-bootstrap/Modal";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import checkNumericValues from "../../common/checkNumericValues/CheckNumericValues.tsx";
import {Collapse} from "react-bootstrap";
import {Alert} from "@mui/material";
import Parameter from "../../../constants/inputs/forms/Parameter.ts";


const ReadingDetailsPage = () => {
    const {spotId, id} = useParams();
    const [spotName, setSpotName] = React.useState("");
    const [initialReadings, setInitialReadings] = React.useState([]);
    const [formFieldValues, setFormFieldValues] = useState<{
        [fieldName: string]: string;
    }>({});
    const [parameters, setParameters] = React.useState<Parameter[]>([]);

    const nav = useNavigate();

    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [openEditModal, setOpenEditModal] = React.useState(false);
    const [openAlert, setOpenAlert] = useState(false);


    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!(user && user.roles.includes("ROLE_ADMIN"))) {
            nav(`/`);
        }
    }, [nav]);

    const handleInputChange = (fieldName: string, value: string) => {
        setFormFieldValues((prevValues) => ({
            ...prevValues,
            [fieldName]: value,
        }));
    };


    const handleAccept = async () => {
        const readingsFromFieldValues = new Array<SingleReadingEntity>();
        parameters.forEach(parameter => {
            const singleReading = {
                parameter: parameter.name,
                parameterValue: formFieldValues[parameter.name],
                parameterType: parameter.type
            } as SingleReadingEntity;
            readingsFromFieldValues.push(singleReading);
        });
        await ReadingService.updateReading(id, spotId, readingsFromFieldValues).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            }
        });


        navigate()
    };

    const handleDelete = () => {
        ReadingService.deleteReading(id, spotId).then(() => {
            navigate()
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            }
        });
    }

    const getReading = async () => {
        await ReadingService.getReadingBySpotIdAndId(spotId, id).then((response) => {
            const data: any = {
                timestamp: response.data.timestamp,
            };
            const initialFieldValues: any = {}
            const parameters: Parameter[] = []
            response.data.readings.forEach((reading: any) => {
                data[reading.parameter] = reading.parameterValue;
                initialFieldValues[reading.parameter] = reading.parameterValue;
                parameters.push({
                    name: reading.parameter,
                    type: reading.parameterType,
                })
            });
            setInitialReadings(data);
            setFormFieldValues(initialFieldValues);
            setParameters(parameters)
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            }
        });
    }

    React.useEffect(() => {
        getReading();
    }, []);

    React.useEffect(() => {
        getSpotName(spotId, setSpotName);
    }, [spotName]);


    function navigate() {
        nav(`/table/${spotId}`);
    }

    return (
        <>
            <TopNavbar/>
            <h1 className="mt-3">Odczyt {formatTimestamp(initialReadings['timestamp'])}<br/>
                Z punktu pomiarowego {spotName}
            </h1>
            <Collapse in={openAlert} className="centered-collapse">
                <div className={`alert ${openAlert ? '' : 'alert-hidden'}`}>
                    <Alert
                        severity="error"
                        onClose={() => {
                            setOpenAlert(false)
                        }}
                    >
                        Błąd! Parametr liczbowy powinien być liczbą.
                    </Alert>
                </div>
            </Collapse>
            {parameters.length === 0 && <p>No item found</p>}
            {parameters.map((parameter) => (
                <FormField
                    key={parameter.name}
                    fieldName={`${polishParameterTypeNames[parameter.type]}: ${parameter.name}`}
                    placeholder={initialReadings[parameter.name]}
                    initialValue={initialReadings[parameter.name]}
                    updateInputValueInForm={(value) =>
                        handleInputChange(parameter.name, value)
                    }
                />
            ))}
            <Modal show={openDeleteModal} onHide={() => setOpenDeleteModal(false)} style={{display: 'flex', zIndex: 9999, top: '30%'}}>
                <Modal.Header closeButton>
                    <Modal.Title>Usuń odczyt</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Czy na pewno chcesz usunąć odczyt?</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outlined" className="mr-3" onClick={() => setOpenDeleteModal(false)}>Zamknij</Button>
                    <Button variant="outlined" size="medium" color="error" className="mx-2"
                            startIcon={<DeleteIcon/>} onClick={handleDelete}>Usuń</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={openEditModal} onHide={() => setOpenEditModal(false)} style={{display: 'flex', zIndex: 9999, top: '30%'}}>
                <Modal.Header closeButton>
                    <Modal.Title>Edytuj odczyt</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Czy na pewno chcesz edytować odczyt?</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outlined" className="mr-3" onClick={() => setOpenEditModal(false)}>Zamknij</Button>
                    <Button variant="outlined" size="medium" color="success" className="mx-2" onClick={handleAccept}>Edytuj</Button>
                </Modal.Footer>
            </Modal>
            <div className="d-flex justify-content-center">
                <Stack direction="row" spacing={1}>
                    <Button variant="contained" onClick={() => checkNumericValues(parameters, formFieldValues, setOpenAlert, setOpenEditModal)}>Zaktualizuj odczyt</Button>
                    <Button variant="contained" onClick={navigate}>Wróć do tabeli</Button>
                    <Button variant="contained" onClick={() => {setOpenDeleteModal(true)}} color="error">Usuń odczyt</Button>
                </Stack>
            </div>
        </>
    );
};

export default ReadingDetailsPage;