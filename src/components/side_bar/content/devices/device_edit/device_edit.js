import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import uuid from 'uuid'

// Import Style
import * as styled from './device_edit.style'

// Import basic components
import { deepCopy } from '../../../../../methods/utils/utils'
import Textbox from '../../../../basic/textbox/textbox'
import DropDownSearch from '../../../../basic/drop_down_search_v2/drop_down_search'
import Button from '../../../../basic/button/button'
import Positions from '../../locations/positions/positions'


// Import actions
import * as locationActions from '../../../../../redux/actions/locations_actions'
import * as deviceActions from '../../../../../redux/actions/devices_actions'

// Import templates
import * as templates from '../devices_templates/device_templates'

/**
 * This handles editing device informaton
 * This also handles adding devices to the map
 * Currently using 'location' vs 'device' nominclature to match adding a location to the map and because devices really are just locations to the map
 * 
 * @param {*} props 
 */
const DeviceEdit = (props) => {

    const {
        deviceLocationDelete
    } = props

    const [connectionText, setConnectionText] = useState('Not Connected')
    const [connectionIcon, setConnectionIcon] = useState('fas fa-question')
    const [deviceType, setDeviceType] = useState('')
    const [showPositions, setShowPositions] = useState(false)

    const dispatch = useDispatch()
    const onAddLocation = (selectedLocation) => dispatch(locationActions.addLocation(selectedLocation))
    const onSetSelectedLocation = (selectedLocation) => dispatch(locationActions.setSelectedLocation(selectedLocation))
    const onSetSelectedDevice = (selectedDevice) => dispatch(deviceActions.setSelectedDevice(selectedDevice))

    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)
    const selectedDevice = useSelector(state => state.devicesReducer.selectedDevice)

    // On page load, see if the device is a new device or existing device
    // TODO: This is going to fundementally change with how devices 'connect' to the cloud.
    useEffect(() => {

        // If the selected device does not have a location, then give it a temp one
        if (!selectedLocation) {
            onSetSelectedLocation({
                name: selectedDevice.device_name,
                device_id: selectedDevice._id,
                schema: null,
                type: null,
                pos_x: 0,
                pos_y: 0,
                rotation: 0,
                x: 0,
                y: 0,
                _id: uuid.v4(),
            })
        } else {
            // If selected device has children then it has positions to show
            console.log('QQQQ Selected device in edit', selectedLocation)
            if (!!selectedLocation.children) {
                setShowPositions(true)
            }

        }

        // Sets the type of device, unknown devic defaults to an RM logo while known devices use their own custom SVGs
        if (selectedDevice.device_model === 'MiR100') setDeviceType('cart')
        else { setDeviceType('unknown') }


    }, [])

    // TODO: Not sure this is needed with IOT Implementation
    const handleDeviceConnection = () => {

        // Need to see how the device is connecting

        // if (device.status.connection === 'connected') {
        //     setConnectionIcon('fas fa-check')
        //     setConnectionText('Connected')
        // } else if (device.status.connection === 'connecting') {
        //     setConnectionIcon('fas fa-circle-notch fa-spin')
        //     setConnectionText = 'Connecting'
        // }
        // else if (device.status.connection === 'failed') {
        //     setConnectionIcon('fas fa-times')
        //     setConnectionText('Failed')
        // }
        // else {
        //     setConnectionIcon('fas fa-question')
        //     setConnectionText('Not Connected')
        // }

    }

    /**
     * This will appear if a new device has been found with the inputed IP address
     */
    const handleDeviceAdd = () => {

        return (
            <>
                <p>Connected!</p>
            </>
        )
    }

    /**
     * This will appear if the device being edited is an existing device
     */
    const handleExistingDevice = () => {

        let template = null
        let deviceIcon = 'icon-rmLogo'

        if (selectedDevice.device_model === 'MiR100') {
            template = templates.armAttriutes
        } else {
            template = templates.armAttriutes
        }

        return (
            <styled.SettingsSectionsContainer style={{ alignItems: 'center', textAlign: 'center', }}>

                <styled.ConnectionText>To add the device to the screen, grab the device with your mouse and drag onto the screen</styled.ConnectionText>

                <styled.DeviceIcon
                    className={deviceIcon}
                    onMouseDown={async e => {
                        if (selectedLocation.type !== null) { return }
                        await Object.assign(selectedLocation, { ...template, temp: true })
                        await onAddLocation(selectedLocation)
                        await onSetSelectedLocation(selectedLocation)
                    }

                    }
                />


            </styled.SettingsSectionsContainer>

        )

    }

    const handleAddDeviceToMap = () => {

    }

    const handlePositions = () => {

        return(
            <Positions/>
        )

        const type = 'cart_position'

        const template = {
            schema: 'position',
            type: 'cart_position',
            parent: null,
            new: true,
        }

        const selected = true

        const isSelected = selected

        return (
            <styled.SettingsSectionsContainer>

                <p>Put this bitch on the map</p>
                <styled.LocationTypeButton
                    id={`location-type-button-${type}`}
                    draggable={false}

                    onMouseDown={async e => {
                        console.log('QQQQ Selected Location', selectedLocation)
                        if (selectedLocation.type !== null) { return }
                        await Object.assign(selectedLocation, { ...template, temp: true })
                        await onAddLocation(selectedLocation)
                        await onSetSelectedLocation(selectedLocation)
                    }}

                    isSelected={type == selected}
                    style={{ cursor: 'grab' }}
                >

                    <styled.LocationTypeGraphic isSelected={isSelected} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                        <rect x="100" y="40" width="200" height="320" rx="30" transform="translate(400 0) rotate(90)" fill="none" stroke="#6283f0" strokeMiterlimit="10" strokeWidth="20" />
                        <path d="M315.5,200.87l-64,36.95A1,1,0,0,1,250,237v-73.9a1,1,0,0,1,1.5-.87l64,36.95A1,1,0,0,1,315.5,200.87Z" fill="#6283f0" stroke="#6283f0" strokeMiterlimit="10" strokeWidth="10" />
                        <circle cx="200" cy="200" r="15" fill="#6283f0" />
                        <circle cx="150" cy="200" r="10" fill="#6283f0" />
                        <circle cx="102.5" cy="200" r="7.5" fill="#6283f0" />
                    </styled.LocationTypeGraphic>

                </styled.LocationTypeButton>

            </styled.SettingsSectionsContainer>
        )
    }

    // This sets both the device name and station name to the same name
    const handleSetDeviceName = (event) => {
        onSetSelectedLocation({
            ...selectedLocation,
            name: event.target.value
        })

        onSetSelectedDevice({
            ...selectedDevice,
            device_name: event.target.value
        })

    }

    return (
        <styled.SettingsContainer>

            {/* Commented Out for now because we dont need to show/connect via IP TODO: Probably delete   */}
            {/* <styled.SettingsSectionsContainer>

                <styled.RowContainer style={{ justifyContent: 'space-between' }}>
                    <styled.SettingsLabel schema={'devices'} >Device IP</styled.SettingsLabel>

                    <styled.ConnectionButton onClick={() => handleDeviceConnection()} disabled={(connectionText === 'Connected' || connectionText === 'Connecting')}>
                        {connectionText}
                        <styled.ConnectionIcon className={connectionIcon} />
                    </styled.ConnectionButton>

                </styled.RowContainer>
                <Textbox
                    defaultValue={device.ip}
                    onChange={(event) => {
                        // Sets the IP address of the device to the event target vcalue
                        setDevice({
                            ...device,
                            ip: event.target.value
                        })
                    }}
                    style={{ fontWeight: '600', fontSize: '1.5rem' }}
                    labelStyle={{ color: 'black' }}
                />
            </styled.SettingsSectionsContainer> */}

            <styled.SettingsSectionsContainer>

                <styled.SettingsLabel schema={'devices'} >Device Name</styled.SettingsLabel>

                <Textbox
                    defaultValue={selectedDevice.device_name}
                    onChange={(event) => {
                        // Sets the IP address of the device to the event target vcalue
                        handleSetDeviceName(event)
                    }}
                    style={{ fontWeight: '600', fontSize: '1.5rem' }}
                    labelStyle={{ color: 'black' }}
                />

            </styled.SettingsSectionsContainer>


            {handleExistingDevice()}

            {!!showPositions &&

                handlePositions()
            }

            {/* <styled.SettingsSectionsContainer>
                <styled.SettingsLabel schema={'devices'}>Device Type</styled.SettingsLabel>
                <DropDownSearch
                    options={availableDevices}
                    valuefield={'type'}
                    searchBy={'type'}
                    labelField={'type'}
                    style={{ width: '100%', fontSize: '1rem' }}
                    values={!!device.type ? availableDevices.filter(d => d.type === device.type) : []}
                    onChange={(values) => {
                        device.type = values[0].type
                    }}
                    label='Select Device Type'
                    key={2}
                    closeOnSelect={true}
                    dropdownGap={5}
                    backspaceDelete={true}
                    noDataLabel={"No matches found"}

                />
            </styled.SettingsSectionsContainer> */}

            <Button schema={'devices'} secondary style={{ display: 'inline-block', float: 'right', width: '100%', maxWidth: '25rem', marginTop: '2rem' }}
                onClick={() => {
                    deviceLocationDelete()
                }}
            >
                Delete
                </Button>

        </styled.SettingsContainer>
    )

}

export default DeviceEdit