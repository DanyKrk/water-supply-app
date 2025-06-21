export default interface FormFieldProps {
    fieldName: string;
    updateInputValueInForm: (value: string) => void;
    placeholder?: string;
    initialValue?: string;
}
