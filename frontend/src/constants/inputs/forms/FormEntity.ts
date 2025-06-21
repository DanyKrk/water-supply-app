import Parameter from "./Parameter.ts";

export default interface FormEntity {
    id: string,
    name: string,
    parameters: Parameter[]
}