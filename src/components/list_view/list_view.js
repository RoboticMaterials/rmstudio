// import external dependencies
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Route, useHistory, useParams } from 'react-router-dom'
import ClickNHold from 'react-click-n-hold'

// components
import DashboardsPage from "../widgets/widget_pages/dashboards_page/dashboards_page";
import Settings from "../side_bar/content/settings/settings";
import LocationList from './location_list/location_list'
import BounceButton from "../basic/bounce_button/bounce_button";
import ConfirmDeleteModal from '../basic/modals/confirm_delete_modal/confirm_delete_modal'
import ScanLotModal from '../../components/basic/modals/scan_lot_modal/scan_lot_modal'
import { ADD_TASK_ALERT_TYPE } from "../../constants/dashboard_constants";
import TaskAddedAlert from "../../components/widgets/widget_pages/dashboards_page/dashboard_screen/task_added_alert/task_added_alert";
// Import hooks
import useWindowSize from '../../hooks/useWindowSize'

// Import actions
import { postStatus } from '../../redux/actions/status_actions'
import {showLotScanModal} from '../../redux/actions/sidebar_actions'

// Import Utils
import { deepCopy } from '../../methods/utils/utils'

// styles
import * as styled from "./list_view.style"

// import logger
import log from '../../logger.js';

import disableBrowserBackButton from 'disable-browser-back-navigation';

const SCREENS = {
    LOCATIONS: {
        title: "Dashboards",
        schema: "locations"
    },
    SETTINGS: {
        title: "",
        schema: "settings"
    },
    DASHBOARDS: {
        title: "Dashboards",
        schema: "locations"
    },
}

