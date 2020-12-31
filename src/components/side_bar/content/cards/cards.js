import React, {useEffect, useState, useRef} from 'react';
import { useHistory } from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";

import * as styled from './cards.style'
import CardEditor from "./card_editor/card_editor";
import CardMenu from "./card_menu/card_menu";
import CardZone from "./card_zone/card_zone";
// import TimelineZone from "./timeline_zone/timeline_zone";
import Button from "../../../basic/button/button";
import Portal from "../../../../higher_order_components/portal";
import DropDownSearch from "../../../basic/drop_down_search_v2/drop_down_search";
import SummaryZone from "./summary_zone/summary_zone";

import {showEditor} from '../../../../redux/actions/card_actions'


const PAGES = {
    CARDS: "CARDS",
    SUMMARY: "SUMMARY",
    TIMELINE: "TIMELINE"
}
const Cards = (props) => {

    const {
        id
    } = props

    const history = useHistory()
    const processes = useSelector(state => { return state.processesReducer.processes })
    const isCardDragging = useSelector(state => { return state.cardPageReducer.isCardDragging })
    const isHoveringOverColumn = useSelector(state => { return state.cardPageReducer.isHoveringOverColumn })
    const showCardEditor = useSelector(state=> {return state.cardsReducer.showEditor})
    const processIds = Object.keys(processes)

    const dispatch = useDispatch()
    const onShowCardEditor = (bool) => dispatch(showEditor(bool))

    //const [showCardEditor, setShowCardEditor] = useState(false)
    const [selectedCard, setSelectedCard] = useState(null)
    const [showMenu, setShowMenu] = useState(false)
    const [zoneSize, setZoneSize] = useState({
        width: undefined,
        height: undefined,
        offsetLeft: undefined,
        offsetTop: undefined,
    })
    const zoneRef = useRef(null);

    // useEffect will run on zoneRef value assignment
    useEffect( () => {

        // The 'current' property contains info of the reference:
        // align, title, ... , width, height, etc.
        if(zoneRef.current){

            let height = zoneRef.current.offsetHeight;
            let width  = zoneRef.current.offsetWidth;
            let offsetTop  = zoneRef.current.offsetTop;
            let offsetLeft  = zoneRef.current.offsetLeft;
            setZoneSize({
                width: width,
                height: height,
                offsetTop: offsetTop,
                offsetLeft: offsetLeft,
            });
        }

    }, [zoneRef, window.innerHeight]);

    let title
    let showAddCard
    let showGanttViewButton = false
    let currentProcess
    let isProcessView = false
    switch(id) {
        case "summary":
            title = "Lots Summary"
            showAddCard = false
            currentProcess = processes[processIds[0]]
            break
        case "timeline":
            showAddCard = false
            showGanttViewButton = true
            title = "Timeline Zone"
            currentProcess = processes[processIds[0]]
            break
        default:
            isProcessView = true
            showAddCard = true
            currentProcess = processes[id]
            title = currentProcess.name
            break
    }

    const handleCardClick = (cardId, processId, binId) => {
        onShowCardEditor(true)
        setSelectedCard({cardId, processId, binId})
    }

    return(
        <styled.Container>
            {showCardEditor &&
            <CardEditor
                isOpen={showCardEditor}
                onAfterOpen={null}
                cardId={selectedCard ? selectedCard.cardId : null}
                processId={selectedCard ? selectedCard.processId : null}
                binId={selectedCard ? selectedCard.binId : null}
                close={()=>{
                    onShowCardEditor(false)
                    setSelectedCard(null)
                }}
            />
            }



            <styled.Header>
                {isProcessView ?
                <styled.MenuButton
                    style={{marginRight: "auto"}}
                    className="fas fa-chevron-left"
                    aria-hidden="true"
                    // onClick={()=>setShowMenu(!showMenu)}
                    onClick={()=>{
                        history.replace ('/processes')}
                    }
                />
                :
                    <styled.InvisibleItem style={{marginRight: "auto"}}/>
                }
                <styled.Title>{title}</styled.Title>
                <styled.InvisibleItem
                    style={{marginLeft: "auto"}}
                />
            </styled.Header>

            <styled.Body id={"cards-body"}>
                {showMenu &&
                <CardMenu
                    currentProcess={currentProcess}
                    close={()=>setShowMenu(false)}
                />
                }

                {
                    {
                        'summary':
                            <SummaryZone
                                handleCardClick={handleCardClick}
                                setShowCardEditor={onShowCardEditor}
                                showCardEditor={showCardEditor}
                            />,
                        'timeline':
                            <div
                                handleCardClick={handleCardClick}
                                initialProcesses={[currentProcess]}
                            />
                    }[id] ||
                        <styled.CardZoneContainer ref={zoneRef}>
                            <CardZone
                                maxHeight={(zoneSize.height - 75) + "px"}
                                setShowCardEditor={onShowCardEditor}
                                showCardEditor={showCardEditor}
                                processId={id}
                                handleCardClick={handleCardClick}
                                processId={id}
                            />
                        </styled.CardZoneContainer>
                }
            </styled.Body>
        </styled.Container>
    )
}

export default Cards
