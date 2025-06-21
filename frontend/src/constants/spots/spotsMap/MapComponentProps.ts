import Spot from "../Spot.ts";

export default interface MapComponentProps {
    setActiveSpot: (spot: Spot | undefined) => void;
    addSpot: boolean;
    setAddSpot: (addSpot: boolean) => void;
}