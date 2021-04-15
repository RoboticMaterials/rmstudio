import React from 'react'

// components internal
import DashboardButton from "../../../dashboard_buttons/dashboard_button/dashboard_button"

// functions external
import PropTypes from 'prop-types'

// styles
import * as styled from "./report_button.style"

const ReportButton = (props) => {

	const {
		id,
		label,
		iconClassName,
		color,
		onClick,
		className,
	} = props

	return (
		<styled.ButtonWidthContainer key={id} className={className}>
			<DashboardButton
				title={label}
				key={id}
				type={null}
				iconClassName={iconClassName}
				iconColor={color}
				onClick={onClick}
				containerStyle={{
					height: '4rem',
					minHeight: "4rem",
					lineHeight: '3rem',
					margin: '0.5rem auto',
					flex: 1,
					width: "unset",
					minWidth: "unset",
					maxWidth: "50rem",
				}}
				hoverable={false}
				taskID={null}
				color={color}
				disabled={false}
			>
			</DashboardButton>
		</styled.ButtonWidthContainer>
	)
}

ReportButton.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	iconClassName: PropTypes.string,
	color: PropTypes.string,
	onClick: PropTypes.func,
	className: PropTypes.string,
}

ReportButton.propTypes = {
	id: "",
	label: "",
	iconClassName: "",
	color: "",
	onClick: () => {},
	className: "",
}

export default React.memo(ReportButton)
