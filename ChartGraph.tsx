import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);

interface GraphRangeProps {
    data: any[];
    highlight: number[];
    rangeData: number[];
    disabled?: boolean;
}

class BarChart extends React.Component<GraphRangeProps> {
    render() {
        const { data, highlight, rangeData } = this.props;
        const sortedData = rangeData.slice().sort((a, b) => a - b);
        const graphLabelValues = data.map((element) => element.xAxisValue);
        const xMaxValue = data
            .map((element) => element.yAxisValue)
            .slice()
            .sort((a, b) => a - b);

        const options = {
            responsive: false,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: false,
                },
                toolbar: {
                    display: false,
                },
            },
            scales: {
                x: { display: false, min: sortedData[0], max: sortedData[sortedData.length - 1] },
                y: {
                    display: false,
                    min: 0,
                    max: xMaxValue[xMaxValue.length - 1],
                    type: "logarithmic",
                },
            },
            parsing: {
                xAxisKey: "xAxisValue",
                yAxisKey: "yAxisValue",
            },
        };
        const barData = {
            labels: graphLabelValues,
            datasets: [
                {
                    backgroundColor: graphLabelValues.map((val) =>
                        val >= highlight[0] && val <= highlight[1] && !this.props.disabled
                            ? "#10239E"
                            : "#ADC6FF"
                    ),
                    data: data,
                },
            ],
        };

        return (
            <Bar
                style={{ width: "100%", height: "42px", marginTop: "20px" }}
                data={barData}
                options={options}
            />
        );
    }
}

export default BarChart;
