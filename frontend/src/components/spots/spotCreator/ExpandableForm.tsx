import React, {useState} from "react";
import {Input} from "@mui/material";
import {Button} from "react-bootstrap";
import ParameterForm from "../../../constants/spots/ParameterForm.ts";
import ExpandableFormProps from "../../../constants/spots/spotCreator/ExpandableFormProps.ts";


const ExpandableForm: React.FC<ExpandableFormProps> = ({initialParameters, parametersSetter}) => {
    const [parameters, setParameters] = useState<{[key: string]: string}>(initialParameters || {});
    const [newParameter, setNewParameter] = useState<ParameterForm>({name: "", value: ""});

    const addParameter = (parameter: ParameterForm) => {
        setParameters({...parameters, [parameter.name]: parameter.value})
    }

    const removeParameter = (name: string) => {
        setParameters(Object.fromEntries(Object.entries(parameters).filter(([key]) => key !== name)));
    }

    React.useEffect(() => {
        parametersSetter(parameters);
    }, [parametersSetter, parameters]);

    return (
        <div className="col mt-5">
            {Object.keys(parameters).map((key, index) => (
                <div className="col align-items-center d-flex" key={index}>
                    <Button className="m-2" onClick={() => removeParameter(key)}>Usuń parametr</Button>
                    <label className="m-2 form-label text-break text-start" style={{ maxWidth: "50%" }}> {key} </label>
                    <Input multiline className="m-2 flex-fill" value={parameters[key]} onChange={
                        (event) => {
                            setParameters({...parameters, [key]: event.target.value});
                        }
                    }/>
                </div>
            ))}
            <div className="col align-items-center d-flex">
                <Button className="m-2" onClick={() => {addParameter(newParameter)}}>Dodaj parametr</Button>
                <Input multiline className="m-2 flex-fill" placeholder="Nazwa" onChange={
                    (event) => {
                        setNewParameter({...newParameter, name: event.target.value});
                    }
                }/>
                <Input multiline className="m-2 flex-fill" placeholder="Wartość" onChange={
                    (event) => {
                        setNewParameter({...newParameter, value: event.target.value});
                    }
                }/>
            </div>
        </div>
    )
}

export default ExpandableForm;