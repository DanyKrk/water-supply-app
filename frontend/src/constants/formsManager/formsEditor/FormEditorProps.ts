import FormEntity from "../../inputs/forms/FormEntity.ts";

export default interface FormEditorProps {
    formEntities: FormEntity[],
    refreshForms: () => void
}