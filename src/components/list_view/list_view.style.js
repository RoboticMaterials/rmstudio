import styled from 'styled-components'
import * as stylesh from '../../containers/status_header/status_header.style'
import {LightenDarkenColor} from "../../methods/utils/color_utils";

export const Container = styled.div`
    background: ${props => props.theme.bg.tertiary};
    display: flex;
    flex: 1;
    flex-direction: column;
    max-height: 100%;
    
    // padding-top: 4rem;
`

export const Icon = styled.i`
	padding: 0;
	margin: 0;
	font-size: 1.5rem;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
`


export const Header = styled.div`
	background: ${props => props.theme.bg.secondary};
	width: 100%;
	padding: 1rem;
	align-items: center;
	display: flex;
    // box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.3);
`

export const Title = styled.span`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz1};
    font-weight: 500;
    color: ${props => props.theme.schema[props.schema].solid};
`

export const ListScrollContainer = styled.ul`
    padding: 0;
    margin: 0;
    overflow-y: scroll;
    flex: 1;
    padding: 1rem;
    
`
export const ListItem = styled.div`
    display: flex;
    align-items: center;
    width: auto;
    height: 4rem;
    background: transparent;
    margin-bottom: 1rem;
    
`

export const ListItemRect = styled.div`
    height: 100%;
    width: 100%;
    align-items: center;
    display: flex;

    border-radius: 0.5rem;
    text-align: center;

    cursor: pointer;
    user-select: none;
    box-sizing: border-box;

    background-color: ${props => props.theme.bg.primary};
    box-shadow: ${props => props.theme.cardShadow};

    &:hover {
        background: ${props => LightenDarkenColor(props.theme.bg.primary, -10)};
    }

`

export const ListItemTitle = styled.div`
    height: 2rem;
    line-height: 2rem;
    box-sizing: border-box;
    width: 100%;
    margin-top: -0.1rem;
    padding-left: 1rem;
    padding-right: 1rem;

    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz4};
    font-weight: 500;
    color: ${props => props.theme.bg.octonary};
    
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        background: ${props => props.theme.schema[props.schema].gradient};
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        display:block;
    }
`

export const PlayButton = styled(stylesh.PlayButton)`
    position: absolute;
    right: 0;
`

export const PlayButtonIcon = styled(stylesh.PlayButtonIcon)`
`

export const StatusContainer = styled.div`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);

    border-radius: 0rem 0rem 1rem 1rem;

    height: 2.5rem;
    max-width: 35rem;
    min-width: 10rem;
    
    padding: 0rem 2rem;
    padding-top: .5rem;

	background: ${props => props.theme.bg.septenary};
    top: 5rem;

    align-content: center;
    align-items: center;
    justify-content: center;
    text-align: center;
`