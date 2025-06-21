import React from "react";
import {AppBar, Drawer, IconButton} from "@mui/material";
import {ChevronLeft} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import SpotInfoComponent from "./SpotInfoComponent.tsx";
import InfoLeftMenuProps from "../../../constants/spots/spotsMap/InfoLeftMenuProps.ts";

const InfoLeftMenu: React.FC<InfoLeftMenuProps> = ({open, setOpen, activeSpot}) => {
    return (
        <>
            <Drawer
                sx={{
                    width: "20%",
                    minWidth: "200px",
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        top: "50px",
                        width: "20%",
                        minWidth: "200px",
                        height: 'calc(100% - 50px)',
                        paddingTop: "5px",
                        boxSizing: "border-box",
                        background: "white",
                        overflow: "hidden",
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <div className="container mt-5 m-0 p-0 overflow-y-auto">
                    <AppBar className="mt-1 flex-row flex-fill" position="static">
                        <IconButton className="m-1 align-self-start" edge="start" onClick={() => setOpen(!open)}>
                            <div className="d-flex flex-fill">
                                <ChevronLeft />
                            </div>
                        </IconButton>
                        {activeSpot && (
                            <Typography className="m-1 align-self-center text-break" variant="h6">
                                {activeSpot.name}
                            </Typography>
                        )}
                    </AppBar>
                    <div className="col mt-0">
                        {activeSpot && (
                            <SpotInfoComponent spot={activeSpot} />
                        )}
                    </div>
                </div>
            </Drawer>
        </>
    )
}

export default InfoLeftMenu;