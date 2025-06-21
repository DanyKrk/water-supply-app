import React from "react";
import Button from "@mui/material/Button";
import {ButtonGroup, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import {Collapse} from "react-bootstrap";
import PlaceIcon from '@mui/icons-material/Place';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import {useNavigate} from "react-router-dom";
import Card from "@mui/material/Card";
import MiniGallery from "./gallery/MiniGallery.tsx";
import SpotInfoComponentProps from "../../../constants/spots/spotsMap/SpotInfoComponentProps.ts";


const SpotInfoComponent: React.FC<SpotInfoComponentProps> = ({spot}) => {

    const [infoOpen, setInfoOpen] = React.useState(false);
    const [descriptionOpen, setDescriptionOpen] = React.useState(false);

    const nav = useNavigate();

    const enterData = (spotId: string | undefined) => {
        if (spotId != undefined) {
            nav(`/forms/${spotId}`, {replace: true});
        }
    };

    const showReadings = (spotId: string | undefined) => {
        if (spotId != undefined) {
            nav(`/table/${spotId}`, {replace: true});
        }
    };

    const showDetails = (spotId: string | undefined) => {
        if (spotId != undefined) {
            nav(`/details/${spotId}`, {replace: true});
        }
    };

    return (
        <div>
            <Card sx={{
                maxHeight: 400,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <MiniGallery spotId={spot.id}/>
            </Card>
            <ButtonGroup className="w-100 bg-light" orientation="vertical">
                <Button onClick={() => enterData(spot.id)}>Wprowadź dane</Button>
                <Button onClick={() => showReadings(spot.id)}>Odczyty</Button>
                <Button onClick={() => showDetails(spot.id)}>Szczegóły</Button>
            </ButtonGroup>
            <div className="ms-1 m-0">
                <List>
                    <ListItem>
                        <ListItemText primary={spot.foundationDate} secondary="Data powstania" sx={{margin: 0}}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={spot.type} secondary="Typ" sx={{margin: 0}}/>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <PlaceIcon />
                        </ListItemIcon>
                        <div className="col btn-group-vertical overflow-auto">
                            <ListItemText primary={spot.location.y} sx={{margin: 0, whiteSpace: 'break-spaces'}}/>
                            <ListItemText primary={spot.location.x} sx={{margin: 0}}/>
                        </div>
                    </ListItem>
                    <ListItemButton onClick={() => setDescriptionOpen(!descriptionOpen)}>
                        <ListItemIcon>
                            <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText secondary="Opis"/>
                        {descriptionOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={descriptionOpen} unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemText primary={spot.description} sx={{textAlign: "start"}} />
                        </List>
                    </Collapse>
                    <ListItemButton onClick={() => setInfoOpen(!infoOpen)}>
                        <ListItemIcon>
                            <InfoIcon />
                        </ListItemIcon>
                        <ListItemText secondary="Informacje" />
                        {infoOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={infoOpen} unmountOnExit>
                        <List component="div" disablePadding>
                            {Object.keys(spot.additionalInfo).map((key, index) => (
                                <ListItem key={index} sx={{ pl: 1 }}>
                                    <ListItemText primary={spot.additionalInfo[key]}
                                                  secondary={key} />
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>
            </div>
        </div>
    )
}

export default SpotInfoComponent;