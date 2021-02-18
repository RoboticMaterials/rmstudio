import axios from 'axios';
import * as log from 'loglevel';

import { apiIPAddress } from '../settings/settings'

//import store from '../redux/store'
const token = '123456' //store.getState().cognotoUserSession

const operator = 'stations'

const logger = log.getLogger('Stations_Api', "Station");

export async function getStations() {
    try {
        const response = await axios({
            method: 'GET',
            url: apiIPAddress() + operator,
            headers: {
                'X-API-Key': '123456'
            }
        });
        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {

        // Error 😨
        if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            log.debug('error.response.data', error.response.data);
            log.debug('error.response.status', error.response.status);
            log.debug('error.response.headers', error.response.headers);
        } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            log.debug('error.request', error.request);
        } else {
            // Something happened in setting up the request and triggered an Error
            log.debug('error.message', error.message);
        }
        throw error
    }


}

export async function deleteStation(ID) {
    try {
        const response = await axios({
            method: 'DELETE',
            url: apiIPAddress() + operator + '/' + ID,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-Key': '123456'
            },
        });

        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)

        console.log(dataJson)

        return dataJson

    } catch (error) {

        // Error 😨
        if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            log.debug('error.response.data', error.response.data);
            log.debug('error.response.status', error.response.status);
            log.debug('error.response.headers', error.response.headers);
        } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            log.debug('error.request', error.request);
        } else {
            // Something happened in setting up the request and triggered an Error
            log.debug('error.message', error.message);
        }
        log.debug('error', error);
    }
}


export async function postStation(station) {
    try {
        const response = await axios({
            method: 'POST',
            url: apiIPAddress() + operator,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-Key': '123456'
            },
            data: JSON.stringify(station)
        });

        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)

        return dataJson;


    } catch (error) {

        // Error 😨
        if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            log.debug('error.response.data', error.response.data);
            log.debug('error.response.status', error.response.status);
            log.debug('error.response.headers', error.response.headers);
        } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            log.debug('error.request', error.request);
        } else {
            // Something happened in setting up the request and triggered an Error
            log.debug('error.message', error.message);
        }
        log.debug('error', error);
    }
}

export async function putStation(station, ID) {

    try {
        const response = await axios({
            method: 'PUT',
            url: apiIPAddress() + operator + '/' + ID,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/html',
                'X-API-Key': '123456'
            },
            data: station
        });

        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)

        return dataJson;


    } catch (error) {

        // Error 😨
        if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            log.debug('error.response.data', error.response.data);
            log.debug('error.response.status', error.response.status);
            log.debug('error.response.headers', error.response.headers);
        } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            log.debug('error.request', error.request);
        } else {
            // Something happened in setting up the request and triggered an Error
            log.debug('error.message', error.message);
        }
        log.debug('error', error);
    }
}

export async function getStationAnalytics(id, timeSpan) {
    try {
        const response = await axios({
            method: 'PUT',
            url: apiIPAddress() + operator + '/' + id + '/analysis',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/html',
                'X-API-Key': '123456'
            },
            // A timespan is {time_span: 'day', index: 0}
            data: timeSpan
        });
        // Success 🎉
        const data = response.data;
        const dataJson = JSON.parse(data)
        return dataJson;


    } catch (error) {
        // Error 😨
        if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            log.debug('error.response.data', error.response.data);
            log.debug('error.response.status', error.response.status);
            log.debug('error.response.headers', error.response.headers);
        } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            log.debug('error.request', error.request);
        } else {
            // Something happened in setting up the request and triggered an Error
            log.debug('error.message', error.message);
        }
        throw error
    }


}