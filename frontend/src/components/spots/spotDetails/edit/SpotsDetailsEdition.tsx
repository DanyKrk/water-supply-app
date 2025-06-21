import {TextField} from "@mui/material";
import {DatePicker} from '@mui/x-date-pickers';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import React from "react";
import SpotService from "../../../../services/spots/SpotService.ts";
import ExpandableFormForEdition from "../ExpandableFormForEdition.tsx";
import dayjs, {Dayjs} from 'dayjs';
import EventBus from "../../../../common/EventBus.ts";
import {useNavigate} from "react-router-dom";
import SpotEditorEntry from "../../../../constants/spots/spotDetails/edit/SpotEditorEntry.ts";
import SpotDetailsEditionProps from "../../../../constants/spots/spotDetails/edit/SpotDetailsEditionProps.ts";
import CreateSpotRequest from "../../../../constants/spots/CreateSpotRequest.ts";
import Modal from "react-bootstrap/Modal";
import Button from "@mui/material/Button";

const SpotDetailsEdition: React.FC<SpotDetailsEditionProps> = ({spotId}) => {
    const [parameters, setParameters] = React.useState<{ [key: string]: string }>({});
    const [dateValue, setDateValue] = React.useState<Dayjs | null>(null);
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
    const [open, setOpen] = React.useState(false);

    const getSpot = async () => {
        await SpotService.getSpotById(spotId).then((response) => {
                const data: SpotEditorEntry = {
                    name: response.data.name,
                    foundationDate: response.data.foundationDate,
                    type: response.data.type,
                    address: response.data.address,
                    longitude: response.data.location.x,
                    latitude: response.data.location.y,
                    description: response.data.description,
                    additionalInfo: response.data.additionalInfo,
                    selectedFormIds: response.data.selectedFormIds
                } as SpotEditorEntry;
                setDateValue(dayjs(response.data.foundationDate))
                setNewSpot(data);
            }
        ).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            }
        });
    }

    const updateSpot = async (spotId: string | undefined, spot: CreateSpotRequest) => {
        await SpotService.updateSpot(spotId, spot).then(() => goToDetails(spotId)).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            }
        });
    }

    const nav = useNavigate();

    const goToDetails = (spotId: string | undefined) => {
        if (spotId != undefined) {
            nav(`/details/${spotId}`);
        }
    };


    React.useEffect(() => {
        setNewSpot({...newSpot, additionalInfo: parameters});
    }, [parameters]);

    React.useEffect(() => {
        getSpot();
    }, []);


    return (
        <div>
            <div className="row">
                <div className="row">
                    <TextField
                        label="Nazwa"
                        className="w-100 mt-4"
                        value={newSpot.name}
                        onChange={(event) => {
                            setNewSpot({...newSpot, name: event.target.value});
                        }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Data powstania" className="w-25 mt-4"
                                    value={dateValue}
                                    onChange={
                                        (date: string | number | Date | null) => {
                                            if (date === null) return;
                                            setDateValue(date);
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
                    </div>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Opis"
                        multiline
                        rows={5}
                        className="w-100 mt-4"
                        value={newSpot.description}
                        onChange={
                            (event) => {
                                setNewSpot({...newSpot, description: event.target.value});
                            }
                        }
                    />
                </div>
                <div className="row">
                    <ExpandableFormForEdition parametersSetter={setParameters} spotId={spotId}/>
                </div>
                <Modal show={open} onHide={() => setOpen(false)} style={{display: 'flex', zIndex: 9999, top: '30%'}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edytuj punkt pomiarowy</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Czy na pewno chcesz edytować punkt pomiarowy?</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="outlined" className="mr-3" onClick={() => setOpen(false)}>Zamknij</Button>
                        <Button variant="outlined" size="medium" color="success" className="mx-2" onClick={() => updateSpot(spotId, newSpot)}>Zapisz</Button>
                    </Modal.Footer>
                </Modal>
                <div className="col">
                    <Button variant="contained" color="success" className="btn w-100 mt-4"
                            onClick={() => {setOpen(true);}}>Zapisz</Button>
                </div>
            </div>
        </div>
    );
}

export default SpotDetailsEdition;