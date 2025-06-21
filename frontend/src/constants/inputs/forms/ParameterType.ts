enum ParameterType {
    TEXT = "TEXT",
    NUMBER = "NUMBER"
}

export const polishParameterTypeNames: Record<ParameterType, string> = {
    [ParameterType.TEXT]: "Tekst",
    [ParameterType.NUMBER]: "Liczba"
};

export default ParameterType;