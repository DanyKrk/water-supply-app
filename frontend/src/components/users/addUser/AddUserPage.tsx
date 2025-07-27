import TopNavbar from "../../common/topNavbar/TopNavbar.tsx";
import {Form, FormGroup, FormControl, InputGroup, Button, Collapse} from 'react-bootstrap';
import React, {useEffect, useState} from "react";
import {Alert} from "@mui/material";
import AuthService from "../../../services/users/AuthService.ts"
import {useNavigate} from "react-router-dom";
import "./indexAddUserPage.css";
import {UserRegisterDto} from "../../../constants/users/UserRegisterDto.ts";
import EventBus from "../../../common/EventBus.ts";

const AddUserPage = () => {
    const [error, setError] = React.useState("");
    const [registerData, setRegisterData] = useState({
        username: '',
        name: '',
        email: '',
        unit: '',
        role: 'ROLE_USER',
        password: ''
    } as UserRegisterDto);
    const [passwordCheck, setPasswordCheck] = useState("");
    const nav = useNavigate();

    const handleChange = (change: { target: { name: string; value: string; }; }) => {
        const {name, value} = change.target;
        setRegisterData({
            ...registerData,
            [name]: value
        });
    };

    const handlePasswordCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordCheck(event.target.value);
    };


    const handleSubmit = async () => {
        if (registerData.password !== passwordCheck) {
            setError("Błąd! Hasła się od siebie różnią.");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
        if (!passwordRegex.test(registerData.password)) {
            setError("Błąd! Hasło nie spełnia wymogów bezpieczeństwa (min. 12 znaków, wielka i mała litera, cyfra, znak specjalny).");
            return;
        }

        await AuthService.register(registerData)
            .then(() => {
               nav(`/users`);
            }).catch((error) => {
                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("refresh");
                    location.reload();
                } else if (error.response && error.response.status === 409) {
                    setError("Błąd! Podany login jest zajęty.")
                } else {
                    setError("Błąd nieznany.")
                }
            });
    };

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!(user && user.roles.includes("ROLE_ADMIN"))) {
            nav(`/`);
        }
    }, [nav]);

    return (
        <>
            <header>
                <TopNavbar></TopNavbar>
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
                <h1 className="mb-3" style={{marginTop: "20px"}}>Utwórz nowe konto</h1>
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
                                        value={registerData.username}
                                        onChange={handleChange}
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
                                        placeholder="Imię i nazwisko"
                                        value={registerData.name}
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
                                        placeholder="Email"
                                        value={registerData.email}
                                        onChange={handleChange}
                                        aria-describedby="email"
                                    />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup className="mb-3">
                                <InputGroup>
                                    <InputGroup.Text id="unit">Jednostka</InputGroup.Text>
                                    <FormControl
                                        type="text"
                                        id="unit"
                                        name="unit"
                                        placeholder="Jednostka organizacyjna"
                                        value={registerData.unit}
                                        onChange={handleChange}
                                        aria-describedby="unit"
                                    />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup className="mb-3">
                                <InputGroup>
                                    <FormControl
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="Wprowadź hasło"
                                        value={registerData.password}
                                        onChange={handleChange}
                                    />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup className="mb-3">
                                <InputGroup>
                                    <FormControl
                                        type="password"
                                        id="passwordCheck"
                                        name="passwordCheck"
                                        placeholder="Wprowadź hasło ponownie"
                                        value={passwordCheck}
                                        onChange={handlePasswordCheck}
                                    />
                                </InputGroup>
                            </FormGroup>
                            <Form.Select
                                className="mb-3"
                                id="role"
                                name="role"
                                aria-label="Default select example"
                                value={registerData.role}
                                onChange={handleChange}
                            >
                                <option value="ROLE_USER">Użytkownik</option>
                                <option value="ROLE_ADMIN">Administrator</option>
                            </Form.Select>
                        </Form>
                    </div>
                </div>
                <Button style={{maxWidth: "200px"}} onClick={handleSubmit}>Dodaj konto</Button>
            </div>
        </>
    );
}

export default AddUserPage;