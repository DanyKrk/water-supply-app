export default interface ExpandableFormProps {
    initialParameters?: {[key: string]: string},
    parametersSetter: (params: { [key: string]: string }) => void;
};