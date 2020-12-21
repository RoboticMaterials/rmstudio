import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom";

import * as styled from './processes_content.style'

// Import basic components
import ContentHeader from '../content_header/content_header'
import Textbox from '../../../basic/textbox/textbox.js'
import Button from '../../../basic/button/button'
import DropDownSearch from '../../../basic/drop_down_search_v2/drop_down_search'
import TextBoxSearch from '../../../basic/textbox_search/textbox_search'

import ContentList from '../content_list/content_list'
import EditProcess from './edit_process/edit_process'

// Import actions
import * as taskActions from '../../../../redux/actions/tasks_actions'
import { setSelectedProcess, editingProcess } from '../../../../redux/actions/processes_actions'
import * as dashboardActions from '../../../../redux/actions/dashboards_actions'
import * as objectActions from '../../../../redux/actions/objects_actions'
import { postTaskQueue } from '../../../../redux/actions/task_queue_actions'

// Import Utils
import { deepCopy } from '../../../../methods/utils/utils'
import { isBrokenProcess } from '../../../../methods/utils/processes_utils'

import uuid from 'uuid'
import {uuidv4} from "../../../../methods/utils/utils";

const ProcessesContent = () => {

    const history = useHistory()

    const dispatch = useDispatch()
    const onPostTaskQueue = (ID) => dispatch(postTaskQueue(ID))
    const onSetSelectedProcess = (process) => dispatch(setSelectedProcess(process))
    const onEditing = (props) => dispatch(editingProcess(props))

    let tasks = useSelector(state => state.tasksReducer.tasks)
    let selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const selectedProcess = useSelector(state => state.processesReducer.selectedProcess)
    const processes = useSelector(state => state.processesReducer.processes)
    const editing = useSelector(state => state.processesReducer.editingProcess)

    // State definitions
    //const [editing, toggleEditing] = useState(false)    // Is a task being edited? Otherwise, list view
    const [selectedProcessCopy, setSelectedProcessCopy] = useState(null)  // Current task
    const [shift, setShift] = useState(false) // Is shift key pressed ?
    const [isTransportTask, setIsTransportTask] = useState(true)


    useEffect(() => {
        Object.values(processes).map((process) => {
            isBrokenProcess(process, tasks)
        })
        return () => {
            onSetSelectedProcess(null)
        }
    }, [])


    const onCardView = (element) => {
        const currentPath = history.location.pathname
        history.push(currentPath + '/' + element._id + "/card")
    }

    if (editing && selectedProcess !== null) { // Editing Mode
        return (
            <EditProcess
                selectedProcessCopy={selectedProcessCopy}
                setSelectedProcessCopy={props => setSelectedProcessCopy(props)}
                toggleEditingProcess={props => onEditing(props)}
            />
        )
    } else {    // List Mode
        return (
            <ContentList
                title={'Processes'}
                schema={'processes'}
                // elements={Object.values(tasks)}
                elements={Object.values(processes)}
                onMouseEnter={(process) => onSetSelectedProcess(process)}
                onMouseLeave={() => onSetSelectedProcess(null)}
                handleCardView={(element) => onCardView(element)}
                onClick={(process) => {
                    // If task button is clicked, start editing it
                    setSelectedProcessCopy(deepCopy(process))
                    onSetSelectedProcess(process)
                    onEditing(true)
                }}
                onPlus={() => {
                    const newProcess = {
                        name: '',
                        _id: uuid.v4(),
                        new: true,
                        routes: [],
                    }
                    // TODO: May have to do this with processes
                    // dispatch(taskActions.addTask(newTask))
                    onSetSelectedProcess(newProcess)
                    setSelectedProcessCopy(deepCopy(newProcess))
                    onEditing(true)
                }}
            />
        )
    }
}

export default ProcessesContent
