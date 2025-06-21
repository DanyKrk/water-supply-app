import ParameterType from "../../inputs/forms/ParameterType.ts";

export default interface SingleFormParameterEditorProps {
    named: string,
    parameter: {name: string, type: string},
    onChangeName: (value: string) => void,
    onChangeType: (value: ParameterType) => void,
    onRemove: () => void
}