export default interface SpotEditorEntry {
    name: string,
    foundationDate: Date,
    type: string,
    address: string,
    longitude: number,
    latitude: number,
    description: string,
    additionalInfo: { [key: string]: string }
    selectedFormIds: string[]
}