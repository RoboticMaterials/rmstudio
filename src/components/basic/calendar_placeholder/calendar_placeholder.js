import React, {useState, useEffect} from "react";
import Popup from 'reactjs-popup'
import * as styled from "./calendar_placeholder.style"

const CalendarPlaceholder = (props) => {
	const {
		onClick,
		onStartClick,
		onEndClick,
		text,
		selectRange,
		calendarContent,
		showCalendarPopup,
		setShowCalendarPopup, 
		endText,
		startText,
		containerStyle
	} = props

	if(selectRange) return (
		<styled.DatesContainer style={containerStyle}>
			<styled.DateItem onClick={onStartClick}>
				<styled.DateText>{startText}</styled.DateText>
			</styled.DateItem>

			<styled.DateArrow className="fas fa-arrow-right"></styled.DateArrow>

			<styled.DateItem onClick={onEndClick}>
				<styled.DateText>{endText}</styled.DateText>
			</styled.DateItem>

			<Popup open={showCalendarPopup} closeOnDocumentClick={true} onClose={() => setShowCalendarPopup(false)}>
				{!!calendarContent && calendarContent()}
			</Popup>
		</styled.DatesContainer>
	)

	return (
		<styled.DateItem style={containerStyle} onClick={() => {onClick(); setShowCalendarPopup(true)}}>
			<styled.DateText>{text}</styled.DateText>
			<Popup open={showCalendarPopup} closeOnDocumentClick={true} onClose={() => setShowCalendarPopup(false)}>
				{!!calendarContent && calendarContent()}
			</Popup>
		</styled.DateItem>
	)
}

export default CalendarPlaceholder