import Parameter from "../../../constants/inputs/forms/Parameter.ts";
import ParameterType from "../../../constants/inputs/forms/ParameterType.ts";

const checkNumericValues = (parameters: Parameter[],
                            formFieldValues: {[fieldName: string]: string},
                            setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>,
                            setOpenModal: React.Dispatch<React.SetStateAction<boolean>>) => {
    const hasNonNumericValue = parameters.some((parameter) => {
        return parameter.type === ParameterType.NUMBER && isNaN(Number(formFieldValues[parameter.name]));
    });

    if (hasNonNumericValue) {
        setOpenAlert(true);
    } else {
        setOpenModal(true);
    }
};

export default checkNumericValues;