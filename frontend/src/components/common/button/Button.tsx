import ButtonProps from "../../../constants/common/button/ButtonProps.ts";

const Button = ({children, color = "primary", onClick}: ButtonProps) => {
    return (
        <button type="button" className={"btn btn-" + color} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
