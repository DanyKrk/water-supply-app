import Spot from "../Spot.ts";

export default interface InfoLeftMenuProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    activeSpot?: Spot
}