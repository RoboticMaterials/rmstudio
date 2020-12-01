import styled from 'styled-components'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import {RGB_Linear_Shade, hexToRGBA, LightenDarkenColor} from "../../../../../methods/utils/color_utils";
import * as pageStyle from "../dashboards_header/dashboards_header.style"

export const WidgetButtonButton = styled.button`
    border: none;
    border-radius: 1rem;
    text-align: center;
    width: 4rem;
    min-width: 4rem;
    height: 4rem;
    outline:none;
    margin: 0rem .5rem;

    /* margin-top: 0.5rem; */


    box-shadow: 0 0.1rem 0.2rem 0rem #303030;

    background-color: ${props => props.selected ? props.theme.bg.quaternary : props.theme.bg.septenary};
    // background-color: ${props =>  props.theme.bg.quaternary };

    transition: background-color 0.25s ease, box-shadow 0.1s ease;

    &:hover{
        background-color: ${props => props.theme.bg.senary};
    }

    &:focus{
        outline: 0 !important
    }

    &:active{
        box-shadow: none;
    }

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        width: 3.5rem;
        height: 3.5rem;
        border-radius: .5rem;
        
    }
`;

export const WidgetButtonLabel = styled.label`
    display: inline-block;
    width: 12.5rem;
    height: 6rem;
    text-align: center;
`;

export const WidgetButtonIcon = styled.i`
    font-size: 2.2rem;
    color: ${props =>  props.theme.fg.primary};

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        font-size: 2rem;

        
    }
`

export const FooterContainer = styled.div`
	width: 100%;
	display: flex;
	overflow-x: scroll;
	overflow-y: hidden;
	padding: 1rem;
	// background: ${props => props.theme.bg.quaternary};
`

// export const

export const Title = styled(pageStyle.Title)`
    margin: 0;
    padding: 0;
    
    font-size: ${props => props.isSmall && props.theme.fontSize.sz2};
    
    
`
export const Header = styled(pageStyle.Header)`
    justify-content: center;
`

export const Container = styled.div`
    width: 100%;
    min-width: ${props => props.width};
    height: 100%;
    display: flex;
    
    flex-direction: column;
    // justify-content: flex-start;
    align-items: center;
    z-index: 1;

    flex: 1;
    background: ${props => LightenDarkenColor(props.theme.bg.quaternary, 20)};
    
`



export const CloseButton = styled(CloseOutlinedIcon)`
	z-index: 5;
`

export const ListContainer = styled.div`
    width: 100%;
    height: 100%;
    max-height: 100%;
    padding-top: 3rem;

    padding-left: 2rem;
    padding-right: 2rem;
    
    
    display: flex;
    flex-direction: column;
    // align-items: center;
    // align-self: center;
    
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 1;
    
    background: ${props => LightenDarkenColor(props.theme.bg.quaternary, 20)};
    
    
    // hide scroll bar
    ::-webkit-scrollbar {
        width: 0px;  /* Remove scrollbar space */
        background: transparent;  /* Optional: just make scrollbar invisible */
    }
    ::-webkit-scrollbar-thumb {
        background: transparent;
    }
    
`

// adds padding to handle to make it easier to click
export const HandleContainer = styled.div`
    padding: .75rem;
    position: absolute;
    right: -2rem;
    top: 50%;
    transform: translateY(-50%);
  
    &:hover {
        cursor: grab;
    }
    z-index:3;
`

export const HandleIcon = styled.div`
    width: 10px;
    background: ${props => props.theme.bg.septenary};
    height: 3rem;
     border-radius: .25rem;
`

// NEW SIDEBAR STUFF
export const SidebarWrapper = styled.div`
    height: 100%;
    position: relative;

    display: flex;
    align-items: stretch;
    flex-flow: row nowrap;
    flex-direction: row;
    width: 100%;
    flex-grow: 0;
    z-index: 1;

    background: white;
    overflow: hidden;

    // box-shadow: 2px 0px 6px 2px rgba(0,0,0,0.4);
`

export const SidebarContent = styled.div`
    display: flex;
    align-self: stretch;
    flex-grow: 1;

    // background: ${props => props.theme.bg.primary};
    z-index: 1;

    border-right: 8px solid ${props => LightenDarkenColor(props.theme.bg.quinary,20)};
    
`

export const ResizeBar = styled.div`
    cursor: ew-resize;
    width: 8px;
    margin-right: -8px;
    background: transparent;
    display: flex;
    z-index: 20;
    align-items: center ;
    align-content: center ;
    justify-content: center;
`

export const ResizeHandle = styled.div`
    cursor: ew-resize;
    width: 4px;
    height: 30px;
    background: ${props => props.theme.bg.octonary};
    border-radius: 8px;
    text-align: center;
    z-index: 2;
    overflow: hidden;
    display: flex;
    align-items: center ;

`