import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import UserEntity from "../../../constants/users/UserEntity.ts";
import UsersService from "../../../services/users/UsersService.ts";
import AuthService from "../../../services/users/AuthService.ts";
import TopNavbar from "../../common/topNavbar/TopNavbar.tsx";
import {Button, Collapse, Form, FormControl, FormGroup, InputGroup} from "react-bootstrap";
import {Alert} from "@mui/material";
import EventBus from "../../../common/EventBus.ts";

const UserDetailsPage = () => {
    const [error, setError] = React.useState("");
    const [userData, setUserData] = useState<UserEntity>({
        id: '',
        username: '',
        name: '',
        email: '',
        unit: '',
        role: '',
    } as UserEntity);
    const nav = useNavigate();

    const getDetails = async (userId: string) => {
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
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            } else if (error.response && error.response.status === 404) {
                setError("Wystąpił problem. Proszę uruchomić ponownie aplikację");
            }
        });
    }

    const mapRole = () => {
        if(userData.role == "ROLE_USER") {
            return "użytkownik"
        } else {
            return "administrator"
        }
    }

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            nav(`/`);
        }
        getDetails(user.id);
    }, [nav]);


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
                <h1 className="mb-3">Dane użytkownika</h1>
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
                                        placeholder="Nazwa użytkownika"
                                        value={userData.username}
                                        aria-describedby="username"
                                        disabled={true}
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
                                        placeholder="Imie i Nazwisko"
                                        value={userData.name}
                                        aria-describedby="name"
                                        disabled={true}
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
                                        placeholder="Email"
                                        value={userData.email}
                                        aria-describedby="email"
                                        disabled={true}
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
                                        placeholder="Jednostka orgnizacyjna"
                                        value={userData.unit}
                                        aria-describedby="unit"
                                        disabled={true}
                                    />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup className="mb-3">
                                <InputGroup>
                                    <InputGroup.Text id="role">Rola</InputGroup.Text>
                                    <FormControl
                                        type="text"
                                        id="role"
                                        name="role"
                                        placeholder="Rola"
                                        value={mapRole()}
                                        aria-describedby="role"
                                        disabled={true}
                                    />
                                </InputGroup>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
                <Button style={{maxWidth: "200px"}} onClick={() => nav("/passwordChange")}>Zmień hasło</Button>
            </div>
        </>
    );
}

export default UserDetailsPage;