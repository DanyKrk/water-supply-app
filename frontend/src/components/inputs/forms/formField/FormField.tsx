import {useEffect, useState} from "react";
import FormFieldProps from "../../../../constants/inputs/forms/formField/FormFieldProps.ts";

const FormField = ({fieldName, updateInputValueInForm, placeholder, initialValue=""}: FormFieldProps) => {
    const [inputValue, setInputValue] = useState(initialValue);

    useEffect(() => {
        updateInputValueInForm(inputValue);
    }, [inputValue]);

    return (
        <div className="mb-2 mt-2">
            <div className="input-group">
                <span className="input-group-text text-wrap" id="basic-addon">
                    {fieldName}
                </span>
                <input
                    type="text"
                    className="form-control"
                    id={fieldName}
                    aria-describedby="basic-addon"
                    placeholder={placeholder}
                    onChange={(event) => {
                        setInputValue(event.target.value);
                    }}
                />
            </div>
        </div>
    );
};

export default FormField;
