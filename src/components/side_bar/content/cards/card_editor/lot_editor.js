import React, {useState, useEffect, useRef, useCallback} from "react";

// external functions
import PropTypes from "prop-types";
import {Formik} from "formik";
import {useDispatch, useSelector} from "react-redux";

// external components
import FadeLoader from "react-spinners/FadeLoader"

// internal components
import CalendarField, {CALENDAR_FIELD_MODES} from "../../../../basic/form/calendar_field/calendar_field";
import TextField from "../../../../basic/form/text_field/text_field";
import Textbox from "../../../../basic/textbox/textbox";
import DropDownSearchField from "../../../../basic/form/drop_down_search_field/drop_down_search_field";
import Button from "../../../../basic/button/button";
import ButtonGroup from "../../../../basic/button_group/button_group";
import ScrollingButtonField from "../../../../basic/form/scrolling_buttons_field/scrolling_buttons_field";
import NumberField from "../../../../basic/form/number_field/number_field";
import FieldComponentMapper from "./field_component_mapper/field_component_mapper";
import TemplateSelectorSidebar from "./lot_sidebars/template_selector_sidebar/template_selector_sidebar";
import SubmitErrorHandler from "../../../../basic/form/submit_error_handler/submit_error_handler";
import LotCreatorForm from "./template_form";
import PasteMapper, {PasteForm} from "../../../../basic/paste_mapper/paste_mapper";
import SimpleModal from "../../../../basic/modals/simple_modal/simple_modal";
import StatusList from "../../../../basic/status_list/status_list";

// actions
import {deleteCard, getCard, postCard, putCard} from "../../../../../redux/actions/card_actions";
import {getCardHistory} from "../../../../../redux/actions/card_history_actions";
import {getLotTemplates, setSelectedLotTemplate} from "../../../../../redux/actions/lot_template_actions";

// constants
import {FORM_MODES} from "../../../../../constants/scheduler_constants";
import {
	BASIC_LOT_TEMPLATE,
	BASIC_LOT_TEMPLATE_ID,
	CONTENT,
	COUNT_FIELD,
	DEFAULT_COUNT_DISPLAY_NAME,
	DEFAULT_NAME_DISPLAY_NAME, defaultBins,
	FIELD_COMPONENT_NAMES,
	FIELD_DATA_TYPES,
	FORM_BUTTON_TYPES, FORM_STATUS,
	NAME_FIELD,
	REQUIRED_FIELDS, SIDE_BAR_MODES
} from "../../../../../constants/lot_contants";

// utils
import {
	convertExcelToLot,
	convertLotToExcel,
	getInitialValues,
	parseMessageFromEvent
} from "../../../../../methods/utils/card_utils";
import {CARD_SCHEMA_MODES, uniqueNameSchema, editLotSchema, getCardSchema} from "../../../../../methods/utils/form_schemas";
import {getProcessStations} from "../../../../../methods/utils/processes_utils";
import {isEmpty, isObject} from "../../../../../methods/utils/object_utils";
import {arraysEqual} from "../../../../../methods/utils/utils";
import {immutableReplace, isArray, isNonEmptyArray} from "../../../../../methods/utils/array_utils";
import {formatLotNumber, getDisplayName} from "../../../../../methods/utils/lot_utils";

// import styles
import * as styled from "./lot_editor.style"
import * as FormStyle from "./lot_form_creator/lot_form_creator.style"

// hooks
import usePrevious from "../../../../../hooks/usePrevious";

// logger
import log from '../../../../../logger'
import {getCardsCount} from "../../../../../api/cards_api";
import useWarn from "../../../../basic/form/useWarn";

const logger = log.getLogger("CardEditor")
logger.setLevel("debug")

