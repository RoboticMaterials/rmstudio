import styled from 'styled-components'

export const Container = styled.div`
    flex-grow: 1;
    display: flex;
    position: relative;
    flex-direction: column;
    overflow: hidden;
    max-width: 100%;
`

export const ProcessName = styled.span`
`

export const RoutesListContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    background: pink;
    padding: 1rem 0 1rem 0;
`

// station column
export const RouteName = styled.span`
    background: cyan;
    text-align: center;

`

export const RouteContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    background: blue;
    margin: 0 1rem 0 1rem;
    
`

export const RouteBody = styled.div`
    display: flex;
    flex: 1;
`

export const StationContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
`
