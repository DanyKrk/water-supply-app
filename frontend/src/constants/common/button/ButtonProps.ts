import {ReactNode} from "react";

export default interface ButtonProps {
    children: ReactNode;
    color?: "primary" | "secondary" | "danger";
    onClick: () => void;
}