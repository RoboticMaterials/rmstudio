import React, { useEffect, useState, useRef, useContext, memo } from 'react';
import { useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";

// Import Styles
import * as styled from './statistics.style'
import { ThemeContext } from 'styled-components';

// Import Components 
import StationColumns from './station_columns/station_columns'
import Header from '../cards/summary_header/summary_header'
import StatisticsHeader from './statistics_header/statistics_header'

const Statistics = () => {

    let params = useParams()
    const {
        page,
        subpage,
        id
    } = params
    const themeContext = useContext(ThemeContext);

    const processes = useSelector(state => state.processesReducer.processes)

    const [dateIndex, setDateIndex] = useState(0)
    const [timeSpan, setTimeSpan] = useState('day')
    const [showReport, setShowReport] = useState(false)
    const [date, setDate] = useState('')
    const [loading, setLoading] = useState(false)
    const [sortLevel, setSortLevel] = useState('')

    // useEffect(() => {
    //     const newDate = deepCopy(date)

    //     newDate.setDate(date.getDate() + dateIndex)
    // }, [dateIndex])

    /**
     * Gets the new data based on the selected time span and dateIndex
     * 
     * TimeSpan:
     * Can be either Day, Week, Month or Year
     * 
     * DateIndex:
     * The current date (today) index is 0, if you want to go back to the past date, the index would be 1 
     * 
     * @param {*} newTimeSpan 
     * @param {*} newDateIndex 
     */
    const onTimeSpan = async (newTimeSpan, newDateIndex) => {

        setTimeSpan(newTimeSpan)
        setDateIndex(newDateIndex)
        setTimeSpan(newTimeSpan)

    }

    const onSelectSort = async (sort) => {
        console.log('QQQQ sort', sort)
        setSortLevel(sort)
    }

    const renderStationColumns = () => {

        let processesToRender = []

        // If just in process page, push the current process
        if (page === 'processes') {
            processesToRender.push(id)
        }
        // Else push all processes
        else {
            Object.keys(processes).forEach(processId => {
                processesToRender.push(processId)
            });

        }

        return processesToRender.map((processId) => {
            return (
                <StationColumns
                    key={processId}
                    processId={processId}
                    setDateTitle={(title) => setDate(title)}
                    dataLoading={loading => setLoading(loading)}
                    dateIndex={dateIndex}
                    timeSpan={timeSpan}
                    showReport={showReport}
                    sortLevel={sortLevel}
                />
            )
        })
    }

    return (
        <styled.Container>
            <Header
                title={'Statistics Summary'}
            />
            <StatisticsHeader
                themeContext={themeContext}
                loading={loading}
                handleTimeSpan={(timeSpan, index) => {
                    onTimeSpan(timeSpan, index)
                }}
                timeSpan={timeSpan}
                handleSetShowReport={bool => setShowReport(bool)}
                showReport={showReport}
                date={date}
                dateIndex={dateIndex}
                handleSelectSort={onSelectSort}
            />
            <styled.StationColumnsContainer>
                {renderStationColumns()}
            </styled.StationColumnsContainer>
        </styled.Container>
    )


}

export default Statistics