import React from "react";
import FormEntity from "../../../constants/inputs/forms/FormEntity.ts";
import FormsService from "../../../services/forms/FormsService.ts";
import SingleFormEditor from "./SingleFormEditor.tsx";
import FormEditorProps from "../../../constants/formsManager/formsEditor/FormEditorProps.ts";

const FormsEditor: React.FC<FormEditorProps> = ({formEntities, refreshForms}) => {

    const [openStates, setOpenStates] = React.useState(Array(formEntities.length).fill(false));

    const toggleCollapse = (index: number) => {
        const updatedOpenStates = [...openStates];
        updatedOpenStates[index] = !updatedOpenStates[index];
        setOpenStates(updatedOpenStates);
    }

    const updateForm = async (formId: string, formEntity: FormEntity) => {
        await FormsService.updateForm(formId, formEntity).then(() => {
            refreshForms();
        });
    }

    const deleteForm = async (formId: string) => {
        await FormsService.deleteForm(formId).then(() => {
            refreshForms();
        });
    }

    return (
        <div className="col">
            <h1 className="mb-5">Dostępne formularze</h1>
            {formEntities.map((formEntity, index) => (
                <SingleFormEditor
                    formEntity={formEntity}
                    index={index}
                    openStates={openStates}
                    toggleCollapse={toggleCollapse}
                    updateForm={updateForm}
                    deleteForm={deleteForm}
                />
            ))}
        </div>
    )
}

export default FormsEditor;