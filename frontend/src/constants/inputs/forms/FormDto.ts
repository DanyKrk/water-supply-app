import Parameter from "./Parameter.ts";

export default interface FormDto {
    name: string,
    parameters: Parameter[]
}