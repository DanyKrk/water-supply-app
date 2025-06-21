import FormField from "../formField/FormField.tsx";
import {useNavigate} from 'react-router-dom';
import {useState} from "react";
import SingleReadingEntity from "../../../../constants/common/SingleReadingEntity.ts";
import EntryFormDto from "../../../../constants/inputs/forms/entryForm/EntryFormDto.ts";
import ReadingService from "../../../../services/readings/ReadingService.ts";
import {polishParameterTypeNames} from "../../../../constants/inputs/forms/ParameterType.ts";
import EventBus from "../../../../common/EventBus.ts";
import {Collapse} from "react-bootstrap";
import {Alert} from "@mui/material";
import Modal from "react-bootstrap/Modal";
import Button from "@mui/material/Button";
import checkNumericValues from "../../../common/checkNumericValues/CheckNumericValues.tsx";

const EntryForm = ({parameters, spotId}: EntryFormDto) => {
    const [openAlert, setOpenAlert] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [formFieldValues, setFormFieldValues] = useState<{
        [fieldName: string]: string;
    }>({});

    const handleInputChange = (fieldName: string, value: string) => {
        setFormFieldValues((prevValues) => ({
            ...prevValues,
            [fieldName]: value,
        }));
    };
    const saveReadings = async () => {
        const readings = new Array<SingleReadingEntity>();
        parameters.forEach(parameter => {
            const singleReading = {
                parameter: parameter.name,
                parameterValue: formFieldValues[parameter.name],
                parameterType: parameter.type
            } as SingleReadingEntity;
            readings.push(singleReading);
        });
        await ReadingService.addReading(spotId, readings).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            }
        });
        navigate()
    };

    const nav = useNavigate();

    function navigate() {
        nav(`/table/${spotId}`);
    }

    return (
        <>
            <Collapse in={openAlert} className="centered-collapse">
                <div className={`alert ${openAlert ? '' : 'alert-hidden'}`}>
                    <Alert
                        severity="error"
                        onClose={() => {
                            setOpenAlert(false)
                        }}
                    >
                        Błąd! Parametr liczbowy powinien być liczbą.
                    </Alert>
                </div>
            </Collapse>
            {parameters.length === 0 && <p>No item found</p>}
            {parameters.map((parameter) => (
                <FormField
                    key={parameter.name}
                    fieldName={`${polishParameterTypeNames[parameter.type]}: ${parameter.name}`}
                    updateInputValueInForm={(value) =>
                        handleInputChange(parameter.name, value)
                    }
                />
            ))}
            <Modal show={openModal} onHide={() => setOpenModal(false)} style={{display: 'flex', zIndex: 9999, top: '30%'}}>
                <Modal.Header closeButton>
                    <Modal.Title>Dodaj odczyt</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Czy jesteś pewien poprawności wprowadzonych danych?</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outlined" className="mr-3" onClick={() => setOpenModal(false)}>Zamknij</Button>
                    <Button variant="outlined" size="medium" color="success" className="mx-2" onClick={saveReadings}>Wyślij formularz</Button>
                </Modal.Footer>
            </Modal>
            <p>
                <Button color="success" variant="contained" className="m-2 w-auto" onClick={() => checkNumericValues(parameters, formFieldValues, setOpenAlert, setOpenModal)}>Wyślij formularz</Button>
            </p>
        </>
    );
};

export default EntryForm;
