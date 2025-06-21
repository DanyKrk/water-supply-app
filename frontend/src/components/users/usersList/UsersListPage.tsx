import TopNavbar from "../../common/topNavbar/TopNavbar.tsx";
import {useEffect, useState} from "react";
import Table from 'react-bootstrap/Table';
import UsersService from "../../../services/users/UsersService.ts";
import UserEntity from "../../../constants/users/UserEntity.ts";
import Button from "@mui/material/Button";
import "./index.css";
import EventBus from "../../../common/EventBus.ts";
import UserListEntity from "../../../constants/users/UserListEntity.ts";
import {useNavigate} from "react-router-dom";


const UsersListPage = () => {
    const [data, setData] = useState<UserListEntity[]>([]);
    const nav = useNavigate();

    const getOperators = async () => {
        await UsersService.getUsers().then(
            (response) => {
                const data = response.data.map((item: UserEntity) => {
                    let role: string
                    if (item.role == "ROLE_USER") {
                        role = "użytkownik"
                    } else {
                        role = "administrator"
                    }
                    const user: UserListEntity = {
                        id: item.id,
                        username: item.username,
                        name: item.name,
                        email: item.email,
                        unit: item.unit,
                        role: role
                    }
                    return user;
                })
                setData(data);
            }
        ).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            }
        })
    }

    useEffect(() => {
        getOperators();
    }, []);

    return (
        <div>
            <TopNavbar/>
            <h1 className="bottom-space">Użytkownicy</h1>
            <div className={"table-container"}>
                <Table responsive="sm">
                    <thead>
                    <tr>
                        <th>Nazwa użytkownika</th>
                        <th>Imię i Nazwisko</th>
                        <th>Email</th>
                        <th>Jednostka organizacyjna</th>
                        <th>Uprawnienia</th>
                        <th>Edytuj</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.username}</td>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.unit}</td>
                            <td>{item.role}</td>
                            <td>
                                <Button variant="outlined"
                                        style={{color: "#00A3E5"}}
                                        onClick={() => {
                                            nav("/userDetailsUpdate/" + item.id);
                                        }}>
                                    Edytuj
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default UsersListPage;