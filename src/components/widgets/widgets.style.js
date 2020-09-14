import styled from 'styled-components'


// export const Container = styled.div`
//     display: flex;
//     justify-content: ${props => !!props.widgetPage ? 'center' : ''};
//     transition: all 0.3s ease;
// `

export const WidgetLocationContainer = styled.div`
    position: absolute;

    top: ${props => !!props.widgetPage ? '0' : props => props.yPosition};
    left: ${props => !!props.widgetPage ? '0' : props => props.xPosition};
    right: ${props => !!props.widgetPage && '0'};
    transform: scale(${props => !!props.widgetPage ? '100%' : props => props.scale});

    width: ${props => !!props.widgetPage && '35rem'};

    margin: ${props => !!props.widgetPage && 'auto'};
    margin-top: ${props => !!props.widgetPage && '.5rem'};

    transition: ${props => !!props.widgetPage ? 'top 0.25s ease, margin 0.25s ease' : 'none'};

    pointer-events: auto;

    z-index: 10;

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        width: ${props => !!props.widgetPage && '25rem'};
        margin-top: ${props => !!props.widgetPage && '.205rem'};
        
    }

`

export const WidgetContainer = styled.div`
    
    margin: ${props => !!props.widgetPage ? '.25rem auto' : 'auto'};

    padding: ${props => !!props.widgetPage ? '' : '.5rem 1rem'};

    display: ${props => !!props.widgetPage ? 'flex' : ''};


    /* width: ${props => !!props.widgetPage ? '32rem' : '30rem'}; */
    width: ${props => !!props.widgetPage ? '15rem' : '13rem'};
    height: ${props => !!props.widgetPage ? 'auto' : '5rem'};
    
    box-shadow: ${props => !!props.widgetPage ? 'none' : '0 0.1rem 0.2rem 0rem #303030'};

    border-radius: 1rem;

    z-index: 1000;

    backdrop-filter: ${props => !!props.widgetPage ? '' : 'blur(10px)'};
    background-color: ${props => !!props.widgetPage ? 'none' : 'rgba(255, 255, 255, 0.6)'};

    /* transition: transform 0.25s ease, margin-left 0.25s ease, margin-right 0.25s ease, height 0.25s ease; */
    /* transition: all 0.25s ease; */

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        /* width: ${props => !!props.widgetPage ? '22rem' : '20rem'}; */
        width: ${props => !!props.widgetPage ? '15rem' : '13rem'};

        height: ${props => !!props.widgetPage ? 'auto' : '5.5rem'};

        /* padding: .5rem .5rem .5rem .5rem; */
        /* margin-top: ${props => !!props.widgetPage ? '0rem' : '5rem'}; */
        padding: ${props => !!props.widgetPage ? '' : '1rem'};
        
    }

    &:hover{
        cursor:pointer;
    }

    pointer-events: auto;

`

export const WidgetHoverArea = styled.div`
    margin-top: -12.7rem;
    width: 30rem;
    height:5rem;
    /* z-index: -1; */

    &:hover{
        cursor:pointer;
    }

`


export const WidgetPageButtonContainer = styled.div`
    width: 30rem;
    border-radius: 1rem;
    /* z-index: 1; */
    margin-top: .5rem;

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        width: 20rem;        
    }

`

export const WidgetButtonContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;

`

export const WidgetBlurContainer = styled.div`
    position: absolute;
    top: 0rem;
    width: 100%;
    height: 100%;
    /* z-index: -1; */
    backdrop-filter: blur(10px);

    /* opacity: ${props => !!props.showWidgetPage ? '100%' : '0%'};

    transition: all 0.25s ease; */
`


export const WidgetStatisticsBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2rem;
`;

export const WidgetStatisticsContainer = styled.div`
    display: flex;

    width: 100%;
    height: 3rem;

    /* padding: 0rem 3rem; */
    padding: 0rem 1rem;
    margin-top: .5rem;
    
    justify-content: space-between;

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        padding: 0rem 1rem;

    }
`;

export const WidgetStatisticsGraphic = styled.svg`
    overflow: visible;
    text-align: center;
    width: 2rem;
    height: 2rem;
    background-color: blue;
    /* transform: translateY(-0.3rem); */
`;

export const WidgetStatisticsIcon = styled.i`
    /* font-size: 1.5rem; */
`

export const WidgetStatisticsText = styled.p`
    align-self: auto;
    margin-left: .5rem;
    margin-top: auto;
    margin-bottom: auto;
`

// export const CloseButton = styled.span`
//     border: none;
//     background: none;
//     color: ${props => props.theme.fg.primary};
//     font-size: 8rem;
//     font-weight: 200;
//     text-align: center;
//     position: absolute;
//     z-index: 4;
//     line-height: 4rem;

//     font-family: ${props => props.theme.font.primary};

//     cursor: pointer;
//     top: 1rem;
//     right: 1rem;
//     &:focus {outline:0;}

//     @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
//         font-size: 3rem;
//         right: 1rem;
//         top: .5rem;
//     }

// `;

export const CloseButton = styled.i`
    border: none;
    background: none;
    color: ${props => props.theme.fg.red};
    text-align: center;
    
    font-size: 4rem;
    z-index: 4;
    margin-left: 1rem;

    position: absolute;
    cursor: pointer;
    left: .5rem;
    &:focus {outline:0;}

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        font-size: 3rem;
    }

    z-index: 10000;

`;

