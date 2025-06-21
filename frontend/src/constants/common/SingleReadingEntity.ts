import ParameterType from "../inputs/forms/ParameterType.ts";

export default interface SingleReadingEntity {
    parameter: string;
    parameterValue: string;
    parameterType: ParameterType;
}