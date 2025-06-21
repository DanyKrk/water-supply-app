import DataPoint from "./DataPoint.ts";

export default interface ChartProps {
    data: DataPoint[];
    dataKey: string;
}
