import HistoryService from "../../services/history/HistoryService.ts";
import React from "react";
import HistoryEvent, {HistoryEventType, HistoryEventTypeNames} from "../../constants/history/HistoryEvent.ts";
import Table from "react-bootstrap/Table";
import Button from "@mui/material/Button";
import {Dialog, Paper, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {Pagination, PaginationProps} from "antd";
import TopNavbar from "../common/topNavbar/TopNavbar.tsx";
import SingleReadingEntity from "../../constants/common/SingleReadingEntity.ts";


const HistoryPage = () => {

    const [history, setHistory] = React.useState([] as HistoryEvent[]);
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const [currentHistoryEvent, setCurrentHistoryEvent] = React.useState({} as HistoryEvent);
    const [pageCount, setPageCount] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);
    const [total, setTotal] = React.useState(0);


    const handlePopoverOpen = (historyEvent: HistoryEvent) => {
        setCurrentHistoryEvent(historyEvent);
        setPopoverOpen(true);
    }

    const getHistory = async () => {
        await HistoryService.getHistory(pageCount, pageSize).then((response) => {
            setTotal(response.data.totalElements);
            setHistory(response.data.content);
        })
    }

    React.useEffect(() => {
        getHistory();
    }, [pageCount, pageSize]);

    const onPagingChange: PaginationProps["onChange"] = (current, pageSize) => {
        setPageCount(current - 1);
        setPageSize(pageSize);
    };

    function details(event: HistoryEvent) {
        if (!event.metadata) {
            return (
                <div>
                    {HistoryEventTypeNames[event.type]}
                </div>
            )
        }
        const data = JSON.parse(JSON.stringify(event.metadata));
        switch (event.type) {
            case HistoryEventType.ADD_READING: {
                const entities: SingleReadingEntity[] = JSON.parse(data.entities);
                return (
                    <div>
                        <Table className="mb-0">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{fontWeight: "bold"}}>Parametr</TableCell>
                                    <TableCell style={{fontWeight: "bold"}} align="right">Wartość</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {entities.map((entity: SingleReadingEntity) => {
                                    return (
                                        <TableRow>
                                            <TableCell style={{width: "75%"}}>{entity.parameter}</TableCell>
                                            <TableCell align="right"
                                                       style={{width: "25%"}}>{entity.parameterValue ? entity.parameterValue : "-"}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )
            }
            case HistoryEventType.UPDATE_READING: {
                const updatedEntities: SingleReadingEntity[] = JSON.parse(data.updatedEntities);
                const oldEntities: SingleReadingEntity[] = JSON.parse(data.entities);
                const originalDateTime = data.originalDateTime.replaceAll("\"", "");
                return (
                    <div>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell align="center">Przed</TableCell>
                                    <TableCell align="center">Po</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {updatedEntities.map((entity: SingleReadingEntity, index) => {
                                    return (
                                        <TableRow key={index.toString()}>
                                            <TableCell style={{width: "70%"}}>{entity.parameter}</TableCell>
                                            {oldEntities[index].parameter === entity.parameter
                                            && oldEntities[index].parameterValue !== entity.parameterValue
                                                ? (
                                                    <>
                                                        <TableCell
                                                            style={{width: "15%", fontWeight: "bold", color: "red"}}
                                                            align="center">
                                                            {oldEntities[index].parameterValue ? oldEntities[index].parameterValue : "-"}
                                                        </TableCell>
                                                        <TableCell
                                                            style={{width: "15%", fontWeight: "bold", color: "green"}}
                                                            align="center">
                                                            {entity.parameterValue ? entity.parameterValue : "-"}
                                                        </TableCell>
                                                    </>
                                                ) : (
                                                    <>
                                                        <TableCell style={{width: "15%"}} align="center">
                                                            {oldEntities[index].parameterValue ? oldEntities[index].parameterValue : "-"}
                                                        </TableCell>
                                                        <TableCell style={{width: "15%"}} align="center">
                                                            {entity.parameterValue ? entity.parameterValue : "-"}
                                                        </TableCell>
                                                    </>
                                                )}
                                        </TableRow>
                                    )
                                })}
                                <TableRow>
                                    <TableCell/>
                                    <TableCell/>
                                    <TableCell/>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Data wykonania oryginalnego odczytu</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align="center">{parseDate(originalDateTime.toString())}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                )
            }
            case HistoryEventType.DELETE_READING: {
                const oldEntities: SingleReadingEntity[] = JSON.parse(data.entities);
                const originalDateTime = data.originalDateTime.replaceAll("\"", "");
                return (
                    <div>
                        <Table className="mb-0">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{fontWeight: "bold"}}>Parametr</TableCell>
                                    <TableCell style={{fontWeight: "bold"}} align="right">Wartość</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {oldEntities.map((entity: SingleReadingEntity) => {
                                    return (
                                        <TableRow>
                                            <TableCell style={{width: "75%"}}>{entity.parameter}</TableCell>
                                            <TableCell align="right"
                                                       style={{width: "25%"}}>{entity.parameterValue ? entity.parameterValue : "-"}</TableCell>
                                        </TableRow>
                                    )
                                })}
                                <TableRow>
                                    <TableCell/>
                                    <TableCell/>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Data wykonania odczytu</TableCell>
                                    <TableCell align="center">{parseDate(originalDateTime.toString())}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                )
            }
            case HistoryEventType.UPLOAD_READINGS:
                return (
                    <div className="m-5">
                        Dodano wiele odczytów z pliku
                    </div>
                )
            default:
                return (
                    <div className="m-5">
                        Zdarzenie innego typu
                    </div>
                )
        }
    }
    function parseDate(date: string) {
        return date.replaceAll("-", "\u2011").replace("T", "\n").substring(0, date.indexOf("."));
    }

    return (
        <div>
            <TopNavbar/>
            <h1 className="bottom-space">Historia edycji</h1>
            <Dialog style={{top: "75px"}} open={popoverOpen} onClose={() => {
                setPopoverOpen(false);
                setCurrentHistoryEvent({} as HistoryEvent);
            }}>
                <Paper className="pb-1 pe-1">
                    {details(currentHistoryEvent)}
                </Paper>
            </Dialog>
            <Table responsive="sm">
                <thead>
                <tr>
                    <th>Data i czas</th>
                    <th>Akcja</th>
                    <th>Użytkownik</th>
                    <th>Punkt pomiarowy</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {history.map((event: HistoryEvent) => {
                    return (
                        <tr key={event.id}>
                            <td>{new Date(event.timestamp).toLocaleString()}</td>
                            {event.type in HistoryEventTypeNames ? (
                                <td>{HistoryEventTypeNames[event.type]}</td>
                            ) : (
                                <td>{HistoryEventTypeNames[HistoryEventType.OTHER]}</td>
                            )}
                            <td>{event.userName}</td>
                            <td>
                                {JSON.parse(JSON.stringify(event.metadata)).spotName ? (
                                    <div>
                                        {JSON.parse(JSON.stringify(event.metadata)).spotName.replaceAll("\"", "")}
                                    </div>
                                ) : (
                                    <div>
                                        -
                                    </div>
                                )}
                            </td>
                            <td>
                                <Button onClick={() => handlePopoverOpen(event)}>
                                    Szczegóły
                                </Button>
                            </td>
                        </tr>
                    )}
                )}
                </tbody>
            </Table>
            <footer className="footer fixed-bottom">
                <Pagination
                    className="pagination justify-content-center bg-light bg-opacity-50"
                    showSizeChanger
                    pageSizeOptions={["10", "15", "20", "50"]}
                    onChange={onPagingChange}
                    defaultCurrent={1}
                    total={total}
                />
            </footer>
        </div>
    )
}

export default HistoryPage