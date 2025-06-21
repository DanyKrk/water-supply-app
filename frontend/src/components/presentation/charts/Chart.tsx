import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {formatTimestamp} from "../../../common/Utils.ts";
import ChartProps from "../../../constants/presentation/charts/ChartProps.ts";


const Chart: React.FC<ChartProps> = ({ data, dataKey }) => {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            const formattedTimestamp = formatTimestamp(dataPoint.timestamp);
            return (
                <div className="custom-tooltip">
                    <p>{formattedTimestamp}</p>
                    <p>{`${dataKey}: ${dataPoint["value"]}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart width={400} height={300} data={data}>
                <XAxis
                    dataKey="timestamp"
                    tickFormatter={formatTimestamp}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    scale="time"
                    domain={["dataMin", "dataMax"]}
                    type="number"
                />
                <YAxis />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    payload={[
                        { value: dataKey, type: "line", color: "#8884d8" },
                    ]}
                />
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    connectNulls={true}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default Chart;
