import type {FC} from "react";
import { useEffect} from "react";
import * as React from "react";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { ChartData} from 'chart.js';
import { ArcElement, BarElement} from 'chart.js';
import {
    CategoryScale,
    Chart as ChartJS, Filler, Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title, Tooltip
} from "chart.js";
import {Alert, Card, CardContent, Grid} from "@mui/material";
import {SuspenseLoaderInline} from "../SuspenseLoader";
import {Bar, Doughnut} from "react-chartjs-2";
import autocolors from "chartjs-plugin-autocolors";
import ChartDataLabels from "chartjs-plugin-datalabels";
import type {ICountStats} from "@dbstats/shared/src/stats";

dayjs.extend(customParseFormat);

type CountStatesChartProps = {
    title: string,
    api: () => Promise<Array< ICountStats >>,
}


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    autocolors,
    Filler,
    ChartDataLabels,
    ArcElement,
    BarElement,
);

function MakeOptions(title: string) {
    return {
        responsive: true,
        plugins: {
            colors: {
                enabled: false
            },
            autocolors: {
                enabled: true,
                mode: 'data',
            },
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: title,
            },
        },
    };
}

export const CountStatsChart: FC<CountStatesChartProps> = ({title, api}) => {

    const [loading, setLoading] = React.useState(true);
    const [stats, setStats] = React.useState(null);
    const [errorMessageLoad, setErrorMessageLoad] = React.useState('');


    function loadStats() {

        const fetchData = async () => {
            setLoading(true);
            const data = await api();
            const byWeekData: ChartData = {
                labels: data.map(item=>item.type),
                datasets: [{data: data.map(item=>item.cnt), label: ''}],
            };
            setStats({data: byWeekData, options: MakeOptions(title)});
            setLoading(false);
        }
        fetchData()
            // make sure to catch any error
            .catch((err) => setErrorMessageLoad(err.message));
    }

    useEffect(loadStats, []);
    useEffect( () => {
        loadStats();
    }, []);
    if (errorMessageLoad) {
        return (
            <Alert severity="error">{errorMessageLoad}</Alert>)
    }
    if (loading) {
        return <SuspenseLoaderInline success={false}></SuspenseLoaderInline>;
    }

    return (
        <Card>
            <CardContent><Bar
                width={10}
                height={5}
                options={stats.options}
                data={stats.data}
            /></CardContent>
        </Card>
    );
}
