import {MapContainer, TileLayer, Marker, Popup, useMapEvents} from 'react-leaflet';
import mapConfig from "../../../assets/mapConfig.json"
import Spot from "../../../constants/spots/Spot.ts"
import SpotService from "../../../services/spots/SpotService.ts";
import React from "react";
import {Dialog, Fab, Paper} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SpotCreator from "../spotCreator/SpotCreator.tsx";
import {LatLng} from "leaflet";
import EventBus from "../../../common/EventBus.ts";
import MapComponentProps from "../../../constants/spots/spotsMap/MapComponentProps.ts";

const MapComponent: React.FC<MapComponentProps> = ({setActiveSpot, addSpot, setAddSpot}) => {

    const [spots, setSpots] = React.useState([]);
    const [map, setMap] = React.useState();
    const [newSpotPosition, setNewSpotPosition] = React.useState<LatLng | null>(null);
    const [spotCreatorOpen, setSpotCreatorOpen] = React.useState(false);

    const getSpots = async () => {
        await SpotService.getAllSpots().then((response) => {
            setSpots(response.data.content);
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            }
        });
    }

    React.useEffect(() => {
        getSpots();
    }, [spots]);

    React.useEffect(() => {
        if (!addSpot) {
            setNewSpotPosition(null);
        }
    }, [addSpot]);

    function SpotAdder() {
        useMapEvents({
            click(e) {
                setNewSpotPosition(e.latlng)
            },
        });
        return newSpotPosition === null ? null : (
            <Marker position={newSpotPosition}/>
        )
    }

    function MapEvents() {
        useMapEvents({
            click() {
                setActiveSpot(undefined);
            },
        });
        return null;
    }

    return (
        <div className="pt-3 mt-3">
            <Dialog open={spotCreatorOpen}
                    onClose={() => {
                        setSpotCreatorOpen(false);
                        setAddSpot(false);
                    }}
                    style={{top: "75px"}}
                    className="mt-2">
                <Paper className="p-3 m-0">
                    {newSpotPosition &&
                        (<SpotCreator
                                location={{lat: newSpotPosition["lat"], lng: newSpotPosition["lng"]}}
                                view="map"
                                onAdd={() => {
                                    setSpotCreatorOpen(false);
                                    setAddSpot(false);
                                }}
                            />
                        )}
                </Paper>
            </Dialog>
            {addSpot && newSpotPosition &&
                <Fab variant="extended" color="primary" className="position-fixed m-5 bottom-0 end-0"
                     onClick={() => {
                         setSpotCreatorOpen(true);
                     }}
                >
                    <AddIcon className="m-1"/>
                    Dodaj {(newSpotPosition) ? newSpotPosition["lat"] + " " + newSpotPosition["lng"] : ""}
                </Fab>
            }
            <MapContainer style={{width: "100%", height: "80vh"}} center={[mapConfig.lat, mapConfig.lng]} zoom={10}
                          scrollWheelZoom={true} ref={setMap}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {addSpot ? <SpotAdder/> : <MapEvents/>}
                {spots.map((spot: Spot) => (
                    <Marker opacity={addSpot ? 0.5 : 1} key={spot.id} position={[spot.location.y, spot.location.x]}
                            eventHandlers={{
                                click: () => {
                                    setAddSpot(false);
                                    setActiveSpot(spot);
                                    if (map) {
                                        map.flyTo([spot.location.y, spot.location.x], 10, {
                                            animate: true,
                                            duration: 0.5
                                        })
                                    }
                                },
                            }}
                    >
                        <Popup>
                            <div>
                                <p>{spot.name}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}

export default MapComponent;