import {Alert, TextField} from "@mui/material";
import {DatePicker, plPL} from '@mui/x-date-pickers';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {CreateSpotRequest} from "../../../services/spots/SpotService.ts";
import SpotService from "../../../services/spots/SpotService.ts";
import React from "react";
import {Button, Collapse} from "react-bootstrap";
import ExpandableForm from "./ExpandableForm.tsx";
import initialParameters from "../../../constants/spots/spotCreator/InitialSpotParameters.tsx";
import {useNavigate} from 'react-router-dom';
import EventBus from "../../../common/EventBus.ts";
import SpotCreatorProps from "../../../constants/spots/spotCreator/SpotCreatorProps.ts";


const SpotCreator = (props: SpotCreatorProps) => {

    const [open, setOpen] = React.useState(false);
    const [newSpot, setNewSpot] = React.useState<CreateSpotRequest>({
        name: "",
        foundationDate: new Date(),
        type: "",
        address: "",
        longitude: props.location ? props.location.lng : 0,
        latitude: props.location ? props.location.lat : 0,
        description: "",
        additionalInfo: {},
        selectedFormIds: []
    });

    const [parameters, setParameters] = React.useState<{ [key: string]: string }>({});

    const nav = useNavigate();

    function navigate() {
        if (props.view === "map") {
            nav(`/map`);
        } else nav(`/`);
    }

    const createSpot = async (spot: CreateSpotRequest) => {
        await SpotService.addSpot(spot)
            .then(() => {
                navigate();
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("refresh");
                    location.reload();
                } else {
                    setOpen(true);
                }
            });
    }

    React.useEffect(() => {
        setNewSpot({...newSpot, additionalInfo: parameters});
    }, [parameters]);

    return (
        <div className="row justify-content-center">
            <Collapse in={open} className="centered-collapse">
                <div className={`alert ${open ? '' : 'alert-hidden'}`}>
                    <Alert
                        severity="error"
                        onClose={() => {
                            setOpen(false)
                        }}
                    >
                        Błąd! Punkt o podanej nazwie już istnieje.
                    </Alert>
                </div>
            </Collapse>
            <div className="row w-100  justify-content-center">
                <div className="row">
                    <TextField
                        label="Nazwa"
                        className="w-100 mt-4"
                        value={newSpot.name}
                        onChange={(event) => {
                            setNewSpot({...newSpot, name: event.target.value});
                        }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}
                                          localeText={plPL.components.MuiLocalizationProvider.defaultProps.localeText}>
                        <DatePicker label="Data powstania" className="mt-4" format="DD/MM/YYYY"
                                    onChange={
                                        (date: string | number | Date | null) => {
                                            if (date === null) return;
                                            const newDate = new Date(date);
                                            const gmtOffset = newDate.getTimezoneOffset();
                                            newDate.setMinutes(newDate.getMinutes() - gmtOffset);
                                            setNewSpot({...newSpot, foundationDate: newDate});
                                        }
                                    }/>
                    </LocalizationProvider>
                    <TextField
                        label="Typ"
                        className="w-100 mt-4"
                        value={newSpot.type}
                        onChange={(event) => {
                            setNewSpot({...newSpot, type: event.target.value});
                        }}
                    />
                    <TextField
                        label="Adres"
                        className="w-100 mt-4"
                        value={newSpot.address}
                        onChange={(event) => {
                            setNewSpot({...newSpot, address: event.target.value});
                        }}
                    />
                    <div className="row mt-4">
                        <div className="col">
                            <TextField
                                label="Szerokość geograficzna"
                                className="w-100"
                                value={newSpot.latitude}
                                onChange={(event) => {
                                    const inputValue = event.target.value;
                                    const value = inputValue.replace(',', '.');
                                    if (!isNaN(value) || value === '') {
                                        setNewSpot({...newSpot, latitude: value});
                                    }
                                }}
                            />
                        </div>
                        <div className="col">
                            <TextField
                                label="Długość geograficzna"
                                className="w-100"
                                value={newSpot.longitude}
                                onChange={(event) => {
                                    const inputValue = event.target.value;
                                    const value = inputValue.replace(',', '.');
                                    if (!isNaN(value) || value === '') {
                                        setNewSpot({...newSpot, longitude: value});
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Opis"
                        multiline
                        rows={5}
                        className="w-100 mt-4"
                        onChange={
                            (event) => {
                                setNewSpot({...newSpot, description: event.target.value});
                            }
                        }
                    />
                </div>
                <div className="row">
                    <ExpandableForm initialParameters={initialParameters} parametersSetter={setParameters}/>
                </div>
                <div className="col">
                    <Button className="btn btn-primary w-100 mt-4" onClick={
                        () => {
                            createSpot(newSpot);
                            if (props.onAdd) props.onAdd();
                        }
                    }
                    >Dodaj</Button>
                </div>
            </div>
        </div>
    );
}

export default SpotCreator;