export default interface ParameterAdditiveFormProps {
    parametersSetter: (params: { [key: string]: string }) => void,
    spotId: string;
};