import Spot from "../Spot.ts";

export default interface MapLeftMenuProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    addSpot: boolean,
    setAddSpot: (addSpot: boolean) => void,
    activeSpot?: Spot
}