const ListView = (props) => {
    const {

    } = props

    const dispatch = useDispatch()
    const history = useHistory()
    const params = useParams()

    const {
        dashboardID,
        editing,
        lotID,
        stationID,
        warehouse
    } = params

    const size = useWindowSize()
    const windowWidth = size.width
    const widthBreakPoint = 1025
    const phoneView = windowWidth < 500

    const positions = useSelector(state => state.positionsReducer.positions)
    const stations = useSelector(state => state.stationsReducer.stations)
    const devices = useSelector(state => state.devicesReducer.devices)
    const status = useSelector(state => state.statusReducer.status)
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)
    const settings = useSelector(state => state.settingsReducer.settings)
    const showScanLotModal = useSelector(state => state.sidebarReducer.showLotScanModal)
    const cards = useSelector(state => state.cardsReducer.cards)

    const deviceEnabled = settings.deviceEnabled

    const onPostStatus = (status) => dispatch(postStatus(status))
    const dispatchShowLotScanModal = (bool) => dispatch(showLotScanModal(bool))

    const [showDashboards, setShowDashboards] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [locked, setLocked] = useState(null);

    const [barcode, setBarcode] = useState([])
    const [full, setFull] = useState('')
    const [lotNum, setLotNum] = useState('')
    const [showSnoop, setShowSnoop] = useState(null)
    const [addTaskAlert, setAddTaskAlert] = useState(null);

    const CURRENT_SCREEN = (showDashboards) ? SCREENS.DASHBOARDS :
        showSettings ? SCREENS.SETTINGS : SCREENS.LOCATIONS

    const title = CURRENT_SCREEN.title

    let pause_status = ''

    // If there's no status available then set to blank object.
    try {
        pause_status = status?.pause_status;
    } catch (e) {
        pause_status = status?.pause_status;
    }

    // Handles the icon type being displayed based on the pause_status in status
    var playButtonClassName = "fas fa-";
    pause_status ? playButtonClassName += 'play' : playButtonClassName += 'pause';

    useEffect(() => {
        disableBrowserBackButton()

        // displays dashboards page if url is on widget page
        if (stationID) {
            setShowDashboards(true)
        }

        // hides dashboards page if url is NOT on widget page
        else {
            setShowDashboards(false)
        }

    }, [stationID])


    useEffect(() => {
        Object.values(dashboards).forEach((dashboard) => {
            if (dashboard.station === stationID) {
                setLocked(dashboard.locked)
            }
        })
    }, [stationID, dashboards])

    useEffect(() => {
        document.addEventListener('keyup', logKey)
        return () => {
            document.removeEventListener('keyup', logKey)
        }
    }, [])

    useEffect(() => {
      setFull(barcode.join(''))
    }, [barcode])

    useEffect(() => {
      //this is ridiculous but there are different codes for usb transmitter/bluetooth/wired to all need to be included to register different methods
      if(full.includes('RMShift-') || full.includes('ShiftrShiftm-') || full.includes('ShiftRShiftM-') || full.includes('rm-')) {
            const enter = full.substring(full.length-5)
            if(enter === 'Enter'){
                setBarcode([])
                const splitLot = full.split('-')
                let lotId = parseInt(splitLot[1].slice(0,-5))
                setLotNum(lotId)
                onScanLot(lotId)
                setFull('')
            }
        }

    }, [full])

    const logKey = (e) => {
      setBarcode(barcode => [...barcode, e.key])
    }


    const onScanLot = (id) => {

      let binCount = 0
      let statId = ""
      let lotFound = false

      Object.values(cards).forEach((card) => {
        if(card.lotNumber === id){
          lotFound = true
          Object.values(stations).forEach((station) => {
            if(card.station_id === station._id){
              binCount = binCount + 1
              statId = station._id
            }
          })

        if(binCount > 1){
          dispatchShowLotScanModal(true)
        }
        else if(binCount ===1 && !!statId){
          setShowSettings(false)
          history.push(`/locations/${statId}/dashboards/${stations[statId].dashboards[0]}/lots/${card._id}`)
          setShowDashboards(true)
        }
        }
      })

      if(id === 420 && lotFound === false){
        setShowSnoop(true)
        return setTimeout(() => setShowSnoop(null), 2500)
      }

      if(lotFound===false) {
          setAddTaskAlert({
              type: ADD_TASK_ALERT_TYPE.FINISH_FAILURE,
              label: "This lot does not exist!",
          })
          return setTimeout(() => setAddTaskAlert(null), 2500)
        }
    }

    const onLocationClick = (item) => {
        // If the id is in station that its a station, else its the Mir Dashboard
        const dashboardID = !!stations[item._id] ? stations[item._id].dashboards[0] : devices[item._id].dashboards[0]
        history.push('/locations/' + item._id + '/' + "dashboards/" + dashboardID)
        setShowDashboards(true)
    }

    // Handles the play pause button
    const handleTogglePlayPause = async () => {

        //Flip the status to the opposite of the current value when the button is pressed
        var status_clone = deepCopy(status);
        const pause_status = !status_clone.pause_status;

        //Post the status to the API
        await onPostStatus({ pause_status: pause_status });
    }


    const handleTaskQueueStatus = () => {

        // return (
        //     <styled.StatusContainer>
        //         <p>Distance to Station 3 is 30m</p>
        //     </styled.StatusContainer>
        // )
        return Object.values(taskQueue).map((item, ind) => {

            // If the item has an owner that means that task is being executed
            if (!!item.owner) {

                // If the station is a device and the task q owner is that device then show the status
                if (!!devices[stationID] && item.owner === devices[stationID]._id) {

                    let locationName = ''

                    if (!!item.custom_task) {
                        locationName = positions[item.custom_task.position].name
                    }
                    else if (!!item.next_position) {
                        locationName = positions[item.next_position].name
                    }

                    return (
                        <styled.StatusContainer>
                            <p>{`Distance to ${locationName} - ${Math.floor(devices[item.owner].distance_to_next_target)}m`}</p>
                        </styled.StatusContainer>
                    )

                }
            }
        })
    }


    return (
        <styled.Container>

            <ScanLotModal
                isOpen={!!showScanLotModal}
                title={"This lot is split between multiple stations. Please pick a station"}
                id = {lotNum}
                button_1_text={"Yes"}
                button_2_text={"No"}
                handleClose={() => {
                  dispatchShowLotScanModal(null)

                }}

            />
            <TaskAddedAlert
                containerStyle={{
                    'position': 'absolute'
                }}
                {...addTaskAlert}
                visible={!!addTaskAlert}
            />

            {!!showSnoop &&
              <img
               src="https://i.kym-cdn.com/entries/icons/original/000/017/129/rs-10918-snoop-624-1368121236.jpg"
               alt="new"
               />
            }

            <ClickNHold
                time={2}
                onClickNHold={() => {
                    setShowDashboards(false)
                    history.push('/locations')
                }}
            >
                <styled.Header>

                            {(showDashboards) ?
                              <>
                                {!locked &&
                                  <BounceButton
                                      color={"white"}
                                      onClick={() => {
                                          setShowDashboards(false)
                                          history.push('/locations')
                                      }}
                                      containerStyle={{
                                          color: "black",
                                          width: "2.5rem",
                                          height: "2.5rem",
                                          position: "relative"
                                      }}
                                  >

                                      <styled.Icon
                                          className={"fa fa-times"}
                                      />
                                  </BounceButton>
                                }
                              </>
                                :
                                <BounceButton
                                    color={"blue"}
                                    onClick={() => {
                                        setShowSettings(!showSettings)
                                        if (showSettings) {
                                            history.push(`/`)
                                        }
                                        else {
                                            history.push(`/settings`)
                                        }
                                    }}
                                    active={showSettings}
                                    containerStyle={{
                                        background: 'white',
                                        width: "2.5rem",
                                        height: "2.5rem",
                                        position: "relative"
                                    }}
                                >
                                    <styled.Icon
                                        className={!showSettings ? "fa fa-cog" : "fa fa-times"}
                                    />
                                </BounceButton>
                            }


                    <styled.Title schema={CURRENT_SCREEN.schema} style={{ userSelect: "none" }} phoneView = {phoneView}>{title}</styled.Title>
                    {handleTaskQueueStatus()}

                    {!!deviceEnabled &&
                        <styled.PlayButton
                            play={pause_status}
                            windowWidth={windowWidth}
                            widthBreakPoint={widthBreakPoint}
                        >
                            <styled.PlayButtonIcon play={pause_status} className={playButtonClassName} onClick={handleTogglePlayPause}></styled.PlayButtonIcon>
                        </styled.PlayButton>
                    }

                </styled.Header>
            </ClickNHold>

            {(!showDashboards && !showSettings) &&
                <LocationList
                    onLocationClick={onLocationClick}
                />
            }

            {(showDashboards && !showSettings) &&
                // must be wrapped in route to give dashboards page the match params
                <Route
                    path="/locations/:stationID/dashboards/:dashboardID?/:editing?/:lotID?/:warehouseID?"
                    component={DashboardsPage}
                />
            }

            {showSettings &&
                <Settings />
            }
        </styled.Container>
    )
}

export default ListView;
