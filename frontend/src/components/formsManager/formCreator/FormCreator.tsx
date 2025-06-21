import React, {useState} from "react";
import {Alert, Input, MenuItem, Select} from "@mui/material";
import {Button, Collapse} from "react-bootstrap";
import FormDto from "../../../constants/inputs/forms/FormDto.ts";
import ParameterType from "../../../constants/inputs/forms/ParameterType.ts";
import "./indexFormCreator.css";
import FormsService from "../../../services/forms/FormsService.ts";
import EventBus from "../../../common/EventBus.ts";
import FormCreatorProps from "../../../constants/formsManager/formCreator/FormCreatorProps.ts";
import Parameter from "../../../constants/inputs/forms/Parameter.ts";

const FormCreator: React.FC<FormCreatorProps> = ({refreshForms}) => {
    const [open, setOpen] = React.useState(false);
    const [formEntity, setFormEntity] = React.useState({} as FormDto);
    const [formName, setFormName] = React.useState("");
    const [formParameters, setFormParameters] = useState<{
        [key: string]: ParameterType;
    }>({});
    const [newParameter, setNewParameter] = React.useState<Parameter>({
        name: "",
        type: ParameterType.TEXT,
    });

    React.useEffect(() => {
        setFormEntity({
            name: formName,
            parameters: Object.entries(formParameters).map(([key, value]) => ({
                name: key,
                type: value,
            })),
        });
    }, [formParameters, formName]);

    const addParameter = (parameter: Parameter) => {
        setFormParameters({
            ...formParameters,
            [parameter.name]: parameter.type,
        });
    };

    const removeParameter = (name: string) => {
        setFormParameters(
            Object.fromEntries(
                Object.entries(formParameters).filter(([key]) => key !== name)
            )
        );
    };

    const saveForm = async () => {
        await FormsService
            .addForm(formEntity)
            .then(() => {
                refreshForms();
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("refresh");
                    location.reload();
                } else if (error.response && error.response.status === 409) {
                    setOpen(true);
                }
            })
    };

    return (
        <div>
            <Collapse in={open} className="centered-collapse">
                <div className={`alert ${open ? '' : 'alert-hidden'}`}>
                    <Alert
                        severity="error"
                        onClose={() => {
                            setOpen(false)
                        }}
                    >
                        Błąd! Formularz o podanej nazwie już istnieje.
                    </Alert>
                </div>
            </Collapse>
            <div className="col align-items-center d-flex">
                <Input
                    multiline
                    className="m-2 mb-5 mt-1 flex-fill"
                    placeholder="Nazwa formularza"
                    onChange={(event) => {
                        setFormName(event.target.value);
                    }}
                ></Input>
            </div>
            {Object.keys(formParameters).map((parameter, index) => (
                <div className="col align-items-center d-flex" key={index}>
                    <div className="col align-items-center d-flex" key={index}>
                        <Button
                            className="m-2"
                            onClick={() => removeParameter(parameter)}
                        >
                            Usuń parametr
                        </Button>
                        <label className="m-2 form-label text-start flex-fill">
                            {parameter}
                        </label>
                        <Select
                            value={formParameters[parameter]}
                            className="m-2"
                            onChange={(event) => {
                                setFormParameters({
                                    ...formParameters,
                                    [parameter]: event.target.value as ParameterType,
                                });
                            }}
                        >
                            <MenuItem value={ParameterType.TEXT}>
                                Tekst
                            </MenuItem>
                            <MenuItem value={ParameterType.NUMBER}>
                                Liczba
                            </MenuItem>
                        </Select>
                    </div>
                </div>
            ))}
            <div className="col align-items-center d-flex">
                <Button
                    style={{backgroundColor: "green", borderColor: "green"}}
                    className="m-2"
                    onClick={() => {
                        addParameter(newParameter);
                    }}
                >
                    Dodaj parametr
                </Button>
                <Input
                    multiline
                    className="m-2 flex-fill"
                    placeholder="Nazwa"
                    onChange={(event) => {
                        setNewParameter({
                            ...newParameter,
                            name: event.target.value,
                        });
                    }}
                />
                <Select
                    defaultValue={ParameterType.TEXT}
                    className="m-2"
                    onChange={(event) => {
                        setNewParameter({
                            ...newParameter,
                            type: event.target.value as ParameterType,
                        });
                    }}
                >
                    <MenuItem value={ParameterType.TEXT}>Tekst</MenuItem>
                    <MenuItem value={ParameterType.NUMBER}>Liczba</MenuItem>
                </Select>
            </div>
            <Button
                className="m-2 mt-5 w-100"
                onClick={() => {
                    saveForm();
                }}
            >
                Zapisz formularz
            </Button>
        </div>
    );
};

export default FormCreator;
