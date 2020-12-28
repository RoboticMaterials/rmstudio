import {SortableContainer} from "react-sortable-hoc";
import {useDispatch, useSelector} from "react-redux";
import {putCard} from "../../../../../../redux/actions/card_actions";
import * as styled from "./lot_queue.style";
import {Container} from "react-smooth-dnd";
import Card from "../../card/card";
import React, {useState} from "react";
import {setCardDragging, setColumnHovering} from "../../../../../../redux/actions/card_page_actions";
import Button from "../../../../../basic/button/button";
import CalendarField from "../../../../../basic/form/calendar_field/calendar_field";
import PropTypes from 'prop-types';
import Column from "../column/column";

const LotQueue = SortableContainer((props) => {
	const {
		station_id = "QUEUE",
		stationName = "Unnamed",
		handleCardClick,
		cards,
		size,
		processId,
		setShowCardEditor,
		showCardEditor
	} = props

	const [isCollapsed, setCollapsed] = useState(false)

	return(
		<Column
			maxWidth={"fit-content"}
			HeaderContent={
				!isCollapsed ?
					<styled.StationHeader>
						<i className="fa fa-chevron-down" aria-hidden="true"
						   onClick={() => setCollapsed(true)}
						/>

						<styled.LabelContainer>
							<styled.StationTitle>{stationName}</styled.StationTitle>
						</styled.LabelContainer>

						<Button
							onClick={()=> {
								handleCardClick(null, processId)
								setShowCardEditor(!showCardEditor)

							}}
							schema={'lots'}
						>
							+ Lot
						</Button>
					</styled.StationHeader>
					:
					<styled.StationHeader>
						<i className="fa fa-chevron-right" aria-hidden="true"
						   onClick={() => setCollapsed(false)}
						/>
					</styled.StationHeader>
			}
			station_id={station_id}
			stationName = {stationName}
			handleCardClick={handleCardClick}
			cards = {cards}
			size={size}
			processId={processId}
			isCollapsed={isCollapsed}
		/>
	)


})

// Specifies propTypes
LotQueue.propTypes = {
	stationName: PropTypes.string,
	handleCardClick: PropTypes.func,
	// cards: [],
	setShowCardEditor: PropTypes.func,
	showCardEditor: PropTypes.bool
};

// Specifies the default values for props:
LotQueue.defaultProps = {
	stationName: "Unnamed",
	handleCardClick: ()=>{},
	cards: [],
	setShowCardEditor: ()=>{},
	showCardEditor: false
};

export default LotQueue