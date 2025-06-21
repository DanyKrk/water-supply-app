import {Drawer, IconButton} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import React from "react";
import InfoLeftMenu from "./InfoLeftMenu.tsx";
import MapLeftMenuProps from "../../../constants/spots/spotsMap/MapLeftMenuProps.ts";
import AuthService from "../../../services/users/AuthService.ts";

const MapLeftMenu: React.FC<MapLeftMenuProps> = ({open, setOpen, addSpot, setAddSpot, activeSpot}) => {

    const [isAdmin, setIsAdmin] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (activeSpot !== undefined) setOpen(true);
        else setOpen(false);
    }, [activeSpot, setOpen]);

    React.useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setIsAdmin(user.roles.includes("ROLE_ADMIN"));
        }
    }, []);

    React.useEffect(() => {
        setOpen(false);
    }, []);

    return (
        <div>
            <Drawer
                sx={{
                    minWidth: "50px",
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: "4%",
                        minWidth: "50px",
                        paddingTop: "10px",
                        boxSizing: "border-box",
                        background: "white",
                    },
                }}
                variant="permanent"
                anchor="left"
                open={true}
            >
                <div className="container mt-5 mb-5 pt-5 pb-5 m-0 p-0">
                    <IconButton onClick={() => {
                        setOpen(!open);
                        setAddSpot(false);
                    }}>
                        <MenuIcon />
                    </IconButton>
                    {isAdmin &&
                        <IconButton className="mt-4" onClick={() => setAddSpot(!addSpot)}>
                            {!addSpot ? <AddCircleOutlineIcon /> : <CancelIcon />}
                        </IconButton>
                    }
                </div>
            </Drawer>
            <InfoLeftMenu open={open} setOpen={setOpen} activeSpot={activeSpot} />
        </div>
    )
}

export default MapLeftMenu;