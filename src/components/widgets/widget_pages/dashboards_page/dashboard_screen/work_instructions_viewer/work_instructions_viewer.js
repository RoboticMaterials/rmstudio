import React, { Component, useState, useEffect } from 'react';
import AWS from 'aws-sdk'

import { useSelector, useDispatch} from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { uuidv4 } from '../../../../../../methods/utils/utils';
import {putLotTemplate} from "../../../../../../redux/actions/lot_template_actions";

//3rd party libraries
import FileViewer from 'react-file-viewer'
import {Viewer, Worker} from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import ReactPlayer from 'react-player'
//S3 constants
const S3_BUCKET ='winstructions';
const REGION ='us-west-1';

//AWS config keys
AWS.config.update({
    accessKeyId: 'AKIAYKB6JQEJI3A35AFN',
    secretAccessKey: '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'
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

// Import Style
import * as styled from './work_instructions_viewer.style'
// Import Components
import Checkbox from '../../../../../../components/basic/checkbox/checkbox'
import Button from "../../../../../../components/basic/button/button";

const WorkInstructionsViewer = (props) => {

  const processes = useSelector(state => state.processesReducer.processes)
  const stations = useSelector(state => state.stationsReducer.stations)
  const lotTemplates = useSelector(state => {return state.lotTemplatesReducer.lotTemplates})

  const dispatch = useDispatch()
  const dispatchPutLotTemplate = async (lotTemplate, id) => await dispatch(putLotTemplate(lotTemplate, id))

  const [fileUrl, setFileUrl] = useState(null)
  const [file, setFile] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [fileType, setFileType] = useState(null)

  const {
    setShowWorkInstructionsViewer,
    showWorkInstructionsViewer,
    stationID,
    lotTemplateId
  } = props

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
  })

  useEffect(() => {

    if(!!lotTemplates[lotTemplateId].workInstructions && !!lotTemplates[lotTemplateId].workInstructions[stationID]){
      let key = lotTemplates[lotTemplateId].workInstructions[stationID]
      let arr = key.split('.')
      let type = arr[arr.length-1]
      setFileType(type)

      const params = {
          Bucket: S3_BUCKET,
          Key: key
      };

     const objects = myBucket
      .getObject(params, function(err, data){
        if(err)throw err
        let file, fileURL
        switch(type){
          case 'mp4':
           file = new Blob([data.Body], {type: 'video/mp4'})
          case 'png':
           file = new Blob([data.Body], {type: 'image/png'})
          case 'pdf':
           file = new Blob([data.Body], {type: 'application/pdf'})
        }
          fileURL = URL.createObjectURL(file)
          setFile(file)
          setFileUrl(fileURL)
      })
    }
  }, [showWorkInstructionsViewer])


  const onDocumentLoadSuccess = (numPages) => {
    setNumPages(numPages);
  }

  const renderWorkInstructions = () => {
    switch(fileType) {
      case 'mp4':
        return (
          <ReactPlayer
            url = {fileUrl}
            fluid = {false}
            controls = {true}
          />
        )
      case 'pdf':
        return (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
            <Viewer fileUrl = {fileUrl} plugins = {[defaultLayoutPluginInstance]}/>
          </Worker>
        )
    }
  }


  return (
        <styled.Container
            isOpen={showWorkInstructionsViewer}
            contentLabel="Kick Off Modal"
            style={{
                overlay: {
                    zIndex: 500,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                },
            }}
        >
            <styled.BodyContainer style = {{padding: '0rem', paddingLeft: '.7rem'}}>
                <styled.Title schema={'lots'}>{stations[stationID].name}</styled.Title>
                <styled.CloseButton
                    className={'fas fa-times'}
                    style={{ cursor: 'pointer', padding: '1rem'}}
                    onClick = {()=> {
                      setShowWorkInstructionsViewer(false)
                    }}
            />


            <div style = {{overflow: 'auto', height: '100%', maxWidth: '100%', justifyContent: 'center'}}>
            {!!fileUrl &&
              renderWorkInstructions()
            }
            </div>
            </styled.BodyContainer>
        </styled.Container>
    )
}

export default WorkInstructionsViewer
