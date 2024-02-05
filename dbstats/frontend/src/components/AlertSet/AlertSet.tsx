import type {IShowAlerts} from "@dbstats/shared/src/stats";
import type {FC} from "react";
import { useEffect} from "react";
import * as React from "react";
import {Alert, Card, CardContent} from "@mui/material";
import {SuspenseLoaderInline} from "../SuspenseLoader";

type AlertSetProps = {
    api: () => Promise<Array< IShowAlerts >>,
}


export const AlertSet: FC<AlertSetProps> = ({api}) => {

    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState(null);
    const [errorMessageLoad, setErrorMessageLoad] = React.useState('');


    function loadStats() {

        const fetchData = async () => {
            setLoading(true);
            const response = await api();
            setData({response});
            setLoading(false);
        }
        fetchData()
            // make sure to catch any error
            .catch((err) => setErrorMessageLoad(err.message));
    }

    useEffect(loadStats, []);
    useEffect(() => {
        loadStats();
    }, []);
    if (errorMessageLoad) {
        return (
            <Alert severity="error">{errorMessageLoad}</Alert>)
    }
    if (loading) {
        return <SuspenseLoaderInline success={false}></SuspenseLoaderInline>;
    }

    if (!data.length) {
        return null;
    }
    return (
        <Card>
            <CardContent>
                {
                    data.map((el, index) => (<Alert key={index} severity={el.type}>{el.text}</Alert>))
                }
            </CardContent>
        </Card>
    );
}
