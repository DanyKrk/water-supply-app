import {useEffect, useState} from "react";
import Chart from "./Chart.tsx";
import TopNavbar from "../../common/topNavbar/TopNavbar.tsx";
import {useNavigate, useParams} from "react-router-dom";
import ReadingService from "../../../services/readings/ReadingService.ts";
import AuthService from "../../../services/users/AuthService.ts";
import "./index.css";
import {useAtom} from "jotai";
import EventBus from "../../../common/EventBus.ts";
import DataPoint from "../../../constants/presentation/charts/DataPoint.ts";
import {getSpotName} from "../../../common/Utils.ts";
import {selectedColumnsAtom} from "../../../common/atoms/TableAtom.ts";
import {DateTimePicker, LocalizationProvider, plPL} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, {Dayjs} from "dayjs";

const ChartsPage = () => {
    const {spotId} = useParams();
    const [selectedColumns] = useAtom(selectedColumnsAtom);
    const [chartData, setChartData] = useState<
        Array<{ key: string; data: DataPoint[] }>
    >([]);
    const [startDateTime, setStartDateTime] = useState<Dayjs | null>(dayjs().subtract(1, 'month'));
    const [endDateTime, setEndDateTime] = useState<Dayjs | null>(dayjs());
    const nav = useNavigate();
    const [spotName, setSpotName] = useState("");

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            nav(`/`);
        }
    }, [nav]);

    useEffect(() => {
        getSpotName(spotId, setSpotName);
    }, [spotName]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const selectedKeys: Array<String> = selectedColumns
                    .map((column) => column.Header)
                    .filter((key) => key !== "timestamp" && key !== "readingId");
                const response = await ReadingService.getSelectedChartKeys(spotId, selectedKeys);
                const keys = response.data;
                const chartDataPromises = keys.map(async (key: string) => {
                    const chartResponse = await ReadingService.getPeriodicChartData(
                        spotId,
                        key,
                        new Date(startDateTime),
                        new Date(endDateTime)
                    );
                    return {
                        key,
                        data: chartResponse.data,
                    };
                });

                const resolvedChartData = await Promise.all(chartDataPromises);
                setChartData(resolvedChartData);
            } catch (error: any) {
                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("refresh");
                    location.reload();
                }
            }
        };
        fetchData();
    }, [spotId, startDateTime, endDateTime]);

    return (
        <div>
            <TopNavbar/>
            <h1 className={"top-space"}>Wykresy odczytów z punktu pomiarowego {spotName}</h1>
            <LocalizationProvider dateAdapter={AdapterDayjs}
                                  localeText={plPL.components.MuiLocalizationProvider.defaultProps.localeText}>
                <DateTimePicker label="Od" className="w-25 mt-4 mb-4 mx-2"
                                defaultValue={startDateTime}
                                ampm={false}
                                format="DD/MM/YYYY HH:mm"
                                onChange={
                                    (date) => {
                                        if (date === null) return;
                                        setStartDateTime(date)
                                    }
                                }/>
                <DateTimePicker label="Do" className="w-25 mt-4 mb-4 mx-2"
                                defaultValue={endDateTime}
                                ampm={false}
                                format="DD/MM/YYYY HH:mm"
                                onChange={
                                    (date) => {
                                        if (date === null) return;
                                        setEndDateTime(date)
                                    }
                                }/>
            </LocalizationProvider>
            {chartData.map((chartItem) => (
                <div key={chartItem.key}>
                    <h1>{chartItem.key}</h1>
                    <Chart data={chartItem.data} dataKey={chartItem.key} />
                </div>
            ))}
        </div>
    );
};

export default ChartsPage;
