import dayjs from "dayjs";
import type {ICountStats, IShowAlerts} from "@dbstats/shared/src/stats";

import pLimit from 'p-limit';

async function checkResponse(response: Response) {
    if (response.status === 401) {
        throw new Error('Bad login or password')
    }
    if (response.status === 403) {
        throw new Error('Not enough permissions')
    }
    if (![200, 201, 202, 304].includes(response.status)) {
        let errorMessage = `Error status ${response.status} : ${response.statusText}`;
        const responseBody = await response.text();
        if (responseBody) {
            errorMessage += ' - ' + responseBody;
        }
        throw new Error(errorMessage);
    }
}

const getHeaders = () => {
    return {
        'Content-Type': 'application/json',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        // 'Content-Type': 'application/x-www-form-urlencoded',
    };
}

async function countEventTypes(): Promise<Array<ICountStats>> {

    const url = `/addon-api/event/countEventTypes`;
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: getHeaders(),
    });
    await checkResponse(response);
    return response.json();
}

async function countEventsByDomain(): Promise<Array<ICountStats>> {

    const url = `/addon-api/event/countEventsByDomain`;
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: getHeaders(),
    });
    await checkResponse(response);
    return response.json();
}

async function countStates(): Promise<Array<ICountStats>> {

    const url = `/addon-api/state/countStates`;
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: getHeaders(),
    });
    await checkResponse(response);
    return response.json();
}
async function countAttributesSize(): Promise<Array<ICountStats>> {

    const url = `/addon-api/state/countAttributesSize`;
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: getHeaders(),
    });
    await checkResponse(response);
    return response.json();
}
async function countStatisticLong(): Promise<Array<ICountStats>> {

    const url = `/addon-api/statistic/long/count`;
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: getHeaders(),
    });
    await checkResponse(response);
    return response.json();
}

async function countStatisticShort(): Promise<Array<ICountStats>> {

    const url = `/addon-api/statistic/short/count`;
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: getHeaders(),
    });
    await checkResponse(response);
    return response.json();
}

async function getTableRows(): Promise<Array<ICountStats>> {

    const url = `/addon-api/system/getTableRows`;
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: getHeaders(),
    });
    await checkResponse(response);
    return response.json();
}

async function getTableSize(): Promise<Array<ICountStats>> {

    const url = `/addon-api/system/getTableSize`;
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: getHeaders(),
    });
    await checkResponse(response);
    return response.json();
}

async function getDbAlerts(): Promise<Array<IShowAlerts>> {

    const url = `/addon-api/system/gettDbAlerts`;
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: getHeaders(),
    });
    await checkResponse(response);
    return response.json();
}


const limitMe = pLimit(2);
export default {
    events: {
        countEventTypes: ()=>limitMe(countEventTypes),
        countEventsByDomain: ()=>limitMe(countEventsByDomain),
    },
    states: {
        countStates: ()=>limitMe(countStates),
        countAttributesSize: ()=>limitMe(countAttributesSize),
    },
    statistic: {
        countLong: ()=>limitMe(countStatisticLong),
        countShort: ()=>limitMe(countStatisticShort)
    }, system: {
        getTableSize:()=>limitMe(getTableSize),
        getTableRows: ()=>limitMe(getTableRows),
        getDbAlerts: ()=>limitMe(getDbAlerts),
    }
}
