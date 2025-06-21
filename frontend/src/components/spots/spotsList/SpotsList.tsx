import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {FixedSizeList, ListChildComponentProps} from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import SpotService from "../../../services/spots/SpotService.ts";
import {useNavigate} from "react-router-dom";
import AutoSizer from "react-virtualized-auto-sizer";
import EventBus from "../../../common/EventBus.ts";
import SpotsListElement from "../../../constants/spots/spotsList/SpotsListElement.ts";
import SaveIcon from "@mui/icons-material/Save";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import InfoIcon from "@mui/icons-material/Info";
import "./spotsListIndex.css"

const PAGE_SIZE = 10;

const SpotsList = () => {
    const [spotsCount, setSpotsCount] = React.useState(0);
    SpotService.getSpotsCount().then((response) => setSpotsCount(response.data))
        .catch((error) => {
        if (error.response && error.response.status === 401) {
            EventBus.dispatch("refresh");
            location.reload();
        }
    });

    const data = new Map<number, SpotsListElement>();

    const calculateActualStartIndex = (start: number): number => {
        return Math.floor(start / PAGE_SIZE) * PAGE_SIZE;
    };
    const calculateActualStopIndex = (stop: number): number => {
        if (stop === 0 && spotsCount > 0) {
            return 10;
        }
        return Math.ceil(stop / PAGE_SIZE) * PAGE_SIZE;
    };

    const calculatePageNumber = (start: number, stop: number): number[] => {
        const pages: number[] = [];
        let pageStart: number = start;
        while (pageStart < stop) {
            pages.push(pageStart / PAGE_SIZE);
            pageStart += PAGE_SIZE;
        }
        return pages;
    }

    const isItemLoaded = (index: number): boolean => data.get(index) !== undefined;

    const loadMoreItems = (startIndex: number, stopIndex: number): Promise<void> => {
        const start = calculateActualStartIndex(startIndex);
        const stop = calculateActualStopIndex(stopIndex);
        const pages: number[] = calculatePageNumber(start, stop);

        return new Promise<void>((resolve, reject) => {
            let check = true;
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                SpotService.getSpotsPage(page, PAGE_SIZE).then((response => {
                    for (let inx = 0; inx < response.data.content.length; inx++) {
                        const element = response.data.content[inx];
                        data.set(inx + page * PAGE_SIZE,
                            {
                                spotId: element.id,
                                name: element.name,
                                x: element.location.x,
                                y: element.location.y,
                                address: element.address,
                                description: element.description
                            } as SpotsListElement)
                    }
                })).catch((error) => {
                    if (error.response && error.response.status === 401) {
                        EventBus.dispatch("refresh");
                        location.reload();
                    }
                    check = false
                })
            }
            setTimeout(() => {
                    if (check) {
                        resolve();
                    } else {
                        reject('ERROR');
                    }
                }, 500
            )
        });
    };

    const nav = useNavigate();
    const enterData = (spotId: string | undefined) => {
        if (spotId != undefined) {
            nav(`/forms/${spotId}`);
        }
    };

    const showReadings = (spotId: string | undefined) => {
        if (spotId != undefined) {
            nav(`/table/${spotId}`);
        }
    };

    const showDetails = (spotId: string | undefined) => {
        if (spotId != undefined) {
            nav(`/details/${spotId}`);
        }
    };

    function renderRow(props: ListChildComponentProps) {
        const {index, style} = props;

        let spotId: string | undefined = undefined;
        let label: string | undefined = 'Ładowanie...';
        let address: string | undefined = "";
        let coords: string | undefined = "";
        let description: string | undefined = "";
        if (data !== undefined) {
            const spot = data.get(index)
            if (spot !== undefined) {
                spotId = spot.spotId;
                label = spot.name;
                address = `Adres: ${spot.address}; `;
                coords = "Y = " + spot.y + ", X = " + spot.x;
                description = spot.description;
            }
        }

        const buttons = (
            <Stack direction="column" spacing={2} className="buttons">
                <Button variant="outlined" size={"small"}
                        startIcon={<SaveIcon/>}
                        onClick={() => enterData(spotId)}>
                    Wprowadź dane
                </Button>
                <Button variant="outlined" size={"small"}
                        startIcon={<AutoStoriesIcon/>}
                        onClick={() => showReadings(spotId)}>
                    Odczyty
                </Button>
                <Button variant="outlined" size={"small"}
                        startIcon={<InfoIcon/>}
                        onClick={() => showDetails(spotId)}>
                    Szczegóły
                </Button>
            </Stack>
        );

        return (
            <ListItem
                key={index}
                style={style}
                alignItems="flex-start"
                secondaryAction={buttons}
                divider={true}
                component="div">
                <ListItemText
                    primary={
                        <React.Fragment>
                            <Typography
                                sx={{display: 'block', fontSize: '20px', fontWeight: 'bold'}}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                {label}
                            </Typography>
                        </React.Fragment>
                    }
                    secondary={
                        <Typography noWrap={false}
                                    sx={{
                                        display: 'block',
                                        width: "70%",
                                        wordWrap: "break-word",
                                        overflow: 'hidden',
                                        height: "145px",
                                        fontSize: '15px',
                                        color: 'grey'
                                    }}>
                            {address}{coords}
                            <br/>
                            {description}
                        </Typography>
                    }
                />
            </ListItem>
        );
    }

    return (
        <AutoSizer>
            {({height, width}: { height: number; width: number }) => (
                <InfiniteLoader
                    isItemLoaded={isItemLoaded}
                    itemCount={spotsCount}
                    loadMoreItems={loadMoreItems}
                    minimumBatchSize={10}
                    threshold={10}
                >
                    {({onItemsRendered, ref}: { onItemsRendered: any; ref: any }) => (
                        <FixedSizeList
                            height={height}
                            width={width}
                            itemSize={200}
                            itemCount={spotsCount}
                            onItemsRendered={onItemsRendered}
                            ref={ref}
                        >
                            {renderRow}
                        </FixedSizeList>
                    )}
                </InfiniteLoader>
            )}
        </AutoSizer>
    );
}

export default SpotsList;