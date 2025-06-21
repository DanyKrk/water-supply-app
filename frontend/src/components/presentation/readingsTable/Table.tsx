import React, {useEffect, useState} from "react";
import {usePagination, useTable} from "react-table";
import ReadingService from "../../../services/readings/ReadingService.ts";
import type {PaginationProps} from "antd";
import {Checkbox, Pagination} from "antd";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import Button from "../../common/button/Button.tsx";
import {useNavigate, useParams} from "react-router-dom";
import TopNavbar from "../../common/topNavbar/TopNavbar.tsx";
import {Fab, SwipeableDrawer} from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useAtom } from 'jotai';
import EventBus from "../../../common/EventBus.ts";
import AuthService from "../../../services/users/AuthService.ts";
import {getSpotName} from "../../../common/Utils.ts";
import ReadingsTableData from "../../../constants/presentation/readingsTable/ReadingsTableData.ts";
import {selectedColumnsAtom} from "../../../common/atoms/TableAtom.ts";

const TableComponent = () => {
    const {spotId} = useParams();
    const [spotName, setSpotName] = React.useState("");
    const [readings, setReadings] = React.useState([]);
    const [columns, setColumns] = React.useState([
        {Header: "timestamp", accessor: "timestamp"},
    ]);
    const [selectedColumns, setSelectedColumns] = useAtom(selectedColumnsAtom);
    const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
    const [pageCount, setPageCount] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);
    const [total, setTotal] = React.useState(0);
    const nav = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            nav(`/`);
        } else {
            setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
        }
    }, [nav]);

    const onPagingChange: PaginationProps["onChange"] = (current, pageSize) => {
        setPageCount(current - 1);
        setPageSize(pageSize);
    };

    const handleCheckboxChange = (
        event: CheckboxChangeEvent,
        column: { Header: string; accessor: string }
    ) => {
        const {checked} = event.target as HTMLInputElement;
        if (checked) {
            setSelectedColumns(
                columns.filter(
                    (col) =>
                        col.Header === column.Header ||
                        selectedColumns.includes(col)
                )
            );
        } else {
            setSelectedColumns(
                selectedColumns.filter(
                    (selectedColumn) => selectedColumn.Header !== column.Header
                )
            );
        }
    };

    function parseDate(date: string) {
        return date.replaceAll(", ", "\n");
    }

    const getReadings = async () => {
        await ReadingService.getAllReadings(spotId, pageCount, pageSize).then(
            (response) => {
                setTotal(response.data.totalElements);
                const data = response.data.content.map((item: any) => {
                    const data: any = {
                        timestamp: new Date(item.timestamp).toLocaleString(),
                        readingId: item.id,
                    };
                    item.readings.forEach((reading: any) => {
                        data[reading.parameter] = reading.parameterValue;
                    });
                    return data;
                });
                setReadings(data);
                const allKeys: string[] = data.reduce(
                    (keys: string[], obj: any) => {
                        let newKeys = keys;
                        Object.keys(obj).forEach((key) => {
                            if (!newKeys.includes(key)) {
                                newKeys = [...newKeys, key];
                            }
                        });
                        return newKeys;
                    },
                    []
                );
                const columns = allKeys.map((key) => {
                    return {
                        Header: key,
                        accessor: (row) => row[key],
                    };
                });
                setColumns(columns);
                setSelectedColumns(columns);
            }
        ).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            }
        });
    };

    function navigateToDetails(id: ReadingsTableData) {
        if (showAdminBoard) {
            nav(`/readingDetails/${spotId}/${id}`);
        }
    }

    function navigateToCharts() {
        nav(`/chartsPage/${spotId}`);
    }

    React.useEffect(() => {
        getReadings();
    }, [pageCount, pageSize]);

    React.useEffect(() => {
        getSpotName(spotId, setSpotName);
    }, [spotName]);

    const data: ReadingsTableData[] = readings;
    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} =
        useTable(
            {
                columns: selectedColumns,
                data,
                initialState: {hiddenColumns: ["readingId"]},
            },
            usePagination
        );

    const [sidebarOpen, setSidebarOpen] = React.useState(false);


    const toggleDrawer = (open: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }

            setSidebarOpen(open);
        };

    const handleSelectAll = () => {
        const allColumns = columns.filter((column) => column.Header !== "timestamp" && column.Header !== "readingId");
        const allSelected = allColumns.every((column) => selectedColumns.includes(column));
        if (allSelected) {
            setSelectedColumns(columns.filter((column) => column.Header === "timestamp"));
        } else {
            setSelectedColumns(columns);
        }
    };

    return (
        <div>
            <TopNavbar/>
            <h1 className="mt-5 mb-5">Odczyty z punktu pomiarowego {spotName}</h1>
            <div className="row mb-xxl-5 pb-xxl-5">
                <SwipeableDrawer
                    anchor={'left'}
                    open={sidebarOpen}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                    style={{ zIndex: 9999 }}>
                    <div className="sidebar col-auto p-1 m-1 text-center">
                        <Button onClick={handleSelectAll}>
                            {selectedColumns.length === columns.length ? "Odznacz wszystkie" : "Zaznacz wszystkie"}
                        </Button>
                        {columns.map((column) => {
                            if (column.Header === "timestamp" || column.Header === "readingId") {
                                return null;
                            }
                            return (
                                <div key={column.Header} className="form-check text-start">
                                    <Checkbox
                                        type="checkbox"
                                        id={column.Header}
                                        checked={selectedColumns.includes(column)}
                                        onChange={(event) =>
                                            handleCheckboxChange(event, column)
                                        }
                                    />
                                    <label htmlFor={column.Header} className="form-check-label ms-2">
                                        {column.Header}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </SwipeableDrawer>
                <div className="col-auto position-fixed bottom-0 start-0 mb-5 ms-2 d-flex flex-column">
                    <Fab color="primary" variant="extended" className="p-2 mb-2" onClick={() => setSidebarOpen(true)}>
                        <FilterAltIcon className="m-1"/>
                        <p className="m-1">Wybierz kolumny</p>
                    </Fab>
                    <Fab color="primary" variant="extended" onClick={() => navigateToCharts()}>
                        <ShowChartIcon className="m-1"/>
                        Analizuj wykresy
                    </Fab>
                </div>
                <div className="frame border col table-responsive overflow-visible p-0">
                    {/*<div className="frame border col table-responsive overflow-scroll p-0">*/} {/*TODO decide which version is better*/}
                    <table
                        className="table table-bordered table-hover"
                        {...getTableProps()}
                    >
                        <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>
                                        {column.id === "timestamp" ? "Data i czas" : column.render("Header")}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr onClick={() => navigateToDetails(row.original.readingId)} {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()}>
                                            {cell.column.id === "timestamp" ? parseDate(cell.value) :
                                                cell.render("Cell")
                                            }
                                        </td>
                                    ))}
                                    {showAdminBoard &&
                                        <td>
                                            <Button
                                                onClick={() =>
                                                    navigateToDetails(
                                                        row.original.readingId
                                                    )
                                                }
                                            >
                                                Szczegóły
                                            </Button>
                                        </td>
                                    }
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
                <div className="h-100"><br/><br/><br/><br/><br/></div>
                {/* FIXME do it better */}
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
        </div>
    );
};

export default TableComponent;
