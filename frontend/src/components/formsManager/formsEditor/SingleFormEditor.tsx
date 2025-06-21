import FormEntity from "../../../constants/inputs/forms/FormEntity.ts";
import {Button, Collapse} from "react-bootstrap";
import SingeFormParameterEditor from "./SingleFormParameterEditor.tsx";
import ParameterType from "../../../constants/inputs/forms/ParameterType.ts";
import SingeFormParameterAdder from "./SingleFormParameterAdder.tsx";
import React from "react";
import SingleFormEditorProps from "../../../constants/formsManager/formsEditor/SingleFormEditorProps.ts";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "react-bootstrap/Modal";


const SingleFormEditor: React.FC<SingleFormEditorProps> = ({formEntity, index, openStates, toggleCollapse, updateForm, deleteForm}) => {

    let localFormEntity = React.useMemo(() => formEntity, [formEntity]);

    const [newParameters, setNewParameters] = React.useState([] as { name: string, type: ParameterType }[]);

    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

    const setLocalFormEntity = (formEntity: FormEntity) => {
        localFormEntity = formEntity;
    }

    React.useEffect(() => {
        setLocalFormEntity(formEntity);
    }, [formEntity]);


    return (
        <div className="row" key={index}>
            <Button className="mr-3 form-label text-start" onClick={() => toggleCollapse(index)}>
                {formEntity.name}
            </Button>
            <Collapse in={openStates[index]}>
                <div className="bg-light">
                    {formEntity.parameters.map((parameter, paramIndex) => (
                        <SingeFormParameterEditor
                            key={index + "_" + parameter.name}
                            named={index + "_" + parameter.name}
                            parameter={parameter}
                            onChangeName={(value: string) => {
                                localFormEntity.parameters[paramIndex].name = value;
                                setLocalFormEntity(localFormEntity);
                            }}
                            onChangeType={(value: ParameterType) => {
                                localFormEntity.parameters[paramIndex].type = value;
                                setLocalFormEntity(localFormEntity);
                            }}
                            onRemove={() => {
                                localFormEntity.parameters.splice(paramIndex, 1);
                                setLocalFormEntity(localFormEntity);
                            }}
                        />
                    ))}

                    <SingeFormParameterAdder
                        named={index + "_new"}
                        onAccept={(name, type: ParameterType) => {
                            const newParameter = {
                                name: name,
                                type: type
                            };
                            localFormEntity.parameters.push(newParameter);
                            setLocalFormEntity(localFormEntity);
                            setNewParameters([...newParameters, newParameter]);
                        }}
                    />

                    <Modal show={openDeleteModal} onHide={() => setOpenDeleteModal(false)} style={{display: 'flex', zIndex: 9999, top: '30%'}}>
                        <Modal.Header closeButton>
                            <Modal.Title>Usuń formularz</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>Czy na pewno chcesz usunąć formularz?</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button className="mr-3 btn-outline-primary btn-light"
                                    onClick={() => setOpenDeleteModal(false)}>Zamknij</Button>
                            <Button className="mx-2 btn-outline-danger btn-light"
                                    startIcon={<DeleteIcon/>} onClick={() => {
                                deleteForm(formEntity.id);
                            }}>Usuń</Button>
                        </Modal.Footer>
                    </Modal>

                    <div className="col flex-fill">
                        <Button className="m-2 w-auto btn-success" onClick={
                            () => {
                                updateForm(formEntity.id, formEntity);
                            }}>
                            Zapisz zmiany</Button>
                        <Button className="m-2 w-auto btn-danger" onClick={
                            () => setOpenDeleteModal(true)
                        }>Usuń formularz</Button>
                    </div>
                </div>
            </Collapse>
        </div>
    )
}

export default SingleFormEditor;