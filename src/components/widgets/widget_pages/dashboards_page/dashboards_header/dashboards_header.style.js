import styled from "styled-components";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";

import * as layoutCss from '../../../../../common_css/layout'

export const Header = styled.div`
    ${layoutCss.headerStyle};
    display: flex;
    padding: 1rem;

    flex-direction: row;
    align-items: center;
    /* justify-content: space-around; */
    position: relative;

    /* width: calc(90% - 1rem); */
    width: 100%;
    /* margin: 0 calc(5% + 0.5rem) 0 calc(5% + 0.5rem); */

    height: 6rem;

    /* background: linear-gradient(180deg, rgba(114, 187, 255, 0.47) 0%, rgba(114, 187, 255, 0) 100%); */
    
`




export const Title = styled.h2`
    color: ${props => props.theme.bg.octonary};
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz1};



    user-select: none;


    pointer-events: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: absolute;
    text-align: center;
    left: 0; 
    right: 0; 
    margin-left: auto; 
    margin-right: auto; 

    // tablet style
    @media only screen and (max-width: ${props => props.theme.widthBreakpoint.tablet}) {
        font-size: ${props => props.theme.fontSize.sz2};
        max-width: 15rem;
        text-overflow: ellipsis;
    }

`


export const PaceText = styled.p`
    color: ${props => props.color};
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    margin: 0;

`

export const PaceContainer = styled.div`
    position: absolute;
    right: 1rem;
    border: .2rem solid;
    border-color: ${props => props.color};
    border-radius: .5rem;
    padding: .5rem;
`


export const LotsTitle = styled.h2`
    color: ${props => props.theme.bg.octonary};
    font-family: ${props => props.theme.font.primary};
    font-size: 1.5rem;
    padding-right:1rem;
    padding-top:0.4rem;

`

export const LockContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 0.2rem;

    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz5};
    font-weight: 100;

`

export const MoreIcon = styled.i`
    font-size: 1.3rem;
    color: ${props => props.theme.bg.quinary};
    cursor: pointer;
    margin-top: 1.8rem;
`
export const LockIcon = styled.i`
    font-size: 1.3rem;
    color: ${props => props.theme.bg.quinary};
    cursor: pointer;
    margin-top: 0.4rem;
`

export const SidebarButton = styled(AssignmentOutlinedIcon)`
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz1};

    border:none;
    padding:0;
    margin:0;
    outline: none;
    background: transparent;
`

export const LotsContainer = styled.div`
    margin-right: calc(5% + 0.5rem);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    height: ${props => props.moreLots ? '' : '3.8rem'};
    transition: height 0.5s;
`

export const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;

    margin-left:2rem;
    margin-right:2rem;
    padding-top:1rem;
    padding-right:2rem;
    padding-bottom: 1rem;
    width: 90%;
    // height: 3.5rem;
    overflow: hidden;
    flex-wrap: wrap;



    @media only screen and (max-width: ${props => props.theme.widthBreakpoint.tablet}) {
        margin-left: 2rem;
        margin-right: 2rem;
    }

    transition: height 0.5s;
`

export const ColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

`