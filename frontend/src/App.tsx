import "./App.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Table from "./components/presentation/readingsTable/Table.tsx";
import FormsPage from "./components/inputs/forms/formsPage/FormsPage.tsx";
import ListPage from "./components/spots/spotsList/ListPage.tsx";
import SpotCreatorPage from "./components/spots/spotCreator/SpotCreatorPage.tsx";
import ReadingDetailsPage from "./components/presentation/readingDetails/ReadingDetailsPage.tsx";
import SpotDetails from "./components/spots/spotDetails/SpotDetails.tsx";
import FormsManagerPage from "./components/formsManager/FormsManagerPage.tsx";
import ChartsPage from "./components/presentation/charts/ChartsPage.tsx";
import SpotEditorPage from "./components/spots/spotDetails/edit/SpotDetailsEditorPage.tsx";
import LoginPage from "./components/users/login/LoginPage.tsx";
import FormsSelectionPage from "./components/formsManager/FormsSelectionPage.tsx";
import AddUserPage from "./components/users/addUser/AddUserPage.tsx";
import AuthService from "./services/users/AuthService.ts";
import EventBus from "./common/EventBus.ts";
import {useEffect} from "react";
import UsersListPage from "./components/users/usersList/UsersListPage.tsx";
import MapPage from "./components/spots/spotsMap/MapPage.tsx";
import UserDetailsUpdatePage from "./components/users/userDetails/update/UserDetailsUpdatePage.tsx";
import ChangePasswordPage from "./components/users/changePassword/ChangePasswordPage.tsx";
import UserDetailsPage from "./components/users/userDetails/UserDatailsPage.tsx";
import HistoryPage from "./components/history/HistoryPage.tsx";
import EntryFormPage from "./components/inputs/forms/entryForm/EntryFormPage.tsx";

const REFRESH_REQUEST_INTERVAL = 870000;

function App() {

    const refreshToken = async () => {
        const token = localStorage.getItem("refresh");
        if (token) {
            await AuthService.refresh(token)
                .then((response) => {
                    if (response.data.token) {
                        localStorage.removeItem("token");
                        localStorage.setItem("token", response.data.token);
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.status === 401) {
                        EventBus.dispatch("logout");
                        location.reload();
                    }
                });
        }
    }

    EventBus.on("refresh", refreshToken);

    useEffect(() => {
        setInterval(() => {
            refreshToken();
        }, REFRESH_REQUEST_INTERVAL);

        return () => {
            EventBus.remove("refresh", refreshToken);
        };

    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route path="/" element={<LoginPage/>}/>
                    <Route path="/list" element={<ListPage/>}/>
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/addSpot" element={<SpotCreatorPage/>}/>
                    <Route path="/details/:spotId" element={<SpotDetails/>}/>
                    <Route path="/editSpot/:spotId" element={<SpotEditorPage/>}/>

                    <Route path="/table/:spotId" element={<Table/>}/>
                    <Route path="/chartsPage/:spotId" element={<ChartsPage/>}/>
                    <Route path="/readingDetails/:spotId/:id" element={<ReadingDetailsPage/>}/>
                    <Route path="/formsSelection/:spotId" element={<FormsSelectionPage/>}/>
                    <Route path="/forms/:spotId" element={<FormsPage/>}/>
                    <Route path="/entryFormPage/:spotId" element={<EntryFormPage />}/>

                    <Route path="/formsManager" element={<FormsManagerPage/>}/>
                    <Route path="/addUser" element={<AddUserPage/>}/>
                    <Route path="/users" element={<UsersListPage/>}/>
                    <Route path="/history" element={<HistoryPage/>}/>
                    <Route path="/userDetailsUpdate/:userId" element={<UserDetailsUpdatePage/>} />
                    <Route path="/userDetails" element={<UserDetailsPage/>} />
                    <Route path="/passwordChange" element={<ChangePasswordPage/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;