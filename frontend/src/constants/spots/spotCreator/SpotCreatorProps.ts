export default interface SpotCreatorProps {
    location?: {
        lat: number,
        lng: number
    },
    view?: "map" | "list",
    onAdd?: () => void
}