import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import AuthService from "../../../services/users/AuthService.ts";
import TopNavbar from "../../common/topNavbar/TopNavbar.tsx";
import {Collapse, Form, FormControl, FormGroup, InputGroup} from "react-bootstrap";
import {Alert} from "@mui/material";
import {UserAuthDto} from "../../../constants/users/UserAuthDto.ts";
import UsersService from "../../../services/users/UsersService.ts";
import EventBus from "../../../common/EventBus.ts";
import Modal from "react-bootstrap/Modal";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";

const ChangePasswordPage = () => {
    const [error, setError] = React.useState("");
    const [registerSuccessAlert, setRegisterSuccessAlert] = React.useState(false);
    const [userData, setUserData] = useState({
        id: '',
        username: '',
        password: ''
    } as UserAuthDto);
    const [passwordCheck, setPasswordCheck] = useState("");

    const [show, setShow] = useState(false);

    const nav = useNavigate();

    const handleChange = (change: { target: { name: string; value: string; }; }) => {
        const {name, value} = change.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handlePasswordCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordCheck(event.target.value);
    };


    const handleSubmit = async () => {
        if (userData.password != passwordCheck) {
            setError("Błąd! Hasła się od siebie różnią.")
            return;
        } 
   
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
        if (!passwordRegex.test(userData.password)) {
            setError("Błąd! Hasło nie spełnia wymogów bezpieczeństwa (min. 12 znaków, wielka i mała litera, cyfra, znak specjalny).");
            setShow(false); 
            return;
        }

        UsersService.changePassword(userData).then(() => {
            setRegisterSuccessAlert(true)
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            } else if (error.response && error.response.status === 403) {
                setError("Uwaga! Wykrywa próba zmiany hasła użytkownika obecnie niezalogowanego!")
            } else if (error.response && error.response.status === 404) {
                setError("Błąd! Nie odnaleziono użytkownika. Proszę się zalogować na nowo.")
            } else {
                setError("Błąd nieznany. Proszę się zalogować na nowo.")
            }
        });
        setShow(false);
    };


    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!(user)) {
            nav(`/`);
        }
        const data = {
            id: user.id,
            username: user.username,
            password: ''
        } as UserAuthDto;
        setUserData(data);
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
            <Collapse in={registerSuccessAlert} className="centered-collapse">
                <Alert
                    severity="success"
                    onClose={() => {
                        setRegisterSuccessAlert(false)
                    }}
                >
                    Zmiana hasła powiodła się!
                </Alert>
            </Collapse>
            <div>
                <h1 className="mb-3">Zmień hasło</h1>
                <div className="container">
                    <div className={"row justify-content-center align-items-center"}>
                        <Form style={{maxWidth: "500px"}}>
                            <FormGroup className="mb-3">
                                <InputGroup>
                                    <FormControl
                                        type="text"
                                        id="username"
                                        name="username"
                                        disabled={true}
                                        placeholder={userData.username}
                                        value={userData.username}
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
                                        placeholder="Wprowadź nowe hasło"
                                        value={userData.password}
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
                                        placeholder="Wprowadź nowe hasło ponownie"
                                        value={passwordCheck}
                                        onChange={handlePasswordCheck}
                                    />
                                </InputGroup>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
                <Button variant="contained" color="success" style={{maxWidth: "200px", marginRight: "10px"}} onClick={() => setShow(true)}>Zmień hasło</Button>
                <Button variant="contained" style={{maxWidth: "200px"}} onClick={() => nav("/userDetails")}>Wróć</Button>
                <Modal show={show} onHide={() => setShow(false)} style={{display: 'flex', zIndex: 9999, top: '30%'}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Usuń zdjęcie</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Czy na pewno chcesz zmienić hasło?</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="outlined" className="mr-3" onClick={() => setShow(false)}>Zamknij</Button>
                        <Button variant="outlined" size="medium" color="success" className="mx-2" onClick={handleSubmit}>Zmień hasło</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}

export default ChangePasswordPage;