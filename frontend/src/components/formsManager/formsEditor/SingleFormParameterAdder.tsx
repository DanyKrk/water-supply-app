import {MenuItem, Select, TextField} from "@mui/material";
import React from "react";
import ParameterType from "../../../constants/inputs/forms/ParameterType.ts";
import {Button} from "react-bootstrap";
import SingleFormParameterAdderProps from "../../../constants/formsManager/formsEditor/SingleFormParameterAdderProps.ts";


const SingleFormParameterAdder: React.FC<SingleFormParameterAdderProps> = ({named, onAccept}) => {

    const [parameterName, setParameterName] = React.useState("");
    const [parameterType, setParameterType] = React.useState(ParameterType.TEXT as ParameterType);

    return (
        <div className="flex-fill">
            <TextField key={named + "_name"} className="m-2" value={parameterName} onChange={
                (event) => {
                    setParameterName(event.target.value);
                }
            }></TextField>
            <Select key={named + "_type"} className="m-2" value={parameterType} onChange={
                (event) => {
                    setParameterType(event.target.value as ParameterType);
                }
            }>
                <MenuItem value={ParameterType.TEXT}>Tekst</MenuItem>
                <MenuItem value={ParameterType.NUMBER}>Liczba</MenuItem>
            </Select>
            <Button style={{backgroundColor: "green", borderColor: "green"}}
                    key={named + "_acc"} className="m-2" onClick={
                () => {
                    onAccept(parameterName, parameterType);
                    setParameterName("");
                }
            }>Dodaj</Button>
        </div>
    )
}

export default SingleFormParameterAdder;
