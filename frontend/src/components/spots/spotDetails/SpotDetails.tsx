import {useNavigate, useParams} from "react-router-dom";
import SpotService from "../../../services/spots/SpotService.ts";
import React, {useEffect} from "react";
import TopNavbar from "../../common/topNavbar/TopNavbar.tsx";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import EventBus from "../../../common/EventBus.ts";
import AuthService from "../../../services/users/AuthService.ts";
import Gallery from "./gallery/Gallery.tsx";
import {useState} from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import "./detailsIndex.css"
import UploadFilesPage from "../../inputs/uploadFiles/UploadFilesPage.tsx";
import ImageUploader from "../../inputs/uploadImages/ImageUploader.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from '@mui/icons-material/Save';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Modal from "react-bootstrap/Modal";

const SpotDetails = () => {
    const {spotId} = useParams<string>();
    const [name, setName] = React.useState("");
    const [type, setType] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [longitude, setLongitude] = React.useState("");
    const [latitude, setLatitude] = React.useState("");
    const [date, setDate] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [additionalInfo, setAdditionalInfo] = useState<string[][]>([]);
    const [key, setKey] = useState('home');
    const [loadImages, setLoadImages] = useState(false);
    const nav = useNavigate();
    const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
    const [showDelete, setShowDelete] = useState<boolean>(false);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            nav(`/`);
        } else {
            setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
        }
    }, [nav]);

    const getDetails = async () => {
        SpotService.getSpotById(spotId).then((response) => {
            const info = new Array<string[]>();
            for (const key in response.data.additionalInfo) {
                info.push([key + ": ", response.data.additionalInfo[key]]);
            }
            setName(response.data.name);
            setType(response.data.type);
            setAddress(response.data.address);
            setLongitude(response.data.location.x);
            setLatitude(response.data.location.y);
            setDate(response.data.foundationDate);
            setDescription(response.data.description);
            setAdditionalInfo(info);
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            } else if (error.response && error.response.status === 404) {
                // TODO WSA-110 Handle not found entity exception
            }
        });
    }

    function navigate() {
        nav(`/list`);
    }

    const deleteSpot = async () => {
        await SpotService.deleteSpot(spotId)
            .then(() => {
                navigate()
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("refresh");
                    location.reload();
                }
            });

    }

    const enterData = (spotId: string | undefined) => {
        if (spotId != undefined) {
            nav(`/forms/${spotId}`);
        }
    };

    React.useEffect(() => {
        getDetails();
    }, []);

    return (
        <div className="app-container">
            <TopNavbar/>
            <h1 style={{marginTop: "40px"}}>Szczegóły punktu pomiarowego: {name}</h1>
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(key) => {
                    if (key === "gallery") {
                        setLoadImages(true)
                    } else if (key === "uploadImages") {
                        setLoadImages(false)
                    }
                    setKey(key);
                }
                }
                className="mb-3 mt-5"
            >
                <Tab eventKey="home" title="Podstawowe informacje">
                    <div style={{fontSize: "1.2rem", paddingLeft: "2rem", textAlign: "left", paddingTop: "1rem"}}>
                        <strong>Typ: </strong> {type}
                    </div>
                    <div style={{fontSize: "1.2rem", paddingLeft: "2rem", textAlign: "left", paddingTop: "1rem"}}>
                        <strong>Data: </strong> {date}
                    </div>
                    <div style={{fontSize: "1.2rem", paddingLeft: "2rem", textAlign: "left", paddingTop: "1rem"}}>
                        <strong>Adres: </strong> {address}
                    </div>
                    <div style={{fontSize: "1.2rem", paddingLeft: "2rem", textAlign: "left", paddingTop: "1rem"}}>
                        <strong>Długość geograficzna: </strong> {longitude}
                    </div>
                    <div style={{fontSize: "1.2rem", paddingLeft: "2rem", textAlign: "left", paddingTop: "1rem"}}>
                        <strong>Szerokość geograficzna: </strong> {latitude}
                    </div>
                    <div style={{fontSize: "1.2rem", paddingLeft: "2rem", textAlign: "left", paddingTop: "1rem"}}>
                        <strong>Opis:</strong> {description}
                    </div>
                    <div className="mb-3 mt-5 mx-auto" style={{display: "flex"}}>
                        <Stack direction="row" spacing={2} className="mx-auto">
                            {showAdminBoard &&
                                <Button variant="outlined" size="medium"
                                        sx={{
                                            width: "10rem",
                                            color: '#000000',
                                            '&:hover': {
                                                backgroundColor: '#bdbdbd',
                                            },
                                            borderColor: '#000000'
                                        }}
                                        onClick={() => {
                                            nav("/formsSelection/" + spotId);
                                        }}>
                                    Formularze punktu
                                </Button>
                            }
                            {showAdminBoard &&
                                <Button variant="outlined" size="medium" color="secondary"
                                        startIcon={<EditIcon/>}
                                        onClick={() => {
                                            nav("/editSpot/" + spotId);
                                        }}>
                                    Edytuj punkt
                                </Button>
                            }
                            <Button variant="outlined" size={"medium"}
                                    startIcon={<SaveIcon/>}
                                    onClick={() => enterData(spotId)}>
                                Wprowadź dane
                            </Button>
                            <Button variant="outlined" size={"medium"} color={"success"}
                                    startIcon={<AutoStoriesIcon/>}
                                    onClick={() => {
                                        nav(`/table/${spotId}`);
                                    }}>
                                Odczyty
                            </Button>
                            {showAdminBoard &&
                                <Button variant="outlined" size="medium" color="error"
                                        startIcon={<DeleteIcon/>} onClick={() => setShowDelete(true)}>
                                    Usuń punkt
                                </Button>
                            }
                            {showAdminBoard &&
                                <Modal show={showDelete} onHide={() => setShowDelete(false)} style={{display: 'flex', zIndex: 9999, top: '30%'}}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Usuń punkt</Modal.Title>
                                    </Modal.Header>

                                    <Modal.Body>
                                        <p>Czy jesteś pewny, że chcesz usunąć ten punkt pomiarowy?</p>
                                    </Modal.Body>

                                    <Modal.Footer>
                                        <Button variant="outlined" className="mr-3" onClick={() => setShowDelete(false)}>Zamknij</Button>
                                        <Button variant="outlined" size="medium" color="error" className="mx-2"
                                                startIcon={<DeleteIcon/>} onClick={deleteSpot}>Usuń</Button>
                                    </Modal.Footer>
                                </Modal>
                            }
                        </Stack>
                    </div>
                </Tab>
                <Tab eventKey="profile" title="Szczegółowe dane">
                    {additionalInfo.map((element) => (
                            <div style={{fontSize: "1.2rem", paddingLeft: "2rem", textAlign: "left", paddingTop: "1rem"}}
                                 key={element[0]}>
                                <strong>{element[0]}</strong> {element[1]}
                            </div>
                        )
                    )}
                </Tab>
                <Tab eventKey="gallery" title="Zdjęcia">
                    <Gallery spotId={spotId} load={loadImages}/>
                </Tab>
                <Tab eventKey="uploadImages" title="Dodaj zdjęcia">
                    <ImageUploader spotId={spotId}/>
                </Tab>
                <Tab eventKey="upload" title="Dodaj dane z pliku">
                    <UploadFilesPage spotId={spotId}/>
                </Tab>

            </Tabs>
        </div>
    );
}

export default SpotDetails;