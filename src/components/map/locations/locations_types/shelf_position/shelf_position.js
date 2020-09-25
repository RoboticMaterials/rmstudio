import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { LocationTypes } from '../../../../../methods/utils/locations_utils'

function ShelfPosition(props) {

    const [hovering, setHovering] = useState(false)
    const [dragging, setDragging] = useState(false)

    const color = '#0094FF'

    useEffect(() =>
        window.addEventListener("mouseup", () => setDragging(false))
    )

    return (
        <g
            className={props.rd3tClassName}
            style={{ fill: color, stroke: color, strokeWidth: '0', opacity: '0.8', cursor: "pointer" }}
            onMouseEnter={() => { setHovering(true) }}
            onMouseLeave={() => { setHovering(false) }}
            transform={`translate(${props.location.x},${props.location.y}) rotate(${props.location.rotation}) scale(${props.d3.scale})`}
        >
            <defs>

                {/* a transparent glow that takes on the colour of the object it's applied to */}
                <filter id="glow">
                    <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

            </defs>

            <g className={`${props.rd3tClassName}-rot`}>
                <circle x="-16" y="-16" r="16" strokeWidth="0" fill="transparent" style={{ cursor: dragging ? "pointer" : "default" }}></circle>
                <circle x="-18" y="-18" r="14" fill="none" strokeWidth="4" stroke="transparent" style={{ cursor: "pointer" }} onMouseDown={() => setDragging(true)}></circle>
                {(hovering || dragging) &&
                    <circle x="-14" y="-14" r="14" fill="none" strokeWidth="0.6" style={{ filter: "url(#glow)", cursor: "pointer" }}></circle>
                }
            </g>

            <g
                className={`${props.rd3tClassName}-trans`}
                // Special offset 
                transform='scale(.05) translate(-195,-120)'
                fill='#fb7c4e'
                stroke='#fb7c4e'
            >
                {LocationTypes['shelfPosition'].svgPath}
            </g>


        </g>
    )
}

export default ShelfPosition