import {
    GET_STATIONS_STARTED,
    GET_STATIONS_SUCCESS,
    GET_STATIONS_FAILURE,

    POST_STATION_STARTED,
    POST_STATION_SUCCESS,
    POST_STATION_FAILURE,

    PUT_STATION_STARTED,
    PUT_STATION_SUCCESS,
    PUT_STATION_FAILURE,

    DELETE_STATION_STARTED,
    DELETE_STATION_SUCCESS,
    DELETE_STATION_FAILURE,

    ADD_STATION,
    UPDATE_STATION,
    UPDATE_STATIONS,
    REMOVE_STATION,
    SET_STATION_ATTRIBUTES,
    SET_SELECTED_STATION,
    EDITING_STATION,
} from '../types/stations_types'

import { deepCopy } from '../../methods/utils/utils';
import uuid from 'uuid';

// Import External Actions
import { deleteTask } from './tasks_actions'
import { deletePosition, putPosition, postPosition } from './positions_actions'
import { deleteDashboard, postDashboard } from './dashboards_actions'

// Import API
import * as api from '../../api/stations_api'

// Import Store
import store from '../store/index'

// get
// ******************************
export const getStations = () => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: GET_STATIONS_STARTED });
        }
        function onSuccess(stations) {
            dispatch({ type: GET_STATIONS_SUCCESS, payload: stations });
            return stations;
        }
        function onError(error) {
            dispatch({ type: GET_STATIONS_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const stations = await api.getStations();

            const normalizedStations = {}
            stations.map((station) => {
                normalizedStations[station._id] = station
            })

            return onSuccess(normalizedStations);
        } catch (error) {
            return onError(error);
        }
    };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// post
// ******************************
export const postStation = (station) => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: POST_STATION_STARTED });
        }
        function onSuccess(station) {
            dispatch({ type: POST_STATION_SUCCESS, payload: station });
            return station;
        }
        function onError(error) {
            dispatch({ type: POST_STATION_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            if (!('_id' in station)) {
                station._id = uuid.v4()
                console.log('QQQQ Added UUID to Station, this shouldnt Happen!!')
                alert('QQQQ Added UUID to Station, this shouldnt Happen!!')
            }

            let stationCopy = deepCopy(station)
            stationCopy = await dispatch(onPostStation(stationCopy))
            delete stationCopy.temp
            delete stationCopy.new
            const newStation = await api.postStation(stationCopy);
            return onSuccess(newStation);
        } catch (error) {
            return onError(error);
        }
    };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// put
// ******************************
export const putStation = (station) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: PUT_STATION_STARTED });
        }
        function onSuccess(station) {
            dispatch({ type: PUT_STATION_SUCCESS, payload: station });
            return station;
        }
        function onError(error) {
            dispatch({ type: PUT_STATION_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            let stationCopy = deepCopy(station)
            stationCopy = await dispatch(onSaveChildren())
            delete stationCopy.temp
            const updateStation = await api.putStation(stationCopy, stationCopy._id);
            return onSuccess(updateStation)
        } catch (error) {
            return onError(error)
        }
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// delete
// ******************************
export const deleteStation = (ID) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: DELETE_STATION_STARTED });
        }
        function onSuccess(id) {
            dispatch({ type: DELETE_STATION_SUCCESS, payload: id });
            return id;
        }
        function onError(error) {
            dispatch({ type: DELETE_STATION_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const station = await dispatch(onDeleteStation(ID))
            const removeStation = await api.deleteStation(station._id);
            return onSuccess(ID)
        } catch (error) {
            return onError(error)
        }
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// get Station Analytics
// ******************************
export const getStationAnalytics = async (id, timeSpan) => {
    try {
        const stationAnalytics = await api.getStationAnalytics(id, timeSpan);
        return stationAnalytics
    } catch (error) {
    }
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const addStation = (station) => {
    return { type: ADD_STATION, payload: station }
}

export const updateStation = (station) => {
    return { type: UPDATE_STATION, payload: station }
}

export const updateStations = (stations, selectedStation, d3) => {
    return { type: UPDATE_STATIONS, payload: { stations, selectedStation, d3 } }
}

export const removeStation = (id) => {
    return { type: REMOVE_STATION, payload: id }
}

export const setStationAttributes = (id, attr) => {
    return { type: SET_STATION_ATTRIBUTES, payload: { id, attr } }
}

export const setSelectedStation = (station) => {
    return { type: SET_SELECTED_STATION, payload: station }
}

export const setEditingStation = (bool) => {
    return { type: EDITING_STATION, payload: bool }
}


const onDeleteStation = (id) => {

    return async dispatch => {

        const stationsState = store.getState().stationsReducer
        const positionsState = store.getState().positionsReducer
        const tasksState = store.getState().tasksReducer

        let station = !!stationsState.selectedStation ? stationsState.selectedStation : stationsState.stations[id]
        console.log('QQQQ deleting station', station)

        // If the station has children, delete them
        if (!!station.children) {

            // TODO: Fix this, in positions, it'll put the station to tell it's deleted, but the station is about to be deleted, so no need to put
            station.children.forEach(async position => {
                console.log('QQQQ Deleting pos', position)

                // Passes in true to tell that the deleted postion's associated station is being deleted too
                // This way, it wont update the station 
                await dispatch(deletePosition(position, true))
            })
        }


        // If the position is new, just remove it from the local station
        // Since the position is new, it does not exist in the backend and there can't be any associated tasks
        if (!!station.new) {
            removeStation(station._id)
            return null
        }

        // Else delete in backend and delete any associated tasks
        else {

            // Delete associated dashboards
            station.dashboards.forEach(async dashboard => {
                await dispatch(deleteDashboard(dashboard))
            })

            // Sees if any tasks are associated with the position and delete them
            const tasks = tasksState.tasks
            Object.values(tasks).filter(task => {
                return task.load.station === station._id || task.unload.station === station._id
            }).forEach(async relevantTask => {
                await dispatch(deleteTask(relevantTask._id))
            })


        }
        return station
    }
}

const onPostStation = (station) => {

    return async dispatch => {

        // Add dashboard
        let defaultDashboard = {
            name: station.name + ' Dashboard',
            buttons: [],
            station: station._id
        }

        //// Now post the dashboard, and on return tie that dashboard to location.dashboards and put the location
        const postDashboardPromise = dispatch(postDashboard(defaultDashboard))
        postDashboardPromise.then(postedDashboard => {
            station.dashboards = [postedDashboard._id.$oid]
        })

        // Save Children
        await dispatch(onSaveChildren())

        return station
    }
}

const onSaveChildren = () => {

    return async dispatch => {
        const positionsState = store.getState().positionsReducer
        const selectedStationChildrenCopy = positionsState.selectedStationChildrenCopy

        // If there children Children Position, save them
        if (!!selectedStationChildrenCopy) {
            Object.values(selectedStationChildrenCopy).map(async (child, ind) => {
                // Post
                if (!!child.new) {
                    console.log('QQQQ Posting', child)
                    await dispatch(postPosition(child))

                }
                // Put
                else {
                    await dispatch(putPosition(child))

                }
            })
        }

        return
    }
}