const FormComponent = (props) => {

	const {
		// formMode,
		lotNumber,
		collectionCount,
		cardNames,
		card,
		setShowLotTemplateEditor,
		showLotTemplateEditor,
		lotTemplate,
		lotTemplateId,
		bins,
		binId,
		setBinId,
		// cardId,
		close,
		isOpen,
		onDeleteClick,
		processId,
		errors,
		values,
		touched,
		isSubmitting,
		submitCount,
		setFieldValue,
		onSubmit,
		formikProps,
		processOptions,
		content,
		setContent,
		setValues,
		loaded
	} = props

	const {
		_id: cardId
	} = values || {}

	const formMode = cardId ? FORM_MODES.UPDATE : FORM_MODES.CREATE

	useWarn(uniqueNameSchema, formikProps)
	// just for console logging
	useEffect(() => {
		console.log("lot_editor values",values)
		console.log("lot_editor errors",errors)
		console.log("lot_editor touched",touched)
	}, [values, errors,touched])

	// actions
	const dispatch = useDispatch()
	const onGetCardHistory = async (cardId) => await dispatch(getCardHistory(cardId))
	const dispatchSetSelectedLotTemplate = (id) => dispatch(setSelectedLotTemplate(id))
	const onPostCard = async (card) => await dispatch(postCard(card))

	// redux state
	const currentProcess = useSelector(state => { return state.processesReducer.processes[processId] })
	const cardHistory = useSelector(state => { return state.cardsReducer.cardHistories[cardId] })
	const routes = useSelector(state => { return state.tasksReducer.tasks })
	const stations = useSelector(state => { return state.stationsReducer.stations })
	const processes = useSelector(state => { return state.processesReducer.processes }) || {}
	const processesArray = Object.values(processes)

	const [calendarFieldName, setCalendarFieldName] = useState(null)
	const [calendarFieldMode, setCalendarFieldMode] = useState(null)
	const [showTemplateSelector, setShowTemplateSelector] = useState(false)
	const [fieldNameArr, setFieldNameArr] = useState([]) // if cardId was passed, update existing. Otherwise create new
	const [pasteTable, setPasteTable] = useState([])
	const [clickedNoPaste, setClickedNoPaste] = useState(false)
	const [resetPasteTable, setResetPasteTable] = useState(false)
	const [showPasteMapper, setShowPasteMapper] = useState(false)
	const [showSimpleModal, setShowSimpleModal] = useState(false)
	const [pasteMapperHidden, setPasteMapperHidden] = useState(true)
	const [mappedValues, setMappedValues] = useState([])
	const [processedValues, setProcessedValues] = useState([])
	const [createMappedValues, setCreateMappedValues] = useState(false)
	const [showCreationStatus, setShowCreationStatus] = useState(false)
	const [mappedValuesIndex, setMappedValuesIndex] = useState(null)
	const [finalProcessOptions, setFinalProcessOptions] = useState([])
	const [showProcessSelector, setShowProcessSelector] = useState(props.showProcessSelector)

	const previousProvidedIndex = usePrevious(mappedValuesIndex)

	const mappedValuesRef = useRef(null)

	// derived state
	const selectedBinName = stations[binId] ?
		stations[binId].name :
		binId === "QUEUE" ? "Queue" : "Finished"

	const processStationIds = getProcessStations(currentProcess, routes) // get object with all station's belonging to the current process as keys
	const availableBins = !isEmpty(bins) ? Object.keys(bins) : ["QUEUE"]

	const errorCount = Object.keys(errors).length > 0 // get number of field errors
	const touchedCount = Object.values(touched).length // number of touched fields
	const submitDisabled = ((errorCount > 0) || (touchedCount === 0) || isSubmitting) && (submitCount > 0) // disable if there are errors or no touched field, and form has been submitted at least once

	useEffect(() => {
		if(isArray(mappedValues) && mappedValues.length > 0 && mappedValues[mappedValuesIndex] && mappedValuesIndex !== previousProvidedIndex) {
			const newValue = convertLotToExcel(values, lotTemplateId)
			setMappedValues(immutableReplace(mappedValues, newValue, previousProvidedIndex))
		}
	}, [values, mappedValuesIndex])

	useEffect(() => {
		if(isArray(mappedValues) && mappedValues.length > 0 && mappedValues[mappedValuesIndex] && mappedValuesIndex !== previousProvidedIndex) {

			const currMappedValue = mappedValues[mappedValuesIndex]

			const currMappedLot = convertExcelToLot(currMappedValue, lotTemplate, values.processId)

			formikProps.resetForm()	// reset when switching

			setValues(currMappedLot)
		}

	}, [mappedValues, mappedValuesIndex])

	useEffect(() => {
		if(createMappedValues) {
			let processedLots = []
			mappedValuesRef.current = [...mappedValues]

			mappedValues.forEach((currMappedLot, currMappedLotIndex) => {

				const  {
					name: payloadName,	// extract reserved fields
				} = currMappedLot

				formikProps.resetForm()	// reset when switching

				let newLot = convertExcelToLot(currMappedLot, lotTemplate, values.processId)

				let currLotStatus = {
					index: currMappedLotIndex,
					name: payloadName ? payloadName : "Unnamed Lot",
					errors: {},
					validationStatus: {
						message: `Validating lot.`,
						code: FORM_STATUS.VALIDATION_START
					},
					resourceStatus: {
						message: `Waiting.`,
						code: FORM_STATUS.WAITING
					},
				}

				superSubmit(newLot, currMappedLotIndex, currLotStatus)

				processedLots.push(currLotStatus)
			})

			setProcessedValues(processedLots)
			setCreateMappedValues(false)
			setShowCreationStatus(true)
		}
	}, [createMappedValues, mappedValues])

	useEffect(() => {
		if(mappedValuesRef && mappedValuesRef.current) {
			setMappedValues(mappedValuesRef.current)
		}
	}, [mappedValuesRef, mappedValuesRef.current])

	const superSubmit = (values, index, lotStatus) => {
		let updatedItem = {...values}

		editLotSchema.validate({
			...values,
			cardNames
		}, {abortEarly: false})
			.then((ayo) => {
				lotStatus.validationStatus = {
					message: `Successfully validated lot!`,
					code: FORM_STATUS.VALIDATION_SUCCESS
				}

				const {
					name: newName,
					bins: newBins,
					processId: newProcessId,
					[lotTemplateId]: templateValues,
				} = values || {}

				lotStatus.resourceStatus = {
					message: `Creating lot.`,
					code: FORM_STATUS.CREATE_START
				}

				const submitItem = {
					name: newName,
					bins: newBins,
					process_id: newProcessId,
					lotTemplateId: lotTemplateId,
					...templateValues,
					lotNumber: collectionCount + index
				}

				onPostCard(submitItem).then((result) => {

					if(result) {
						const {
							_id = null
						} = result || {}

						const currMappedLot = convertLotToExcel(values, lotTemplateId)
						mappedValuesRef.current = immutableReplace(mappedValuesRef.current, {
							...currMappedLot,
							_id
						}, index)

						updatedItem._id = _id

						lotStatus.resourceStatus = {
							message: `Successfully created lot!`,
							code: FORM_STATUS.CREATE_SUCCESS
						}

						if(mappedValuesIndex === index) {
							formikProps.resetForm()
							setValues({
								...values,
								_id
							})
						}
					}

					else {
						lotStatus.resourceStatus = {
							message: `Error creating lot.`,
							code: FORM_STATUS.CREATE_ERROR
						}
					}
				})
					.catch((err) => {
						console.error("post it err",err)
					})

			})
			.catch((err) => {
				console.error("ERRRRRORRRR", err)

				const {
					inner = [],
					message
				} = err || {}

				let lotErrors = {}

				inner.forEach((currErr) => {
					const {
						errors,			//: ["1 character minimum."]
						path, 				//: "name"
					} = currErr || {}

					let existingErrors = lotErrors[path] || []

					lotErrors = {
						...lotErrors,
						[path]: [...existingErrors, ...errors]
					}
				})

				console.log("lotErrors",lotErrors)

				lotStatus.resourceStatus = {
					message: `Creation cancelled: validation failed.`,
					code: FORM_STATUS.CANCELLED
				}
				lotStatus.validationStatus = {
					message: `Error validating lot.`,
					code: FORM_STATUS.VALIDATION_ERROR
				}
				lotStatus.errors = lotErrors

			});

		return updatedItem
	}

	/*
	* This effect sets default values when the lotTemplate changes.
	*
	* This must be dont in the formComponent so it has access to setFieldValue, which is a prop from formik
	*
	* It checks values to see if it already contains a key for the current lotTemplateId
	* If the key already exists, nothing is done. Otherwise it creates the key and sets the intialvalues using getInitialValues
	* */
	useEffect( () => {
		// extract sub object for current lotTemplateId
		const {
			[lotTemplateId]: templateValues
		} = values || {}

		// if doesn't contain values for current object, set initialValues
		if(!templateValues) setFieldValue(lotTemplateId, getInitialValues(lotTemplate, card))

	}, [lotTemplateId, fieldNameArr])

	useEffect( () => {
		if(isArray(processOptions)) {
			setFinalProcessOptions(processOptions)
		}
		else if(isArray(processesArray)) {
			setFinalProcessOptions(processesArray.map((currProcess) => currProcess._id))
		}
		else {
			setFinalProcessOptions([])
		}

	}, [processOptions, processes])



	/*
	* This effect runs whenever lotTemplate changes
	* It sets fieldNameArr to an array of all the fieldNames in the current template.
	* If there is no change in fieldNameArr, no update is performed. Otherwise it updates the array whenever lotTemplate changes
	*
	* This is necessary in order to update initialValues when a lotTemplate is edited
	* */
	useEffect(() => {

		// get fields
		const {
			fields
		} = lotTemplate || {}

		// check if array to prevent errors
		if(isArray(fields)) {

			let newFieldNameArr = [] // initialze arr for storing fieldNames

			fields.forEach((currRow) => {	// loop through rows
				currRow.forEach((currItem) => {	// loop through items

					// extract properties
					const {
						fieldName,
						component,
						dataType
					} = currItem || {}

					if(component === FIELD_COMPONENT_NAMES.CALENDAR_START_END) {
						newFieldNameArr.push({fieldName: `${fieldName}`, index: 0, dataType: dataType, displayName: fieldName})
						newFieldNameArr.push({fieldName: `${fieldName}`, index: 1, dataType: dataType, displayName: fieldName})
					}
					else {
						newFieldNameArr.push({fieldName, dataType: component, displayName: fieldName})
					}

				})
			})

			// if the list of fieldNames has changed, update fieldNameArr
			// if(!arraysEqual(fieldNameArr, newFieldNameArr)) {
			setFieldNameArr(newFieldNameArr)
			// }
		}
	}, [lotTemplate])


	/*
	* This function gets a list of names and ids for the stations button group
	* */
	const getButtonGroupOptions = () => {
		var buttonGroupNames = []
		var buttonGroupIds = []

		// loop through availableBins. add name of each bin to buttonGroupNames, add id to buttonGroupIds
		availableBins.forEach((currBinId) =>{
			if(stations[currBinId]) {
				buttonGroupNames.push(stations[currBinId].name)
				buttonGroupIds.push(currBinId)
			}
		})

		// add queue to beginning of arrays
		if(bins["QUEUE"]) {
			buttonGroupNames.unshift("Queue")
			buttonGroupIds.unshift("QUEUE")
		}

		// add finished to end of arrays
		if(bins["FINISH"]) {
			buttonGroupNames.push("Finished")
			buttonGroupIds.push("FINISH")
		}

		return [buttonGroupNames, buttonGroupIds]
	}

	const [buttonGroupNames, buttonGroupIds] = getButtonGroupOptions()

	const pasteListener = useCallback((e) => {
		const plainText = e.clipboardData.getData('text/plain')

		var rows = plainText.split("\n");
		let table = []

		for(var y in rows) {
			// let row = []

			var cells = rows[y].split("\t")

			for(const x in cells) {

				if(table[x]) {
					table[x].push(cells[x])
				}
				else {
					table.push([cells[x]])
				}
			}
		}

		setPasteTable(table)

		// need to call setShowSimpleModal with tiny delay in order to allow normal pasting
		if(!clickedNoPaste) {
			setTimeout(() => {
				setShowSimpleModal(true)
			}, 0)
		}

		return true
	}, [clickedNoPaste]);

	const enterListener = useCallback((event) => {

		// check if event code corresponds to enter
		if (event.code === "Enter" || event.code === "NumpadEnter" || event.code === 13 || event.key === "Enter") {
			// prevent default actions
			event.preventDefault()
			event.stopPropagation()


			if(formMode === FORM_MODES.UPDATE) {
				// if the form mode is set to UPDATE, the default action of enter should be to save the lot
				// this is done by setting buttonType to SAVE and submitting the form

				switch(content){
					case CONTENT.MOVE:
						onSubmit(values, FORM_BUTTON_TYPES.MOVE_OK)
						break
					default:
						onSubmit(values, FORM_BUTTON_TYPES.SAVE)
						break
				}
			}
			else {
				// if the form mode is set to CREATE (the only option other than UPDATE), the default action of the enter key should be to add the lot
				onSubmit(values, FORM_BUTTON_TYPES.ADD)
			}

		}
	}, [values])


	/*
	* listen for paste event to migrate excel data
	* */
	useEffect(() => {


		// add event listener to 'paste'
		document.addEventListener("paste", pasteListener);

		// on dismount remove the event pasteListener
		return () => {
			document.removeEventListener("paste", pasteListener);
		};
	}, [clickedNoPaste])

	/*
	* handles when enter key is pressed
	*
	* This effect attaches an event listener to the keydown event
	* The listener effect listens for 'Enter' and 'NumpadEnter' events
	* If either of these events occur, the form will be submitted
	* */
	useEffect(() => {
		// keydown event listener

		// add event listener to 'keydown'
		document.addEventListener("keydown", enterListener);

		// on dismount remove the event listener
		return () => {
			document.removeEventListener("keydown", enterListener);
		};
	}, [values])

	useEffect(() => {

		if(!isOpen && content) setContent(null)

		return () => {
		}
	}, [isOpen])

	/*
	* Renders content for moving some or all of a lot from one bin to another
	* */
	const renderMoveContent = () => {

		// get destination options for move
		// the destination options include
		const destinationOptions = [...Object.values(stations).filter((currStation) => {
			if((currStation._id !== binId) && processStationIds[currStation._id]) return true
		})]
		if(binId !== "QUEUE") destinationOptions.unshift({name: "Queue", _id: "QUEUE"}) // add queue
		if(binId !== "FINISH") destinationOptions.push({name: "Finished", _id: "FINISH"}) // add finished

		const maxValue = bins[binId]?.count || 0

		return(
			<styled.BodyContainer
				minHeight={"20rem"}
			>
				<div>
					<styled.ContentHeader style={{flexDirection: "column"}}>
						<styled.ContentTitle>Move lot</styled.ContentTitle>
						<div>
							<styled.InfoText style={{marginRight: "1rem"}}>Current Station</styled.InfoText>
							<styled.InfoText schema={"lots"} highlight={true}>{selectedBinName}</styled.InfoText>
						</div>
					</styled.ContentHeader>
					<div style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1rem"}}>
						<styled.InfoText>Select Quantity to Move</styled.InfoText>
						<styled.InfoText style={{marginBottom: "1rem"}}>{maxValue} Items Available</styled.InfoText>

						<NumberField
							maxValue={maxValue}
							minValue={0}
							name={"moveCount"}
						/>
					</div>

					<div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1rem"}}>
						<styled.InfoText style={{marginBottom: "1rem"}}>Select Lot Destination</styled.InfoText>

						<DropDownSearchField
							containerSyle={{minWidth: "35%"}}
							pattern={null}
							name="moveLocation"
							labelField={'name'}
							options={destinationOptions}
							valueField={"_id"}
							fixedHeight={false}
						/>
					</div>
				</div>
			</styled.BodyContainer>
		)
	}

	/*
	* renders calender for selected dates
	* */
	const renderCalendarContent = () => {

		const {
			fullFieldName,
			fieldName
		} = calendarFieldName || {}

		// get templateValues
		const {
			[lotTemplateId]: templateValues
		} = values || {}

		// get field value
		const {
			[fieldName]: fieldValue
		} = templateValues || {}

		return(
			<styled.BodyContainer>
				<styled.ContentHeader style={{}}>
					<styled.ContentTitle>Select Start and End Date</styled.ContentTitle>
				</styled.ContentHeader>

				<styled.CalendarContainer>
					<CalendarField
						minDate={calendarFieldMode === CALENDAR_FIELD_MODES.END && fieldValue[0]}
						maxDate={calendarFieldMode === CALENDAR_FIELD_MODES.START && fieldValue[1]}
						selectRange={false}
						name={`${fullFieldName}[${calendarFieldMode === CALENDAR_FIELD_MODES.START ? 0 : 1}]`}
					/>
				</styled.CalendarContainer>
			</styled.BodyContainer>
		)
	}

	// renders main content
	const renderMainContent = () => {
		return(
			<>
				<styled.SectionContainer>
					<styled.TheBody>
						{renderFields()}
					</styled.TheBody>
				</styled.SectionContainer>
				<styled.BodyContainer>
					{formMode === FORM_MODES.UPDATE &&
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							marginBottom: "2rem",
						}}
					>
						<styled.FieldTitle>Station</styled.FieldTitle>

						<ButtonGroup
							buttonViewCss={styled.buttonViewCss}
							buttons={buttonGroupNames}
							selectedIndex={buttonGroupIds.findIndex((ele) => ele === binId)}
							onPress={(selectedIndex)=>{
								setBinId(buttonGroupIds[selectedIndex])
								// setFieldValue("selectedBin", buttonGroupIds[selectedIndex])
								// setSelectedBin(availableBins[selectedIndex])
							}}
							containerCss={styled.buttonGroupContainerCss}
							buttonViewSelectedCss={styled.buttonViewSelectedCss}
							buttonCss={styled.buttonCss}
						/>
					</div>
					}

					<div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
						<styled.ObjectInfoContainer>
							<styled.ObjectLabel>{getDisplayName(lotTemplate, "count", DEFAULT_COUNT_DISPLAY_NAME)}</styled.ObjectLabel>
							<NumberField
								minValue={0}
								name={`bins.${binId}.count`}
							/>
						</styled.ObjectInfoContainer>
					</div>

					{formMode === FORM_MODES.UPDATE &&
					<styled.WidgetContainer>
						<styled.Icon
							className="fas fa-history"
							color={"red"}
							onClick={()=> {
								if(content !== CONTENT.HISTORY) {
									onGetCardHistory(cardId)
									setContent(CONTENT.HISTORY)
								}
								else {
									setContent(null)
								}
							}}
						/>
					</styled.WidgetContainer>
					}
				</styled.BodyContainer>
			</>
		)
	}

	// renders history content
	const renderHistory = () => {
		const {
			events = []
		} = cardHistory || {}

		return(
			<styled.BodyContainer>
				<styled.ContentHeader style={{}}>
					<styled.ContentTitle>History</styled.ContentTitle>
				</styled.ContentHeader>


				<styled.HistoryBodyContainer>
					{events.map((currEvent) => {
						const {
							name,
							description,
							username,
							data,
							date: {$date: date}
						} = currEvent

						var jsDate = new Date(date);
						var currentDate = new Date();
						const diffTime = Math.abs(currentDate - jsDate);
						const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

						var {
							bins,
							...modifiedData
						} = data

						// handle route_id change
						if(Object.keys(modifiedData).includes("route_id")) {
							const {
								route_id: {
									new: newRouteId,
									old: oldRouteId
								},
								...rest
							} = modifiedData

							modifiedData = {
								...rest, "route": {
									new: routes[newRouteId] ? routes[newRouteId].name : "",
									old: routes[oldRouteId] ? routes[oldRouteId].name : "",
								}
							}

						}

						let messages = parseMessageFromEvent(name, username, modifiedData)

						if(messages.length === 0) return null

						return(
							<styled.HistoryItemContainer>
								<styled.HistoryUserContainer>
									<styled.HistoryUserText>{username}</styled.HistoryUserText>
								</styled.HistoryUserContainer>
								<styled.HistoryInfoContainer>
									{messages.map((currMessage) => {
										return(
											<styled.HistoryInfoText>
												{currMessage}
											</styled.HistoryInfoText>
										)
									})}
								</styled.HistoryInfoContainer>
								<styled.HistoryDateContainer>
									<styled.HistoryDateText>{jsDate.toLocaleString()}</styled.HistoryDateText>
								</styled.HistoryDateContainer>
							</styled.HistoryItemContainer>
						)
					})}
				</styled.HistoryBodyContainer>
			</styled.BodyContainer>
		)
	}


	/*
	* Renders fields
	* */
	const renderFields = () => {

		const fields = isArray(lotTemplate?.fields) ? lotTemplate.fields : []

		return (
			<FormStyle.ColumnContainer>

				{fields.map((currRow, currRowIndex) => {

					const isLastRow = currRowIndex === fields.length - 1
					return <div
						style={{flex: isLastRow && 1, display: isLastRow && "flex", flexDirection: "column"}}
						key={currRowIndex}
					>
						<FormStyle.RowContainer>

							{currRow.map((currItem, currItemIndex) => {
								const {
									_id: dropContainerId,
									component,
									fieldName
								} = currItem || {}

								// get full field name
								const fullFieldName = `${lotTemplateId}.${fieldName}`

								// get templateValues
								const {
									[lotTemplateId]: templateValues
								} = values || {}
								// get field value
								const {
									[fieldName]: fieldValue
								} = templateValues || {}

								// get template error
								const {
									[lotTemplateId]: templateErrors
								} = errors || {}
								// get field error
								const {
									[fieldName]: fieldError
								} = templateErrors || {}

								return <styled.FieldContainer
									key={dropContainerId}
								>
									<FieldComponentMapper
										value={fieldValue}
										onCalendarClick={(mode) => {
											setContent(CONTENT.CALENDAR)
											setCalendarFieldName({fullFieldName, fieldName})
											setCalendarFieldMode(mode)
										}}
										displayName={fieldName}
										preview={false}
										component={component}
										fieldName={fullFieldName}
									/>
								</styled.FieldContainer>
							})}

						</FormStyle.RowContainer>
					</div>
				})}
			</FormStyle.ColumnContainer>
		)
	}

	const renderProcessSelector = () => {

		return(
			<styled.ProcessFieldContainer>
				<styled.ContentHeader style={{marginBottom: ".5rem"}}>
					<styled.ContentTitle>Select Process</styled.ContentTitle>
				</styled.ContentHeader>

				<ScrollingButtonField
					name={"processId"}
					valueKey={"value"}
					labelKey={"label"}
					options={
						finalProcessOptions.map((currProcessId, currIndex) => {
							const currProcess = processes[currProcessId] || {}
							const {
								name: currProcessName = ""
							} = currProcess

							return (
								{
									label: currProcessName,
									value: currProcessId
								}
							)
						})
					}
				/>
			</styled.ProcessFieldContainer>
		)
	}

	const renderForm = () => {
		return(
			<styled.StyledForm>
				<styled.Header>
					{((content === CONTENT.CALENDAR) || (content === CONTENT.HISTORY) || (content === CONTENT.MOVE))  &&
					<Button
						onClick={()=>setContent(null)}
						schema={'error'}
						// secondary
					>
						<styled.Icon className="fas fa-arrow-left"></styled.Icon>
					</Button>
					}

					<styled.Title>
						{formMode === FORM_MODES.CREATE ?
							"Create Lot"
							:
							"Edit Lot"
						}
					</styled.Title>

					<Button
						secondary
						onClick={close}
						schema={'error'}
					>
						<i className="fa fa-times" aria-hidden="true"/>
					</Button>
				</styled.Header>

				<styled.RowContainer style={{flex: 1, alignItems: "stretch", overflow: "hidden"}}>
					{(showTemplateSelector) &&
					<TemplateSelectorSidebar
						showFields={false}
						onTemplateEditClick={() => {
							setShowLotTemplateEditor(true)
						}}
						selectedLotTemplatesId={lotTemplateId}

					/>
					}

					<styled.SuperContainer>

						<styled.FieldsHeader>

							<styled.RowContainer
								style={{
									justifyContent: "flex-end",
									padding: "1rem 1rem 0 0"
								}}
							>
								{isNonEmptyArray(pasteTable) &&
								<styled.PasteIcon
									className="fas fa-paste"
									color={"#ffc20a"}
									onClick={() => {
										setShowPasteMapper(true)
										setPasteMapperHidden(false)
										setResetPasteTable(true)
										setTimeout(() => {
											setResetPasteTable(false)
										}, 250)
										setClickedNoPaste(false)
									}}
								/>
								}

								<styled.TemplateButton
									className={SIDE_BAR_MODES.TEMPLATES.iconName}
									color={SIDE_BAR_MODES.TEMPLATES.color}
									onClick={() => {
										setShowTemplateSelector(!showTemplateSelector)
										dispatchSetSelectedLotTemplate(lotTemplateId)
									}}
								/>

							</styled.RowContainer>

							{(showProcessSelector || !values.processId) && renderProcessSelector()}

							<styled.RowContainer>
								<styled.NameContainer style={{flex: 0}}>
									<styled.LotName>Lot Number</styled.LotName>
										<Textbox
											value={formatLotNumber(lotNumber)}
											style={{
												cursor: "not-allowed"
											}}
											schema={"lots"}
										/>
								</styled.NameContainer>

								<styled.NameContainer>


									<styled.LotName>{getDisplayName(lotTemplate, "name", DEFAULT_NAME_DISPLAY_NAME)}</styled.LotName>
									<TextField
										name={"name"}
										type={"text"}
										placeholder={"Enter name..."}
										InputComponent={Textbox}
										schema={"lots"}
									/>
								</styled.NameContainer>
							</styled.RowContainer>
						</styled.FieldsHeader>

						{(content === null) &&
						renderMainContent()
						}
						{(content === CONTENT.CALENDAR) &&
						renderCalendarContent()
						}
						{(content === CONTENT.HISTORY) &&
						renderHistory()
						}
						{(content === CONTENT.MOVE) &&
						renderMoveContent()
						}

					</styled.SuperContainer>
				</styled.RowContainer>

				<styled.Footer>
					{/* render buttons for appropriate content */}
					<styled.ButtonContainer>
						{
							{
								[CONTENT.CALENDAR]:
									<>

										<Button
											style={{...buttonStyle, width: "8rem"}}
											onClick={() => setContent(null)}
											schema={"ok"}
											secondary
										>
											Ok
										</Button>
										<Button
											style={{...buttonStyle}}
											onClick={() => setFieldValue(`${calendarFieldName.fullFieldName}[${calendarFieldMode === CALENDAR_FIELD_MODES.START ? 0 : 1}]`, null)}
											// secondary={"error"}
											schema={"error"}
										>
											Clear Date
										</Button>
										<Button
											style={buttonStyle}
											onClick={() => setContent(null)}
											schema={"error"}
										>
											Cancel
										</Button>
									</>,

								[CONTENT.HISTORY]:
									<>
										<Button
											style={{...buttonStyle}}
											onClick={() => setContent(null)}
											schema={"error"}
											// secondary
										>
											Go Back
										</Button>
									</>,
								[CONTENT.MOVE]:
									<>
										<Button
											disabled={submitDisabled}
											style={{...buttonStyle, width: "8rem"}}
											type={"button"}
											onClick={() => {
												onSubmit(values, FORM_BUTTON_TYPES.MOVE_OK)
											}}
											schema={"ok"}
											secondary
										>
											Ok
										</Button>
										<Button
											type={"button"}
											style={buttonStyle}
											onClick={() => setContent(null)}
											schema={"error"}
											// secondary
										>
											Cancel
										</Button>
									</>
							}[content] ||
							<>
								{/*<Button*/}
								{/*	schema={'lots'}*/}
								{/*	type={"button"}*/}
								{/*	style={{...buttonStyle, marginBottom: '0rem', marginTop: 0}}*/}
								{/*	onClick={async () => {*/}
								{/*		setShowTemplateSelector(!showTemplateSelector)*/}
								{/*		dispatchSetSelectedLotTemplate(lotTemplateId)*/}
								{/*	}}*/}
								{/*>*/}
								{/*	{showTemplateSelector ? "Hide Templates" : "Show Templates"}*/}
								{/*</Button>*/}

								{(isArray(mappedValues) && mappedValues.length > 0) &&
									null
									// <Button
									// 	type={"button"}
									// 	label={"Show Mapper"}
									// 	onClick={() => {
									// 		setShowPasteMapper(true)
									// 		setPasteMapperHidden(false)
									// 	}}
									// />
								}

								{(isArray(processedValues) && processedValues.length > 0) &&
								// <Button
								// 	type={"button"}
								// 	label={"Show Status"}
								// 	onClick={() => {
								// 		setShowCreationStatus(true)
								// 	}}
								// />
									null
								}

								{formMode === FORM_MODES.CREATE ?
									<>
										{!(isArray(mappedValues) && mappedValues.length > 0) &&
										<Button
											schema={'lots'}
											type={"button"}
											disabled={submitDisabled}
											style={{...buttonStyle, marginBottom: '0rem', marginTop: 0}}
											onClick={async () => {
												onSubmit(values, FORM_BUTTON_TYPES.ADD)
											}}
										>
											Add
										</Button>
										}

										<Button
											schema={'lots'}
											type={"button"}
											disabled={submitDisabled}
											style={{...buttonStyle, marginBottom: '0rem', marginTop: 0}}
											onClick={async () => {
												if (isArray(mappedValues) && mappedValues.length > 0) {
													const submitWasSuccessful = await onSubmit(values)

													// go to next lot
													if (mappedValuesIndex < mappedValues.length - 1) {
														if(submitWasSuccessful) setMappedValuesIndex(mappedValuesIndex + 1)
													}

												} else {
													// function order matters
													onSubmit(values, FORM_BUTTON_TYPES.ADD_AND_NEXT)
												}


											}}
										>
											Add & Next
										</Button>
									</>
									:
									<>
										<Button
											schema={'lots'}
											type={"button"}
											disabled={submitDisabled}
											style={{...buttonStyle, marginBottom: '0rem', marginTop: 0}}
											onClick={async () => {
												onSubmit(values, FORM_BUTTON_TYPES.SAVE)
											}}
										>
											Save
										</Button>

										<Button
											schema={'lots'}
											style={{...buttonStyle, marginBottom: '0rem', marginTop: 0}}
											type={"button"}
											onClick={() => onDeleteClick(binId)}
										>
											<i style={{marginRight: ".5rem"}} className="fa fa-trash" aria-hidden="true"/>

											Delete
										</Button>
										<Button
											schema={'lots'}
											type={"button"}
											style={{...buttonStyle, marginBottom: '0rem', marginTop: 0}}
											onClick={async () => {
												setContent(CONTENT.MOVE)
											}}
										>
											Move
										</Button>
									</>
								}
							</>
						}

					</styled.ButtonContainer>


					{(isArray(mappedValues) && mappedValues.length > 0) &&
					<styled.PageSelector>
						<styled.PageSelectorButton className="fas fa-chevron-left"
												   onClick={() => {
													   if(mappedValuesIndex > 0) {
														   setMappedValuesIndex(mappedValuesIndex - 1)
													   }
												   }}
						/>
						<styled.PageSelectorText>{mappedValuesIndex + 1}/{mappedValues.length}</styled.PageSelectorText>
						<styled.PageSelectorButton className="fas fa-chevron-right"
												   onClick={() => {
													   if(mappedValuesIndex < mappedValues.length - 1) {
														   setMappedValuesIndex(mappedValuesIndex + 1)
													   }

												   }}
						/>
					</styled.PageSelector>
					}
				</styled.Footer>
			</styled.StyledForm>
		)
	}

	if(loaded) {

		return(
			<>
				{showCreationStatus &&
				<StatusList
					onItemClick={(item) => {
						setMappedValuesIndex(item.index)
						setShowCreationStatus(false)
					}}
					onCloseClick={() => {
						setShowCreationStatus(false)
					}}
					onShowMapperClick={() => {
						setShowCreationStatus(false)
						setShowPasteMapper(true)
						setPasteMapperHidden(false)
					}}
					data={processedValues.map((currValue, currIndex) => {
						const {
							name
						} = currValue

						const wholeVal = mappedValues[currIndex]

						const {
							_id
						} = wholeVal

						return {
							...currValue,
							title: name,
							created: !!_id
						}
					})}

				/>
				}
				{showPasteMapper &&
					<PasteForm
						hidden={pasteMapperHidden}
						reset={resetPasteTable}
						availableFieldNames={[
							...fieldNameArr,
							// ...REQUIRED_FIELDS,
							{
								...NAME_FIELD,
								displayName: getDisplayName(lotTemplate, "name", DEFAULT_NAME_DISPLAY_NAME)
							},
							{
								...COUNT_FIELD,
								displayName: getDisplayName(lotTemplate, "count", DEFAULT_COUNT_DISPLAY_NAME)
							}
						]}
						onCancel={() => {
							setShowPasteMapper(false)
							setPasteMapperHidden(true)
						}}
						table={pasteTable}
						onPreviewClick={(payload) => {
							// setShowPasteMapper(false)
							setShowProcessSelector(true)
							setMappedValues(payload)
							setMappedValuesIndex(0)
							setPasteMapperHidden(true)
						}}
						onCreateClick={(payload) => {
							// setShowPasteMapper(false)
							setMappedValues(payload)
							setMappedValuesIndex(0)
							setCreateMappedValues(true)
							setPasteMapperHidden(true)
						}}
					/>
				}
				{showSimpleModal &&
				<SimpleModal
					isOpen={true}
					title={"Paste Event Detected"}
					onRequestClose={() => setShowSimpleModal(false)}
					onCloseButtonClick={() => setShowSimpleModal(false)}
					handleOnClick1={() => {
						setShowPasteMapper(true)
						setPasteMapperHidden(false)
						setShowSimpleModal(false)


						setResetPasteTable(true)
						setTimeout(() => {
							setResetPasteTable(false)
						}, 250)
						setClickedNoPaste(false)

						// setPasteTable([])
						// setPasteTable([])
						// setPasteTable(tempPasteTable)
						// setTempPasteTable([])
					}}
					handleOnClick2={() => {
						setShowSimpleModal(false)
						setClickedNoPaste(true)
					}}
					button_1_text={"Yes"}
					button_2_text={"No"}

				>
					<styled.SimpleModalText>A paste event was detected. Would you like to use pasted data to create lots?</styled.SimpleModalText>
				</SimpleModal>
				}
				{!(showCreationStatus) && (pasteMapperHidden) && renderForm()}
				<SubmitErrorHandler
					submitCount={submitCount}
					isValid={formikProps.isValid}
					onSubmitError={() => {}}
					formik={formikProps}
				/>
			</>
		)
	}
	else {
		return(
			<FadeLoader
				css={styled.FadeLoaderCSS}
				height={5}
				width={3}
				loading={true}
			/>
		)
	}

}



