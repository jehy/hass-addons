import {
    Card,
    useTheme, Alert, Grid, CardContent, CardHeader, Link
} from '@mui/material';
import * as React from "react";
import apiClient from "../../../apiClient";
import {Helmet} from "react-helmet-async";
import PageTitleWrapper from "../../../components/PageTitleWrapper";
import PageTitle from "../../../components/PageTitle";
import Container from "@mui/material/Container";
import Footer from "../../../components/Footer";
import {CountStatsChart} from "../../../components/Charts/CountStatsChart";
import {AlertSet} from "../../../components/AlertSet/AlertSet";


function DatabaseStats() {
    return (
        <>
            <Helmet>
                <title>Database stats</title>
            </Helmet>
            <PageTitleWrapper>
                <PageTitle
                    heading="Database stats"
                    subHeading="Different database stats"
                />
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                >
                    <Grid item xs={12}>
                        <Card style={{marginTop: 5}}>
                            <CardHeader title="Generic database stats"></CardHeader>
                            <Alert severity="info">If you are unfamilar with HA tables, you can read about them <Link href="https://data.home-assistant.io/docs/data">here</Link></Alert>
                            <AlertSet api={apiClient.system.getDbAlerts}></AlertSet>
                            <CardContent>
                                <Alert severity="info"></Alert>
                                <CountStatsChart api={apiClient.system.getTableRows}
                                                 title="Number of rows in tables"/>
                            </CardContent>

                            <CardContent>
                                <CountStatsChart api={apiClient.system.getTableSize}
                                                 title="Table size in MB"/>
                            </CardContent></Card>
                        <Card style={{marginTop: 5}}>
                            <CardHeader title="Events stats"></CardHeader>
                            <CardContent>
                                <CountStatsChart api={apiClient.events.countEventTypes}
                                                 title="Count event types"/>
                            </CardContent>

                            <CardContent>
                                <CountStatsChart api={apiClient.events.countEventsByDomain}
                                                 title="Count events by domain"/>
                            </CardContent></Card>
                        <Card style={{marginTop: 5}}>
                            <CardHeader title="States stats"></CardHeader>
                            <CardContent>
                                <CountStatsChart api={apiClient.states.countStates}
                                                 title="Count states"/>
                            </CardContent></Card>
                        <Card style={{marginTop: 5}}>
                            <CardHeader title="Attributes stats"></CardHeader>
                            <CardContent>
                                <CountStatsChart api={apiClient.states.countAttributesSize}
                                                 title="Count attributes size, MB"/>
                            </CardContent></Card>
                        <Card style={{marginTop: 5}}>
                            <CardHeader title="Long term stats"></CardHeader>
                            <CardContent>
                                <CountStatsChart api={apiClient.statistic.countLong}
                                                 title="Count long term stats"/>
                            </CardContent></Card>
                        <Card style={{marginTop: 5}}>
                            <CardHeader title="Short term stats"></CardHeader>
                            <CardContent>
                                <CountStatsChart api={apiClient.statistic.countShort}
                                                 title="Count short term stats"/>
                            </CardContent></Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer/>
        </>
    );
}

export default DatabaseStats;
