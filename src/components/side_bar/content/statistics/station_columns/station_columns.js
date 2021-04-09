import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";

// Import Styles
import * as styled from './station_columns.style'

// Import Component
import StationColumn from './station_column/station_column'

// Import Utils
import { getProcessStations } from '../../../../../methods/utils/processes_utils'


const StationColumns = (props) => {

    const {
        processId,
        setDateTitle,
        dateIndex,
        timeSpan,
        showReport
    } = props || {}

    const processes = useSelector(state => state.processesReducer.processes)
    const routes = useSelector(state => state.tasksReducer.tasks)
    const stations = useSelector(state => state.stationsReducer.stations)


    const renderStationColumn = useMemo(() => {
        console.log('QQQQ showReport', showReport)

        const processStations = getProcessStations(processes[processId], routes)
        return Object.keys(processStations).map((stationId) => {
            return (
                <StationColumn
                    key={stationId}
                    dateIndex={dateIndex}
                    timeSpan={timeSpan}
                    stationId={stationId}
                    showReport={showReport}
                    setDateTitle={(title => setDateTitle(title))}
                />
            )
        })

    }, [dateIndex, timeSpan, showReport])

    return (
        <styled.RowContainer>
            <styled.ProcessName>{processes[processId].name}</styled.ProcessName>

            <styled.ChartsContainer>

                {renderStationColumn}
            </styled.ChartsContainer>
        </styled.RowContainer>
    )
}

export default StationColumns