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
import Button from '../basic/button/button';
import ScanLotModal from '../../components/basic/modals/scan_lot_modal/scan_lot_modal'
import { ADD_TASK_ALERT_TYPE } from "../../constants/dashboard_constants";
import TaskAddedAlert from "../../components/widgets/widget_pages/dashboards_page/dashboard_screen/task_added_alert/task_added_alert";
// Import hooks
import useWindowSize from '../../hooks/useWindowSize'

// Import actions
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
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)
    const settings = useSelector(state => state.settingsReducer.settings)
    const showScanLotModal = useSelector(state => state.sidebarReducer.showLotScanModal)
    const cards = useSelector(state => state.cardsReducer.cards)

    const deviceEnabled = settings.deviceEnabled

    const dispatchShowLotScanModal = (bool) => dispatch(showLotScanModal(bool))

    const [showDashboards, setShowDashboards] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [locked, setLocked] = useState(null);

    const [barcode, setBarcode] = useState([])
    const [full, setFull] = useState('')
    const [lotNum, setLotNum] = useState('')
    const [showSnoop, setShowSnoop] = useState(null)
    const [addTaskAlert, setAddTaskAlert] = useState(null);
    const [title, setTitle] = useState('Dashboard')

    const CURRENT_SCREEN = (showDashboards) ? SCREENS.DASHBOARDS :
        showSettings ? SCREENS.SETTINGS : SCREENS.LOCATIONS

    useEffect(() => {
        disableBrowserBackButton()

        // displays dashboards page if url is on widget page
        if (stationID) {
            setShowDashboards(true)
            setTitle(stations[stationID]?.name + ' Dashboard')
        }

        // hides dashboards page if url is NOT on widget page
        else {
            setShowDashboards(false)
            setTitle('Dashboards')
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
            let lotId
            const enter = full.substring(full.length-5)
            const enterEnter = full.substring(full.length-10)
            if(enter === 'Enter' && enterEnter!== 'EnterEnter' && full.length>5){
              setBarcode([])
              if(full.includes('-')){
                let arr = full.split ('-')
                lotId = parseInt(arr[1].slice(0,-5))
              }
              else lotId = parseInt(full.slice(0,-5))
                setLotNum(lotId)
                if(!!lotId) onScanLot(lotId)
                setFull('')
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
        if(card.lotNum == id){
          lotFound = true
          Object.values(stations).forEach((station) => {
            if(!!card.bins[station._id]){
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
          setTitle(stations[statId]?.name + ' Dashboard')
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
        const dashboardID = stations[item._id]?.dashboards[0]
        history.push('/locations/' + item._id + '/' + "dashboards/" + dashboardID)
        setShowDashboards(true)
        setTitle(stations[item._id]?.name + ' Dashboard')
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
                                {!locked && !lotID &&
                                  <BounceButton
                                      color={"white"}
                                      onClick={() => {
                                          setShowDashboards(false)
                                          setTitle('Locations')
                                          history.push('/locations')
                                      }}
                                      containerStyle={{
                                          color: "black",
                                          width: "2.5rem",
                                          height: "2.5rem",
                                          top: '0.75rem',
                                            left: '1rem',
                                            position: "absolute"
                                      }}
                                  >

                                      <styled.Icon
                                          className={"fa fa-times"}
                                      />
                                  </BounceButton>
                                }
                                <styled.Title>{stations[stationID].name}</styled.Title>
                              </>
                                :
                                <BounceButton
                                    color={"blue"}
                                    onClick={() => {
                                        setShowSettings(!showSettings)
                                        setTitle('Settings')
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
                                        top: '0.75rem',
                                        left: '1rem',
                                        position: "absolute"
                                    }}
                                >
                                    <styled.Icon
                                        className={!showSettings ? "fa fa-cog" : "fa fa-times"}
                                    />
                                </BounceButton>
                            }


                    <styled.Title schema={CURRENT_SCREEN.schema} style={{ userSelect: "none" }} phoneView = {phoneView}>{!showDashboards && title}</styled.Title>

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
                    render={() => <DashboardsPage onSetTitle={(title) => setTitle(title)}/>}
                />
            }

            {showSettings &&
                <Settings />
            }
        </styled.Container>
    )
}

export default ListView;
