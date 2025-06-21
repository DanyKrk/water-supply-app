import TopNavbar from "../../common/topNavbar/TopNavbar.tsx";
import {Form, FormGroup, FormControl, InputGroup, Button, Collapse} from 'react-bootstrap';
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Alert} from "@mui/material";
import AuthService from "../../../services/users/AuthService.ts"
import {UserAuthDto} from "../../../constants/users/UserAuthDto.ts";
import "./loginPageIndex.css"

const LoginPage = () => {
    const [open, setOpen] = React.useState(false);
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    } as UserAuthDto);

    const nav = useNavigate();

    const handleChange = (change: { target: { name: string; value: string; }; }) => {
        const {name, value} = change.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
    };

    const showSpotsList = () => {
        nav(`/list`);
    };


    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            showSpotsList();
        }
    }, [showSpotsList]);


    const handleSubmit = async () => {
        await AuthService.login(loginData.username, loginData.password)
            .then(() => {
                const user = AuthService.getCurrentUser();
                if (user) {
                    showSpotsList();
                }
            }).catch(() => {
                setOpen(true);
            });
    };

    return (
        <>
            <header>
                <TopNavbar></TopNavbar>
            </header>
            <Collapse in={open} className="centered-collapse">
                <div className={`alert ${open ? '' : 'alert-hidden'}`}>
                    <Alert
                        severity="error"
                        onClose={() => {
                            setOpen(false)
                        }}
                    >
                        Błąd! Login lub hasło jest nieprawidłowe. {/*TODO message should depend on error type*/}
                    </Alert>
                </div>
            </Collapse>
            <div>
                <h1 className="mb-3">Logowanie</h1>
                <div className="container">
                    <div className={"row justify-content-center align-items-center"}>
                        <Form style={{maxWidth: "500px"}}>
                            <FormGroup className="mb-3">
                                <InputGroup>
                                    <FormControl
                                        type="text"
                                        id="username"
                                        name="username"
                                        placeholder="Wprowadź login"
                                        value={loginData.username}
                                        onChange={handleChange}
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
                                        value={loginData.password}
                                        onChange={handleChange}
                                    />
                                </InputGroup>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
                <Button style={{maxWidth: "200px"}} onClick={handleSubmit}>Zaloguj się</Button>
            </div>
        </>
    );
}

export default LoginPage;