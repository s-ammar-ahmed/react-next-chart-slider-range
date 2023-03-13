import React from "react";
import { Grid, TextField } from "@mui/material";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import ChartGraph from "./ChartGraph";
import { MuiHandle, MuiRail, MuiTick, MuiTrack } from "./Components";

interface RangeSliderProps {
    data: any[];
    values?: [number, number];
    tickLabelType: "year" | "monetary" | "number";
    tickLabelConcat?: string;
    showTextFields: Boolean;
    label?: {
        lowerLimit: String;
        upperLimit: String;
    };
    disabled?: boolean;
    noDate: boolean;
    onChange?: Function;
}

interface RangeSliderState {
    domain: any;
    update: any;
    values: any;
    inputValues: any;

    rangeData: any;
    sortedRange: any[];
    datesArray: any[];
    countArray: any[];
}

class RangeSlider extends React.Component<RangeSliderProps, RangeSliderState> {
    constructor(props: RangeSliderProps) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(props, state) {
        const countArray = [];
        const datesArray = [];
        let sortedRange = [];
        if (props.noDate) {
            if (props.tickLabelType === "number") {
                const reducedArray = props.data.map((e) => e.xAxisValue);
                for (let index = 0; index < 101; index = index + 5) {
                    if (props.data[index] && reducedArray.includes(index)) {
                        countArray.push({
                            id: index,
                            xAxisValue: index,
                            yAxisValue: props.data[index].yAxisValue,
                        });
                    } else {
                        countArray.push({
                            id: index,
                            xAxisValue: index,
                            yAxisValue: 0,
                        });
                    }
                    if (
                        countArray.length == 21 &&
                        props.data.filter((e) => e.xAxisValue > 99).map((m) => m.yAxisValue)
                            .length > 0
                    ) {
                        const greaterThan21 = props.data
                            .filter((e) => e.xAxisValue > 99)
                            .map((m) => m.yAxisValue)
                            .reduce((r, t) => r + t);
                        countArray[countArray.length - 1].yAxisValue = greaterThan21;
                    }
                }
                sortedRange = countArray
                    .map((e) => e.xAxisValue)
                    .slice()
                    .sort((a, b) => a - b);
            } else {
                sortedRange = props.data
                    .map((e) => e.xAxisValue)
                    .slice()
                    .sort((a, b) => a - b);
            }
        } else {
            let initialDate = 1970;
            const dateRangeCount = new Date().getFullYear() + 1 - initialDate; // means from 1970 till current year
            for (let index = 0; index < dateRangeCount; index++) {
                const filterFromYear = props.data.filter((e) => e.xAxisValue == initialDate);
                if (filterFromYear && filterFromYear.length > 0) {
                    datesArray.push(filterFromYear[0]);
                } else {
                    datesArray.push({
                        id: initialDate,
                        xAxisValue: initialDate,
                        yAxisValue: 0,
                    });
                }
                initialDate++;
            }
            for (let i = 0; i < datesArray.length; i++) {
                if (datesArray[i].yAxisValue == 0) {
                    datesArray.splice(i, 1);
                    i--;
                }
                if (datesArray.length == 29) {
                    break;
                }
            }
            sortedRange = datesArray
                .map((e) => e.xAxisValue)
                .slice()
                .sort((a, b) => a - b);
        }
        const rangeData = [sortedRange[0], sortedRange[sortedRange.length - 1]];

        return {
            domain: rangeData,
            update: state.update ?? rangeData,
            values: props.values ?? rangeData,
            inputValues: state.rangeData ?? rangeData,
            rangeData: rangeData,
            sortedRange: sortedRange,
            datesArray: datesArray,
            countArray: countArray,
        };
    }

    render() {
        const { domain, values, update, datesArray, countArray, rangeData, sortedRange } =
            this.state;
        return (
            <>
                <div style={{ marginBottom: "40px" }}>
                    {this.props.data && (
                        <>
                            <ChartGraph
                                data={
                                    this.props.noDate
                                        ? this.props.tickLabelType == "number"
                                            ? countArray
                                            : this.props.data
                                        : datesArray
                                }
                                highlight={update}
                                rangeData={sortedRange}
                            />
                            <Slider
                                //disabled={this.props.disabled}
                                mode={2}
                                domain={domain}
                                rootStyle={{
                                    position: "relative",
                                    width: "100%",
                                }}
                                onUpdate={(update) =>
                                    this.setState({ update, inputValues: update })
                                }
                                onChange={(values) => {
                                    console.log("SETTING RANGE SLIDER VALUES", values);
                                    this.setState({ values });
                                    this.props.onChange(values);
                                }}
                                values={values}
                                step={1}
                            >
                                <Rail>
                                    {({ getRailProps }) => <MuiRail getRailProps={getRailProps} />}
                                </Rail>
                                <Handles>
                                    {({ handles, getHandleProps }) => (
                                        <div className={"slider-handles"}>
                                            {handles.map((handle) => (
                                                <MuiHandle
                                                    key={handle.id}
                                                    handle={handle}
                                                    domain={domain}
                                                    getHandleProps={getHandleProps}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </Handles>
                                <Tracks left={false} right={false}>
                                    {({ tracks, getTrackProps }) => (
                                        <div className="slider-tracks">
                                            {tracks.map(({ id, source, target }) => (
                                                <MuiTrack
                                                    key={id}
                                                    source={source}
                                                    target={target}
                                                    getTrackProps={getTrackProps}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </Tracks>
                                <Ticks count={6}>
                                    {({ ticks }) => (
                                        <div className="slider-ticks">
                                            {ticks.map((tick) => (
                                                <MuiTick
                                                    labelConcat={this.props.tickLabelConcat}
                                                    key={tick.id}
                                                    tick={tick}
                                                    count={4}
                                                    dataType={this.props.tickLabelType}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </Ticks>
                                {this.props.showTextFields && (
                                    <Grid container justifyContent="space-between">
                                        <Grid
                                            item
                                            xs={5}
                                            style={{
                                                marginTop: "32px",
                                                maxWidth: "40%",
                                                fontSize: "9px",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            <TextField
                                                variant="outlined"
                                                size="small"
                                                label={this.props.label?.lowerLimit ?? ""}
                                                value={this.state.inputValues[0] ?? ""}
                                                onChange={(evt) => {
                                                    const value = evt.target.value;
                                                    const newState = [value, values[1]];
                                                    this.setState({ inputValues: newState });
                                                    if (value && value >= domain[0]) {
                                                        this.setState({ values: newState });
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={5}
                                            style={{
                                                marginTop: "32px",
                                                maxWidth: "40%",
                                                fontSize: "9px",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            <TextField
                                                variant="outlined"
                                                size="small"
                                                label={this.props.label?.upperLimit ?? ""}
                                                value={this.state.inputValues[1] ?? ""}
                                                onChange={(evt) => {
                                                    const value = evt.target.value;
                                                    const newState = [values[0], value];
                                                    this.setState({ inputValues: newState });
                                                    if (
                                                        value &&
                                                        value <= domain[1] &&
                                                        value >= values[0]
                                                    ) {
                                                        this.setState({ values: newState });
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                )}
                            </Slider>
                        </>
                    )}
                </div>
            </>
        );
    }
}

export { RangeSlider };
