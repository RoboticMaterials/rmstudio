import React from 'react'

const MiR100 = (props) => {

    const {
        device,
        d3
    } = props

    const shouldGlow = false

    // console.log(device.position)

    // console.log('QQQQ Props', props)
    
    return (
        <g
            style={{fill: '#03ffa3', stroke: '#03ffa3', strokeWidth:'0', opacity:'0.8'}}
            transform={`translate(${device.position.x},${device.position.y}) rotate(${360-device.position.orientation-90}) scale(${d3.scale/d3.imgResolution},${-d3.scale/d3.imgResolution})`}
        >

            <svg x="-10" y="-10" width="20" height="20" viewBox="0 0 400 400">
                <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                    <path d="M285,90a35,35,0,0,1-35-35,39.83,39.83,0,0,1,2.05-11.22A2.67,2.67,0,0,0,249.37,40H150.63A2.67,2.67,0,0,0,148,43.78,39.83,39.83,0,0,1,150,55a35,35,0,0,1-35,35,39.83,39.83,0,0,1-11.22-2A2.67,2.67,0,0,0,100,90.63V309.37a2.67,2.67,0,0,0,3.78,2.68A39.83,39.83,0,0,1,115,310a35,35,0,0,1,35,35A39.83,39.83,0,0,1,148,356.22a2.67,2.67,0,0,0,2.68,3.78h98.74a2.67,2.67,0,0,0,2.68-3.78A39.83,39.83,0,0,1,250,345a35,35,0,0,1,35-35,39.83,39.83,0,0,1,11.22,2.05,2.67,2.67,0,0,0,3.78-2.68V90.63A2.67,2.67,0,0,0,296.22,88,39.83,39.83,0,0,1,285,90ZM159.38,167a12.9,12.9,0,0,1,2.61-6.38l36.69-45.94a16.33,16.33,0,0,1,4.83-4.13c1.27-.55,5,2.41,6.42,4.13l36.69,45.94a12.9,12.9,0,0,1,2.61,6.38c.07,1.78-5,3.24-7.24,3.24H166.62C164.42,170.19,159.32,168.73,159.38,167ZM250,248.06a13,13,0,0,1-6.61,1.94H168a13,13,0,0,1-6.61-1.94c-1.44-1.07.6-6,2-7.69l36.69-45.93a16.64,16.64,0,0,1,4.82-4.14c1.28-.55,5.05,2.42,6.43,4.14L248,240.37C249.39,242.09,251.43,247,250,248.06Z"/>
                    <circle cx="115" cy="55" r="30"/>
                    <circle cx="285" cy="55" r="30"/>
                    <circle cx="115" cy="345" r="30"/>
                    <circle cx="285" cy="345" r="30"/>
                </svg>
            </svg>

            
        </g>
    )

}

export default MiR100