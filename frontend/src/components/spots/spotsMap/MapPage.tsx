import TopNavbar from "../../common/topNavbar/TopNavbar.tsx";
import MapComponent from "./MapComponent.tsx";
import React from "react";
import MapLeftMenu from "./MapLeftMenu.tsx";

const MapPage = () => {
    const [leftMenuOpen, setLeftMenuOpen] = React.useState(false);
    const [activeSpot, setActiveSpot] = React.useState(undefined);
    const [addSpot, setAddSpot] = React.useState(false);

    return (
        <div>
            <TopNavbar />
            <MapLeftMenu open={leftMenuOpen} setOpen={setLeftMenuOpen} addSpot={addSpot} setAddSpot={setAddSpot} activeSpot={activeSpot} />
            <div className="d-flex justify-content-end">
                <div className="w-100 ps-4">
                    <MapComponent setActiveSpot={setActiveSpot} addSpot={addSpot} setAddSpot={setAddSpot} />
                </div>
            </div>
        </div>
    )
}

export default MapPage;