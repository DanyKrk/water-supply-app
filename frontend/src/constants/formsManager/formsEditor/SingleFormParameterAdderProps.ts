import ParameterType from "../../inputs/forms/ParameterType.ts";

export default interface SingleFormParameterAdderProps {
    named: string,
    onAccept: (name: string, type: ParameterType) => void
}