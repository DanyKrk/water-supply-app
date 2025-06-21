import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import AuthService from "../../../../services/users/AuthService.ts";
import TopNavbar from "../../../common/topNavbar/TopNavbar.tsx";
import {Collapse, Form, FormControl, FormGroup, InputGroup} from "react-bootstrap";
import {Alert} from "@mui/material";
import EventBus from "../../../../common/EventBus.ts";
import UsersService from "../../../../services/users/UsersService.ts";
import UserEntity from "../../../../constants/users/UserEntity.ts";
import Button from '@mui/material/Button';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "react-bootstrap/Modal";

const UserDetailsUpdatePage = () => {
    const {userId} = useParams<string>();
    const [error, setError] = React.useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userData, setUserData] = useState<UserEntity>({
        id: '',
        username: '',
        name: '',
        email: '',
        unit: '',
        role: '',
    } as UserEntity);
    const [placeHolder, setPlaceHolder] = useState<UserEntity>({
        id: '',
        username: '',
        name: '',
        email: '',
        unit: '',
        role: '',
    } as UserEntity);
    const nav = useNavigate();

    const handleChange = (change: { target: { name: string; value: string; }; }) => {
        const {name, value} = change.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        UsersService.updateUser(userData).then(() => {
            nav("/users");
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            } else if (error.response && error.response.status === 404) {
                setError("Wystąpił problem. Proszę zresetować aplikację");
            } else if (error.response && error.response.status === 403) {
                setError("Nie można zmienić uprawnień ostatniego administratora");
            }
        });
    };

    const deleteUser = async () => {
        UsersService.deleteUserById(userId).then(() => {
            nav("/users");
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            } else if (error.response && error.response.status === 404) {
                setError("Wystąpił problem. Proszę zresetować aplikację");
            } else if (error.response && error.response.status === 403) {
                setError("Nie można usunąć ostatniego konta administratora");
            }
        });
    };

    const getDetails = async () => {
        UsersService.getUserById(userId).then((response) => {
            const data = {
                id: response.data.id,
                username: response.data.username,
                name: response.data.name,
                email: response.data.email,
                unit: response.data.unit,
                role: response.data.role
            } as UserEntity;
            setUserData(data)
            setPlaceHolder(data)
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            } else if (error.response && error.response.status === 404) {
                setError("Wystąpił problem. Proszę zresetować aplikację");
            }
        });
    }

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!(user && user.roles.includes("ROLE_ADMIN"))) {
            nav(`/`);
        }
    }, [nav]);

    React.useEffect(() => {
        getDetails();
    }, []);

    return (
        <>
            <header>
                <TopNavbar/>
            </header>
            <Collapse in={error.length > 0} className="centered-collapse">
                <div className={`alert ${error.length > 0 ? '' : 'alert-hidden'}`}>
                    <Alert
                        severity='error'
                        onClose={() => {
                            setError("")
                        }}
                    >
                        {error}
                    </Alert>
                </div>
            </Collapse>
            <div>
                <h1 className="mb-3">Edytuj dane</h1>
                <div className="container">
                    <div className={"row justify-content-center align-items-center"}>
                        <Form style={{maxWidth: "500px"}}>
                            <FormGroup className="mb-3">
                                <InputGroup>
                                    <InputGroup.Text id="username">Nazwa użytkownika</InputGroup.Text>
                                    <FormControl
                                        type="text"
                                        id="username"
                                        name="username"
                                        placeholder={placeHolder.username}
                                        value={userData.username}
                                        onChange={handleChange}
                                        aria-describedby="username"
                                    />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup className="mb-3">
                                <InputGroup>
                                    <InputGroup.Text id="name">Imie i Nazwisko</InputGroup.Text>
                                    <FormControl
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder={placeHolder.name}
                                        value={userData.name}
                                        onChange={handleChange}
                                        aria-describedby="name"
                                    />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup className="mb-3">
                                <InputGroup>
                                    <InputGroup.Text id="email">Email</InputGroup.Text>
                                    <FormControl
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder={placeHolder.email}
                                        value={userData.email}
                                        onChange={handleChange}
                                        aria-describedby="email"
                                    />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup className="mb-3">
                                <InputGroup>
                                    <InputGroup.Text id="unit">Jednostka orgnizacyjna</InputGroup.Text>
                                    <FormControl
                                        type="text"
                                        id="unit"
                                        name="unit"
                                        placeholder={placeHolder.unit}
                                        value={userData.unit}
                                        onChange={handleChange}
                                        aria-describedby="unit"
                                    />
                                </InputGroup>
                            </FormGroup>
                            <Form.Select
                                className="mb-3"
                                id="role"
                                name="role"
                                aria-label="Default select example"
                                value={userData.role}
                                onChange={handleChange}
                            >
                                <option value="ROLE_USER">Użytkownik</option>
                                <option value="ROLE_ADMIN">Administrator</option>
                            </Form.Select>
                        </Form>
                    </div>
                </div>

                <Modal show={showEditModal} onHide={() => setShowEditModal(false)} style={{display: 'flex', zIndex: 9999, top: '30%'}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edytuj dane</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Czy na pewno chcesz edytować dane konta?</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="outlined" className="mr-3" onClick={() => setShowEditModal(false)}>Zamknij</Button>
                        <Button variant="outlined" size="medium" color="success" className="mx-2"
                                startIcon={<EditIcon/>} onClick={handleSubmit}>Zapisz zmiany</Button>
                    </Modal.Footer>
                </Modal>
                <Button variant="outlined" size="medium"
                        onClick={() => setShowEditModal(true)}
                        startIcon={<EditIcon/>}
                        style={{marginRight: "10px"}}
                        >
                    Zapisz zmiany
                </Button>

                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} style={{display: 'flex', zIndex: 9999, top: '30%'}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Usuń konto</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Czy jesteś pewny, że chcesz usunąć konto?</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="outlined" className="mr-3" onClick={() => setShowDeleteModal(false)}>Zamknij</Button>
                        <Button variant="outlined" size="medium" color="error" className="mx-2"
                                startIcon={<DeleteIcon/>} onClick={deleteUser}>Usuń</Button>
                    </Modal.Footer>
                </Modal>
                <Button variant="outlined" size="medium" color="error"
                        onClick={() => setShowDeleteModal(true)}
                        startIcon={<DeleteIcon/>}
                >Usuń konto
                </Button>
            </div>
        </>
    );
}

export default UserDetailsUpdatePage;