// overwrite default button text color since it's hard to see on the lots background color
// const buttonStyle = {color: "black"}
const buttonStyle = {marginBottom: '0rem', marginTop: 0}


const LotEditor = (props) => {

	const {
		isOpen,
		close,
		processId,
		processOptions,
		showProcessSelector,
		initialValues
	} = props

	// redux state
	const cards = useSelector(state => { return state.cardsReducer.cards })
	const selectedLotTemplatesId = useSelector(state => {return state.lotTemplatesReducer.selectedLotTemplatesId})
	const lotTemplates = useSelector(state => {return state.lotTemplatesReducer.lotTemplates}) || {}


	// actions
	const dispatch = useDispatch()
	const onPostCard = async (card) => await dispatch(postCard(card))
	const onGetCard = async (cardId) => await dispatch(getCard(cardId))
	const onPutCard = async (card, ID) => await dispatch(putCard(card, ID))
	const onDeleteCard = async (cardId, processId) => await dispatch(deleteCard(cardId, processId))
	const dispatchGetLotTemplates = async () => await dispatch(getLotTemplates())
	const dispatchSetSelectedLotTemplate = (id) => dispatch(setSelectedLotTemplate(id))

	// component state
	const [cardId, setCardId] = useState(props.cardId) //cardId and binId are stored as internal state but initialized from props (if provided)
	const [binId, setBinId] = useState(props.binId)
	const [content, setContent] = useState(null)
	const [loaded, setLoaded] = useState(false)
	const [formMode, setFormMode] = useState(props.cardId ? FORM_MODES.UPDATE : FORM_MODES.CREATE) // if cardId was passed, update existing. Otherwise create new
	const [showLotTemplateEditor, setShowLotTemplateEditor] = useState(false)
	const [cardNames, setCardNames] = useState([])
	const [collectionCount, setCollectionCount] = useState(null)


	const getCount =  async () => {
		const count = await getCardsCount()
		setCollectionCount(count)
	}

	useEffect(() => {
		getCount()

	}, [])

	// get card object from redux by cardId
	const card = cards[cardId] || null
	const [lotNumber, setLotNumber] = useState((card && card.lotNumber !== null) ? card.lotNumber : collectionCount)
	let lotTemplateId = selectedLotTemplatesId  // set template id to selected template from redux - set by sidebar when you pick a template

	// if a template isn't provided by redux, check if card has template id
	if(!lotTemplateId && isObject(card) && card?.lotTemplateId) {
		lotTemplateId = card?.lotTemplateId
	}

	if(!lotTemplateId) lotTemplateId = BASIC_LOT_TEMPLATE_ID
	let lotTemplate = lotTemplates[lotTemplateId]  || BASIC_LOT_TEMPLATE
	if(!lotTemplates[lotTemplateId]) {
		lotTemplateId = BASIC_LOT_TEMPLATE_ID
		lotTemplate = BASIC_LOT_TEMPLATE
	}

	// extract card attributes
	const {
		bins = {}
	} = card || {}

	/*
	*
	* */
	const handleDeleteClick = async (selectedBin) => {
		const {
			[selectedBin]: currentBin,
			...remainingBins
		} = bins

		var submitItem = {
			...card,
			bins: {...remainingBins},
		}

		let requestSuccessStatus = false

		// if there are no remaining bins, delete the card
		if(isEmpty(remainingBins)) {
			onDeleteCard(cardId, processId)
		}

		// otherwise update the card to contain only the remaining bins
		else {
			const result = await onPutCard(submitItem, cardId)

			// check if request was successful
			if(!(result instanceof Error)) {
				requestSuccessStatus = true
			}
		}

		close()
	}

	/*
	*
	* */
	const handleGetCard = async (cardId) => {
		if(cardId) {
			const result = await onGetCard(cardId)
		}
		// if(!loaded) {
		// 	setLoaded(true)
		// }
	}


	useEffect(() => {
		let tempCardNames = []

		Object.values(cards).forEach((currCard, currCardIndex) => {
			const {
				name,
				_id: currLotId
			} = currCard || {}

			tempCardNames.push({name, id: currLotId})
		})

		setCardNames(tempCardNames)
	}, [cards])

	useEffect(() => {
		setLotNumber((card && card.lotNumber !== null) ? card.lotNumber : collectionCount)
	}, [card, collectionCount])


	/*
	*
	* */
	useEffect( () => {
		handleGetCard(cardId)
		var timer = setInterval(()=> {
			handleGetCard(cardId)
			dispatchGetLotTemplates()
		},5000)

		return () => {
			clearInterval(timer)
		}

	}, [cardId])

	/*
	* if card exists, set form mode to update
	* */
	useEffect( () => {

		if(collectionCount !== null) {
			// editing existing card
			if(cardId) {
				if(card) {

					// if card has template, template and card must be loaded
					if(card?.lotTemplateId) {
						if(lotTemplate && !loaded) {
							setLoaded(true)
						}
					}

					// No template, only need card to set loaded
					else if(!loaded) {
						setLoaded(true) // if card already exists, set loaded to true
					}
				}

			}

			// creating new, set loaded to true
			else {
				if(!loaded) setLoaded(true)
			}
		}

	}, [card, lotTemplate, lotTemplateId, collectionCount])

	useEffect( () => {
		dispatchGetLotTemplates()
		dispatchSetSelectedLotTemplate(null)

		return () => {
			close()
		}

	}, [])



	if(loaded) {
		return(
			<>
				{showLotTemplateEditor &&
				<LotCreatorForm
					isOpen={true}
					onAfterOpen={null}
					lotTemplateId={selectedLotTemplatesId}
					close={()=>{
						setShowLotTemplateEditor(false)
					}}
				/>
				}
				<styled.Container
					isOpen={isOpen}
					onRequestClose={()=> {
						close()

					}}
					contentLabel="Lot Editor Form"
					style={{
						overlay: {
							zIndex: 500
						},
						content: {

						}
					}}
				>
					<Formik
						initialValues={{
							_id: card ? card._id : null,
							processId: processId,
							moveCount: 0,
							moveLocation: [],
							name: card ? card.name : ``,
							bins: card && card.bins ?
								card.bins
								:
								defaultBins,
							[lotTemplateId]: {
								...getInitialValues(lotTemplate, card)
							},
							cardNames
						}}

						// validation control
						validationSchema={getCardSchema((content === CONTENT.MOVE) ? CARD_SCHEMA_MODES.MOVE_LOT : CARD_SCHEMA_MODES.EDIT_LOT, bins[binId]?.count ? bins[binId].count : 0)}
						validateOnChange={true}

						validateOnMount={false} // leave false, if set to true it will generate a form error when new data is fetched
						validateOnBlur={true}
						onSubmit={()=>{}} // this is necessary

						// enableReinitialize={true} // leave false, otherwise values will be reset when new data is fetched for editing an existing item
					>
						{formikProps => {
							const {
								setSubmitting,
								setTouched,
								resetForm,
								setFieldValue,
								validateForm,
								setErrors,
								submitForm

							} = formikProps

							const handleSubmit = async (values, buttonType) => {
								setSubmitting(true)
								await submitForm()

								const submissionErrors = await validateForm()

								// abort if there are errors
								if(!isEmpty(submissionErrors)) {
									setSubmitting(false)
									return false
								}


								let requestResult

								const {
									_id,
									name,
									changed,
									new: isNew,
									bins,
									moveCount,
									moveLocation,
									processId: selectedProcessId,
									[lotTemplateId]: templateValues,
								} = values || {}




								if(content === CONTENT.MOVE) {
									// moving card need to update count for correct bins
									if(moveCount && moveLocation) {

										var submitItem = {
											name,
											bins,
											lotNumber,
											flags: isObject(card) ? (card.flags || []) : [],
											process_id: card.process_id,
											lotTemplateId,
											...templateValues
										}

										/*
										* if lot items are being moved to a different bin, the submitItem's bins key needs to be updated
										* namely, the count field for the destination and origin bins needs to updated
										*
										* The destination bin's count should be incremented by the number of items being moved
										* The current bin's count should be decremented by the number of items being moved
										*
										* */

										// get count and location info for move from form values
										const {
											name: moveName,
											_id: destinationBinId,
										} = moveLocation[0]

										// extract destination, current, and remaining bins
										const {
											[destinationBinId]: destinationBin,
											[binId]: currentBin,
											...unalteredBins
										} = bins

										// update counts of current and destination bins
										const currentBinCount = parseInt(currentBin ? currentBin.count : 0) - moveCount
										const destinationBinCount = parseInt(destinationBin ? destinationBin.count : 0) + moveCount

										// update bins
										var updatedBins

										if(currentBinCount) {
											// both the current bin and the destination bin have items, so update both lots and spread the remaining

											updatedBins = {
												...unalteredBins, 			// spread remaining bins
												[destinationBinId]: {		// update destination bin's count, keep remaining attributes
													...destinationBin,
													count: destinationBinCount
												},
												[binId]: {			// update current bin's count, keep remaining attributes
													...currentBin,
													count: currentBinCount
												}
											}
										}

										else {
											// if currentBinCount is 0, the bin no longer has any items associated with the lot, so remove it
											updatedBins = {
												...unalteredBins,
												[destinationBinId]: {
													...destinationBin,
													count: destinationBinCount
												}
											}
										}

										// update submit items bins
										submitItem = {
											...submitItem,
											bins: updatedBins
										}

										// update card
										requestResult = onPutCard(submitItem, cardId)

									}
								}

								else {
									// update (PUT)
									if(formMode === FORM_MODES.UPDATE) {

										var submitItem = {
											name,
											bins,
											flags: isObject(card) ? (card.flags || []) : [],
											process_id: card.process_id,
											lotTemplateId,
											...templateValues,
											lotNumber
										}

										requestResult = onPutCard(submitItem, cardId)
									}

									// create (POST)
									else {

										const submitItem = {
											name,
											bins,
											flags: [],
											process_id: processId ? processId : selectedProcessId,
											lotTemplateId,
											...templateValues,
											lotNumber
										}

										requestResult = await onPostCard(submitItem)


										if(!(requestResult instanceof Error)) {
											const {
												_id = null
											} = requestResult || {}

											setFieldValue("_id", _id)
										}
										else {
											console.error("requestResult error",requestResult)
										}

									}

								}

								setTouched({}) // after submitting, set touched to empty to reflect that there are currently no new changes to save
								setSubmitting(false)

								switch(buttonType) {
									case FORM_BUTTON_TYPES.ADD:
										resetForm()
										close()
										break
									case FORM_BUTTON_TYPES.MOVE_OK:
										resetForm()
										close()
										break
									case FORM_BUTTON_TYPES.ADD_AND_NEXT:
										resetForm()
										break
									case FORM_BUTTON_TYPES.SAVE:
										close()
										break
									default:
										break
								}

								return requestResult
								// return true
							}

							return (
								<FormComponent
									lotNumber={lotNumber}
									cardNames={cardNames}
									collectionCount={collectionCount}
									onSubmit={handleSubmit}
									setShowLotTemplateEditor={setShowLotTemplateEditor}
									showLotTemplateEditor={showLotTemplateEditor}
									lotTemplate={lotTemplate}
									lotTemplateId={lotTemplateId}
									loaded={loaded}
									processId={processId}
									close={close}
									formMode={formMode}
									{...formikProps}
									card={card}
									bins={bins}
									binId={binId}
									setBinId={setBinId}
									cardId={cardId}
									isOpen={isOpen}
									onDeleteClick={handleDeleteClick}
									formikProps={formikProps}
									processOptions={processOptions}
									showProcessSelector={showProcessSelector}
									content={content}
									setContent={setContent}
									card={card}
								/>
							)
						}}
					</Formik>
				</styled.Container>
			</>
		)
	}

	// if not done loading data, show loader icon
	else {
		return (
			<FadeLoader
				css={styled.FadeLoaderCSS}
				height={5}
				width={3}
				loading={true}
			/>
		)
	}


}

// Specifies propTypes
LotEditor.propTypes = {
	binId: PropTypes.string,
	showProcessSelector: PropTypes.bool,
};

// Specifies the default values for props:
LotEditor.defaultProps = {
	binId: "QUEUE",
	showProcessSelector: false,
	providedValues: []
};

export default LotEditor