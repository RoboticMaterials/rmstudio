import React, { Component, useState, useEffect } from 'react';



// import external functions
import { connect, useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom'

// Import components
import DashboardButtonList from "./dashboard_button_list/dashboard_button_list";
import TaskAddedAlert from "./task_added_alert/task_added_alert";
import DashboardTaskQueue from './dashboard_task_queue/dashboard_task_queue'
import DashboardsHeader from "../dashboards_header/dashboards_header";
import ReportModal from "./report_modal/report_modal";
import KickOffModal from "./kick_off_modal/kick_off_modal";
import FinishModal from "./finish_modal/finish_modal";

// constants
import { ADD_TASK_ALERT_TYPE, PAGES } from "../../../../../constants/dashboard_contants";
import { OPERATION_TYPES, TYPES } from "../dashboards_sidebar/dashboards_sidebar";

// Import Utils
import { deepCopy } from '../../../../../methods/utils/utils'

// Import Hooks
import useWindowSize from '../../../../../hooks/useWindowSize'

// Import Actions
import { handlePostTaskQueue, postTaskQueue, putTaskQueue } from '../../../../../redux/actions/task_queue_actions'
import { dashboardOpen, setDashboardKickOffProcesses } from '../../../../../redux/actions/dashboards_actions'
import * as localActions from '../../../../../redux/actions/local_actions'
import { getProcesses } from "../../../../../redux/actions/processes_actions";

// Import styles
import * as pageStyle from '../dashboards_header/dashboards_header.style'
import * as style from './dashboard_screen.style'

// import logging
import log from "../../../../../logger";

const logger = log.getLogger("DashboardsPage");

const widthBreakPoint = 1026;

const DashboardScreen = (props) => {

    const {
        dashboardId,
        showSidebar,
        setEditingDashboard,
    } = props

    // redux state
    const currentDashboard = useSelector(state => { return state.dashboardsReducer.dashboards[dashboardId] })
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const hilResponse = useSelector(state => state.taskQueueReducer.hilResponse)

    //actions
    const dispatchGetProcesses = () => dispatch(getProcesses())

    // self contained state
    const [addTaskAlert, setAddTaskAlert] = useState(null);
    const [reportModal, setReportModal] = useState(null);

    // actions
    const dispatch = useDispatch()
    const onDashboardOpen = (bol) => dispatch(dashboardOpen(bol))
    const onHandlePostTaskQueue = (props) => dispatch(handlePostTaskQueue(props))
    const onHILResponse = (response) => dispatch({ type: 'HIL_RESPONSE', payload: response })
    const onLocalHumanTask = (bol) => dispatch({ type: 'LOCAL_HUMAN_TASK', payload: bol })
    const onPutTaskQueue = async (item, id) => await dispatch(putTaskQueue(item, id))
    const dispatchStopAPICalls = (bool) => dispatch(localActions.stopAPICalls(bool))

    const history = useHistory()
    const params = useParams()

    const stationID = params.stationID
    const dashboardID = params.dashboardID
    const widgetPage = params.widgetPage
    const size = useWindowSize()
    const windowWidth = size.width

    const mobileMode = windowWidth < widthBreakPoint;

    /**
     * When a dashboard screen is loaded, tell redux that its open
     * On unmount tell redux that its not loaded
     *
     * Used in app.js and widget pages to make dashboard screen full size in mobile mode
     */
    useEffect(() => {
        onDashboardOpen(true)
        dispatchGetProcesses()
        return () => {
            onDashboardOpen(false)
        }
    }, [])


    // If current dashboard is undefined, it probably has been deleted. So go back to locations just incase the station has been deleted too
    if (currentDashboard === undefined) {
        history.push(`/locations`)
        return (
            <>
            </>
        )
    }

    /**
     * Handles buttons associated with selected dashboard
     *
     * If it's a AMR device dashboard, add a extra buttons
     * The extra buttons are:
     * 'Send to charge location'
     * 'Send to Idle Location'
     *
     * If there's a human task in the human task Q (see human_task_queue_actions for more details)
     * and if the the tasks unload location is the dashboards station, then show a unload button
     */
    const handleDashboardButtons = () => {
        let { buttons } = currentDashboard	// extract buttons from dashboard
        let taskIds = []    // array of task ids

        // filter out buttons with missing task
        buttons = buttons.filter((currButton) => {
            const {
                task_id,
                type
            } = currButton

            if(task_id && taskIds.includes(task_id)) {
                logger.error(`Button with duplicate task_id found in dashboard. {dashboardId: ${dashboardID}, task_id:${task_id}`)
                return false // don't add duplicate tasks
            }

            // If the button is a custom task, then the task wont exist, so dont remove button
            if (!!currButton.custom_task) return true

            else if (task_id && !(tasks[task_id])) {
                logger.error('Task does not exist! Hiding button from dashboard')
                return false
            }

            taskIds.push(task_id)
            return true
        })

        // if the task q contains a human task that is unloading, show an unload button
        if (Object.values(taskQueue).length > 0) {

            // Map through each item and see if it's showing a station, station Id is matching the current station and a human task
            Object.values(taskQueue).forEach((item, ind) => {
                // If it is matching, add a button the the dashboard for unloading
                if (!!item.hil_station_id && item.hil_station_id === stationID && hilResponse !== item._id && item?.device_type === 'human') {
                    buttons = [
                        ...buttons,
                        {
                            'name': item.hil_message,
                            'color': '#90eaa8',
                            'task_id': 'hil_success',
                            'custom_task': {
                                ...item
                            },
                            'id': `custom_task_charge_${ind}`
                        }
                    ]
                }
            })
        }

        return buttons
    }

    const handleRouteClick = async (Id, name, custom, deviceType) => {

        // If a custom task then add custom task key to task q
        if (Id === 'custom_task') {
            setAddTaskAlert({
                type: ADD_TASK_ALERT_TYPE.TASK_ADDED,
                label: "Task Added to Queue",
                message: name
            })

            // clear alert after timeout
            return setTimeout(() => setAddTaskAlert(null), 1800)
        }

        // Else if its a hil success, execute the HIL success function
        else if (Id === 'hil_success') {
            return handleHilSuccess(custom)
        }

        let inQueue = false
        Object.values(taskQueue).map((item) => {
            // If its in the Q and not a handoff, then alert the user saying its already there
            if (item.task_id === Id && !tasks[item.task_id].handoff) inQueue = true
        })

        // add alert to notify task has been added
        if (inQueue) {
            // display alert notifying user that task is already in queue
            setAddTaskAlert({
                type: ADD_TASK_ALERT_TYPE.TASK_EXISTS,
                label: "Alert! Task Already in Queue",
                message: `'${name}' not added`,
            })

            // clear alert after timeout
            return setTimeout(() => setAddTaskAlert(null), 1800)
        }
        else {
            if (deviceType !== 'human') {
                setAddTaskAlert({
                    type: ADD_TASK_ALERT_TYPE.TASK_ADDED,
                    label: "Task Added to Queue",
                    message: name
                })

                // clear alert after timeout
                return setTimeout(() => setAddTaskAlert(null), 1800)
            }
        }
    }

    /**
     * Handles event of task click
     *
     * Currently there are 3 types of tasks that can be clicked on a dashboard
     *
     * 1) Custom task
     * This task is used to send the cart to a position that does not belong to a station (You cant make a route to a non-station position)
     * It takes in the custom value, which is the position info, and sends the cart to that position from it's current location
     *
     * 2) HIL Success
     * This is a button that shows up on dashboard when a human tasks unload location is the current dashboard
     * Instead of showing a HIL modal, it shows an unload button
     * The reason why is that humans locations are not known so a HIL modal would have to be on the screen the whole time instead of when a autonomous cart arives
     *
     * 3) Basic Routes
     * This is the standard button for a dashboard that just executes the route
     * If the task is already in the q, then show a warning label and dont add it
     *
     *
     * @param {*} Id
     * @param {*} name
     * @param {*} custom
     */
    const handleTaskClick = async (type, Id, name, custom, deviceType) => {
        switch (type.toUpperCase()) {
            case TYPES.ROUTES.key:
                if (!(Id === 'hil_success')) {
                    onHandlePostTaskQueue({ dashboardID, tasks, deviceType, taskQueue, Id, name, custom })
                }
                handleRouteClick(Id, name, custom, deviceType)
                break
            case TYPES.OPERATIONS.key:
                handleOperationClick()
                break
            case OPERATION_TYPES.REPORT.key:
                setReportModal(OPERATION_TYPES.REPORT.key)
                break
            case OPERATION_TYPES.KICK_OFF.key:
                setReportModal(OPERATION_TYPES.KICK_OFF.key)
                break
            case OPERATION_TYPES.FINISH.key:
                setReportModal(OPERATION_TYPES.FINISH.key)
                break
            default:
                break
        }


    }

    const handleOperationClick = () => {
        // setReportModal()
    }

    const handleReportClick = () => {
    }


    // Posts HIL Success to API
    const handleHilSuccess = async (item) => {

        let newItem = {
            ...item,
            hil_response: true,
            // quantity: quantity,
        }

        const ID = deepCopy(item._id)

        delete newItem._id
        delete newItem.dashboard

        // This is used to make the tap of the HIL button respond quickly
        // TODO: This may not be necessary here
        onHILResponse(ID)
        setTimeout(() => onHILResponse(''), 2000)

        await onPutTaskQueue(newItem, ID)

    }

    return (
        <style.Container
        // clear alert
        // convenient to be able to clear the alert instead of having to wait for the timeout to clear it automatically
        // onClick={() => setAddTaskAlert(null)}
        >
            {(reportModal === OPERATION_TYPES.REPORT.key) &&
                <ReportModal
                    isOpen={!!reportModal}
                    title={"Send Report"}
                    close={() => setReportModal(null)}
                    dashboard={currentDashboard}
                    onSubmit={(name, success) => {

                        // set alert
                        setAddTaskAlert({
                            type: success ? ADD_TASK_ALERT_TYPE.REPORT_SEND_SUCCESS : ADD_TASK_ALERT_TYPE.REPORT_SEND_FAILURE,
                            label: success ? "Report Sent" : "Failed to Send Report",
                            message: name ? `"` + name + `"` : null
                        })

                        // clear alert
                        setTimeout(() => setAddTaskAlert(null), 1800)
                    }}
                />
            }

            {(reportModal === OPERATION_TYPES.KICK_OFF.key) &&
                <KickOffModal
                    isOpen={true}
                    stationId={stationID}
                    title={"Kick Off"}
                    close={() => setReportModal(null)}
                    dashboard={currentDashboard}
                    onSubmit={(name, success) => {
                        // set alert
                        setAddTaskAlert({
                            type: success ? ADD_TASK_ALERT_TYPE.KICK_OFF_SUCCESS : ADD_TASK_ALERT_TYPE.KICK_OFF_FAILURE,
                            label: success ? "Lot Kick Off Successful" : "Lot Kick Off Failed",
                            message: name ? `"` + name + `"` : null
                        })

                        // clear alert
                        setTimeout(() => setAddTaskAlert(null), 1800)
                    }}
                />
            }
            {(reportModal === OPERATION_TYPES.FINISH.key) &&
                <FinishModal
                    isOpen={true}
                    stationId={stationID}
                    title={"Finish"}
                    close={() => setReportModal(null)}
                    dashboard={currentDashboard}
                    onSubmit={(name, success) => {
                        // set alert
                        setAddTaskAlert({
                            type: success ? ADD_TASK_ALERT_TYPE.FINISH_SUCCESS : ADD_TASK_ALERT_TYPE.FINISH_FAILURE,
                            label: success ? "Finish Successful" : "Finish Failed",
                            message: name ? `"` + name + `"` : null
                        })

                        // clear alert
                        setTimeout(() => setAddTaskAlert(null), 1800)
                    }}
                />
            }
            <DashboardsHeader
                showTitle={false}
                showBackButton={false}
                showEditButton={true}
                showSidebar={showSidebar}
                page={PAGES.DASHBOARD}
                setEditingDashboard={() => setEditingDashboard(dashboardId)}

                onBack={() => { setEditingDashboard(false) }}
            >
                <pageStyle.Title>{currentDashboard.name}</pageStyle.Title>
            </DashboardsHeader>

            <DashboardButtonList
                buttons={handleDashboardButtons()}
                addedTaskAlert={addTaskAlert}
                onTaskClick={handleTaskClick}
            />

            <TaskAddedAlert
                {...addTaskAlert}
                visible={!!addTaskAlert}
            />

            {mobileMode &&
                <DashboardTaskQueue />
            }

        </style.Container>
    )
}

export default DashboardScreen;
