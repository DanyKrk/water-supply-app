import LOGO from "../../../assets/logo.png";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './index.css'
import {useEffect, useState} from "react";
import AuthService from "../../../services/users/AuthService.ts";
import EventBus from "../../../common/EventBus.ts";

export default function TopNavbar() {
    const nav = useNavigate();
    const [close, setClose] = useState("xl");
    const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

    const goToSpotsList = () => {
        nav(`/list`);
    };
    const goToCreator = () => {
        nav(`/addSpot`);
    }

    const goToFormsManager = () => {
        nav(`/formsManager`);
    }

    const goToAddUserPage = () => {
        nav(`/addUser`);
    }

    const goToUserListPage = () => {
        nav(`/users`);
    }

    const goToHistoryPage = () => {
        nav(`/history`);
    }

    const logout = () => {
        AuthService.logout();
        nav(`/`);
    }

    const goToMainPage = () => {
        nav(`/`);
    }

    const goToAccount = () => {
        nav(`/userDetails`);
    }

    EventBus.on("logout", logout);

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
            if (showAdminBoard) {
                setClose("true");
            }
        } else {
            setIsLoggedIn(false);
        }

        return () => {
            EventBus.remove("logout", logout);
        };
    }, [showAdminBoard, close]);

    const goToMap = () => {
        nav(`/map`, {replace: true});
    }

    return (
        <div className="main-header" style={{position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9998}}>
            <Navbar collapseOnSelect expand={close} className="navbar-gradient">
                <Container className="full-width-container">
                    <Navbar.Brand onClick={goToMainPage} className="d-flex align-items-center ml-auto text-color">
                        <img
                            alt=""
                            src={LOGO}
                            width="69"
                            height="80"
                            className="d-inline-block align-top"
                        />
                    </Navbar.Brand>
                    {isLoggedIn && <Navbar.Toggle aria-controls="responsive-navbar-nav" className="navbar-gradient"/>}
                    <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-center navbar-gradient">
                        <Nav className="nav">
                            {isLoggedIn && <Nav.Link onClick={goToMap} className="text-color">Mapa</Nav.Link>}
                            {isLoggedIn &&  <Nav.Link onClick={goToSpotsList} className="text-color">Lista punktów
                                pomiarowych</Nav.Link>}
                            {showAdminBoard &&
                                <Nav.Link onClick={goToCreator} className="text-color">Dodaj punkt pomiarowy</Nav.Link>}
                            {showAdminBoard && <Nav.Link onClick={goToFormsManager} className="text-color">Menedżer
                                formularzy</Nav.Link>}
                            {showAdminBoard && <Nav.Link onClick={goToHistoryPage} className="text-color">Historia edycji</Nav.Link>}
                            {showAdminBoard && <Nav.Link onClick={goToUserListPage} className="text-color">Użytkownicy</Nav.Link>}
                            {showAdminBoard && <Nav.Link onClick={goToAddUserPage} className="text-color">Dodaj użytkownika</Nav.Link>}
                            {isLoggedIn && <Nav.Link onClick={goToAccount} className="text-color">Moje konto</Nav.Link>}
                            {isLoggedIn && <Nav.Link className="text-color">
                                <Button variant="outlined"
                                        onClick={logout}
                                        style={{color: "#00A3E5"}}>
                                    Wyloguj się
                                </Button>
                            </Nav.Link>}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}
