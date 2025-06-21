import FormEntity from "../../inputs/forms/FormEntity.ts";

export default interface SingleFormEditorProps {
    formEntity: FormEntity,
    index: number,
    openStates: boolean[],
    toggleCollapse: (index: number) => void,
    updateForm: (formId: string, formEntity: FormEntity) => void,
    deleteForm: (formId: string) => void
}