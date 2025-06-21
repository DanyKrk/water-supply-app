export default interface Spot {
    id: string,
    name: string,
    foundationDate: string,
    type: string,
    location: {
        x: number,
        y: number
    },
    description: string,
    selectedFormIds: string[],
    additionalInfo: object
}