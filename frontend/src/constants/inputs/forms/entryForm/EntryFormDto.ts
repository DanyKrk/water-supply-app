import Parameter from "../Parameter.ts";

export default interface EntryFormDto {
    parameters: Parameter[];
    spotId: string | undefined;
}