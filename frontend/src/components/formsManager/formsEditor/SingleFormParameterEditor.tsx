import React from "react";
import {MenuItem, Select, TextField} from "@mui/material";
import ParameterType from "../../../constants/inputs/forms/ParameterType.ts";
import {Button} from "react-bootstrap";
import SingleFormParameterEditorProps from "../../../constants/formsManager/formsEditor/SingleFormParameterEditorProps.ts";

const SingeFormParameterEditor: React.FC<SingleFormParameterEditorProps> = ({named, parameter, onChangeName, onChangeType, onRemove}) => {
    const [parameterName, setParameterName] = React.useState(parameter.name);
    const [parameterType, setParameterType] = React.useState(parameter.type as ParameterType);
    const [isDeleted, setIsDeleted] = React.useState(false);

    return (
        <div className="flex-fill">
            <TextField key={named + "_name"} className="m-2" value={parameterName} onChange={
                (event) => {
                    setParameterName(event.target.value);
                    onChangeName(event.target.value);
                }
            }></TextField>
            <Select key={named + "_type"} className="m-2" value={parameterType} onChange={
                (event) => {
                    setParameterType(event.target.value as ParameterType);
                    onChangeType(event.target.value as ParameterType);
                }
            }>
                <MenuItem value={ParameterType.TEXT}>Tekst</MenuItem>
                <MenuItem value={ParameterType.NUMBER}>Liczba</MenuItem>
            </Select>
            {!isDeleted ? (
                <Button key={named + "_remove"} className="m-2" onClick={
                    () => {
                        setIsDeleted(true);
                        onRemove();
                    }
                }>Usuń</Button>
            ) : (
                <Button key={named + "_remove"} disabled className="m-2 btn-secondary" onClick={
                    () => {
                        setIsDeleted(false);
                    }
                }>Usunięto</Button>
            )}
        </div>
    )
}

export default SingeFormParameterEditor;