import React, { Fragment } from "react";
import { Typography } from "@mui/material";
import { GetRailProps, GetHandleProps, GetTrackProps, SliderItem } from "react-compound-slider";

// Based on Material Design spec:
const trackHeight = 2;
const thumbHeight = 16;
export type MuiClasses = { [key: string]: string };

// *******************************************************
// RAIL COMPONENT
// *******************************************************

interface RailComponentProps {
    getRailProps: GetRailProps;
}

export const MuiRailComponent: React.FC<RailComponentProps> = ({ getRailProps }) => (
    <Fragment>
        <div
            style={{
                height: thumbHeight * 2,
                top: thumbHeight * -1,
                position: "absolute",
                cursor: "pointer",
            }}
            {...getRailProps()}
        />
        <div
            style={{
                backgroundColor: "#636B75",
                width: "100%",
                height: trackHeight,
                position: "absolute",
                pointerEvents: "none",
            }}
        />
    </Fragment>
);

export const MuiRail = MuiRailComponent;

// *******************************************************
// HANDLE COMPONENT
// *******************************************************

interface HandleComponentProps {
    domain: number[];
    handle: SliderItem;
    getHandleProps: GetHandleProps;
    disabled?: boolean;
    activeHandleID?: string;
}

export const MuiHandleComponent: React.FC<HandleComponentProps> = ({
    domain: [min, max],
    handle: { id, value, percent },
    getHandleProps,
}) => (
    <div
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        style={{
            left: `${percent}%`,
            backgroundColor: "#030852",
            marginLeft: thumbHeight * -0.5,
            marginTop: thumbHeight * -0.5,
            width: thumbHeight,
            height: thumbHeight,
            border: "1px solid white",
            borderRadius: "50%",
            whiteSpace: "nowrap",
            position: "absolute",
            zIndex: 2,
            cursor: "pointer",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        }}
        {...getHandleProps(id)}
    />
);

export const MuiHandle = MuiHandleComponent;

// *******************************************************
// TRACK COMPONENT
// *******************************************************

interface TrackComponentProps {
    source: SliderItem;
    target: SliderItem;
    getTrackProps: GetTrackProps;
    disabled?: boolean;
}

export const MuiTrackComponent: React.FC<TrackComponentProps> = ({
    source,
    target,
    getTrackProps,
}) => (
    <Fragment>
        <div
            style={{
                backgroundColor: "#222",
                height: trackHeight,
                position: "absolute",
                zIndex: 1,
                pointerEvents: "none",
                left: `${source.percent}%`,
                width: `${target.percent - source.percent}%`,
            }}
        />
        <div
            style={{
                left: `${source.percent}%`,
                height: thumbHeight,
                top: thumbHeight * -0.5,
                position: "absolute",
                cursor: "pointer",
                width: `${target.percent - source.percent}%`,
            }}
            {...getTrackProps()}
        />
    </Fragment>
);

export const MuiTrack = MuiTrackComponent;

// *******************************************************
// TICK COMPONENT
// *******************************************************

interface TickComponentProps {
    tick: SliderItem;
    count: number;
    labelConcat?: string;
    format?: (val: number, labelVal?: string) => string;
    dataType?: string;
}

function abbrNum(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10, decPlaces);

    // Enumerate number abbreviations
    var abbrev = ["k", "m", "b", "t"];

    // Go through the array backwards, so we do the largest first
    for (var i = abbrev.length - 1; i >= 0; i--) {
        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10, (i + 1) * 3);

        // If the number is bigger or equal do the abbreviation
        if (size <= number) {
            // Here, we multiply by decPlaces, round, and then divide by decPlaces.
            // This gives us nice rounding to a particular decimal place.
            number = Math.round((number * decPlaces) / size) / decPlaces;

            // Add the letter for the abbreviation
            number += abbrev[i].toUpperCase();

            // We are done... stop
            break;
        }
    }

    return number;
}

export const MuiTickComponent: React.FC<TickComponentProps> = ({
    tick,
    count,
    format = (d, s?, dataType?) => {
        let x = "";
        if (dataType === "monetary") {
            d = abbrNum(d, 0);
        }
        if (abbrNum(d, 0) == "1M" || abbrNum(d, 0) == "10M" || abbrNum(d, 0) == "100") {
            x = "+";
        }
        return s + d + x;
    },
    labelConcat,
    dataType,
}) => (
    <div>
        <div
            style={{
                left: `${tick.percent}%`,
                position: "absolute",
            }}
        />
        <Typography
            variant="caption"
            style={{
                marginLeft: `${-(100 / count) / 2}%`,
                width: `${100 / count}%`,
                left: `${tick.percent}%`,
                position: "absolute",
                marginTop: 12,
                textAlign: "center",
            }}
        >
            {format(tick.value, labelConcat ? labelConcat : "", dataType ? dataType : "")}{" "}
            {/* To concatinate the label value as previously explained. if the slider labels are money then whatever the currency sign will go into the labelConcat */}
        </Typography>
    </div>
);

export const MuiTick = MuiTickComponent;
