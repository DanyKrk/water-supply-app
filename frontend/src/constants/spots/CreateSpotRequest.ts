export default interface CreateSpotRequest {
    name: string;
    foundationDate: Date;
    type: string;
    address: string;
    longitude: number;
    latitude: number;
    description: string;
    additionalInfo: object;
    selectedFormIds: string[]
}