import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import * as styled from "./rotate_button.style"

const STATES = {
	STATE_ONE: "STATE_ONE",
	STATE_TWO: "STATE_TWO"
}


const RotateButton = props => {
	const {
		iconName1,
		rotationTime,
		onStateOne,
		onStateTwo,
		containerCss,
		iconCss,
		schema

	} = props

	const [currentState, setCurrentState] = useState(STATES.STATE_ONE)
	const [rotate, setRotate] = useState(false)


	useEffect(() => {
		if(currentState === STATES.STATE_ONE) {
			setRotate(false)
			onStateOne()

		}
		else {
			setRotate(true)
			onStateTwo()
		}
	}, [currentState])

	return (
		<styled.Container
			css={containerCss}
			schema={schema}
			onClick={() => {
				setCurrentState(currentState === STATES.STATE_ONE ? STATES.STATE_TWO : STATES.STATE_ONE)
			}}
		>
			<styled.Icon
				schema={schema}
				css={iconCss}
				rotate={rotate}
				rotationTime={rotationTime}
				className={iconName1}
			>

			</styled.Icon>

		</styled.Container>
	)
}

RotateButton.propTypes = {
	iconName1: PropTypes.string,
	rotationTime: PropTypes.number,
	onStateOne: PropTypes.func,
	onStateTwo: PropTypes.func,
}

RotateButton.defaultProps = {
	iconName1: "",
	rotationTime: 500,
	onStateOne: () => {},
	onStateTwo: () => {},
	schema: "default"
}

export default RotateButton
