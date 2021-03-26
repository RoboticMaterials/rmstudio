/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onDeltaStation = /* GraphQL */ `
  subscription OnDeltaStation($id: ID) {
    onDeltaStation(id: $id) {
      id
      _id
      organizationId
      name
      schema
      type
      pos_x
      pos_y
      rotation
      x
      y
      map_id
      children
      dashboards
      createdAt
      updatedAt
    }
  }
`;
export const onDeltaPosition = /* GraphQL */ `
  subscription OnDeltaPosition($id: ID) {
    onDeltaPosition(id: $id) {
      id
      _id
      organizationId
      change_key
      map_id
      name
      parent
      pos_x
      pos_y
      rotation
      schema
      type
      x
      y
      createdAt
      updatedAt
    }
  }
`;
export const onDeltaTask = /* GraphQL */ `
  subscription OnDeltaTask($id: ID) {
    onDeltaTask(id: $id) {
      id
      _id
      organizationId
      device_types
      handoff
      load
      map_id
      name
      processes
      quantity
      track_quantity
      type
      unload
      obj
      route_object
      createdAt
      updatedAt
    }
  }
`;
export const onDeltaProcess = /* GraphQL */ `
  subscription OnDeltaProcess($id: ID) {
    onDeltaProcess(id: $id) {
      id
      _id
      organizationId
      name
      broken
      routes
      map_id
      createdAt
      updatedAt
    }
  }
`;
export const onDeltaObject = /* GraphQL */ `
  subscription OnDeltaObject($id: ID) {
    onDeltaObject(id: $id) {
      id
      _id
      organizationId
      description
      map_id
      modelName
      name
      dimensions
      quantity
      createdAt
      updatedAt
    }
  }
`;
export const onDeltaCard = /* GraphQL */ `
  subscription OnDeltaCard($id: ID) {
    onDeltaCard(id: $id) {
      id
      _id
      organizationId
      bins
      dates
      description
      flags
      lotNumber
      lotTemplateId
      name
      process_id
      totalQuantity
      processName
      count
      createdAt
      updatedAt
    }
  }
`;
export const onDeltaDevice = /* GraphQL */ `
  subscription OnDeltaDevice($id: ID) {
    onDeltaDevice(id: $id) {
      id
      _id
      organizationId
      battery_percentage
      connected
      current_task_queue_id
      dashboards
      device_model
      device_name
      distance_to_next_target
      idle_location
      map_id
      position
      shelf_attached
      state_text
      createdAt
      updatedAt
    }
  }
`;
export const onDeltaStatus = /* GraphQL */ `
  subscription OnDeltaStatus($id: ID) {
    onDeltaStatus(id: $id) {
      id
      _id
      organizationId
      active_map
      mir_connection
      pause_status
      createdAt
      updatedAt
    }
  }
`;
export const onDeltaTaskQueue = /* GraphQL */ `
  subscription OnDeltaTaskQueue($id: ID) {
    onDeltaTaskQueue(id: $id) {
      id
      _id
      organizationId
      device_type
      mission_status
      owner
      task_id
      custom_task
      dashboard
      showModal
      hil_response
      quantity
      lot_id
      start_time
      end_time
      hil_station_id
      hil_message
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
      id
      organizationId
      username
      organization {
        id
        organizationId
        name
        key
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
      id
      organizationId
      username
      organization {
        id
        organizationId
        name
        key
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
      id
      organizationId
      username
      organization {
        id
        organizationId
        name
        key
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateOrganization = /* GraphQL */ `
  subscription OnCreateOrganization {
    onCreateOrganization {
      id
      organizationId
      name
      key
      users {
        nextToken
      }
      stations {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateOrganization = /* GraphQL */ `
  subscription OnUpdateOrganization {
    onUpdateOrganization {
      id
      organizationId
      name
      key
      users {
        nextToken
      }
      stations {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteOrganization = /* GraphQL */ `
  subscription OnDeleteOrganization {
    onDeleteOrganization {
      id
      organizationId
      name
      key
      users {
        nextToken
      }
      stations {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateStation = /* GraphQL */ `
  subscription OnCreateStation {
    onCreateStation {
      id
      _id
      organizationId
      name
      schema
      type
      pos_x
      pos_y
      rotation
      x
      y
      map_id
      children
      dashboards
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateStation = /* GraphQL */ `
  subscription OnUpdateStation {
    onUpdateStation {
      id
      _id
      organizationId
      name
      schema
      type
      pos_x
      pos_y
      rotation
      x
      y
      map_id
      children
      dashboards
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteStation = /* GraphQL */ `
  subscription OnDeleteStation {
    onDeleteStation {
      id
      _id
      organizationId
      name
      schema
      type
      pos_x
      pos_y
      rotation
      x
      y
      map_id
      children
      dashboards
      createdAt
      updatedAt
    }
  }
`;
export const onCreatePosition = /* GraphQL */ `
  subscription OnCreatePosition {
    onCreatePosition {
      id
      _id
      organizationId
      change_key
      map_id
      name
      parent
      pos_x
      pos_y
      rotation
      schema
      type
      x
      y
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePosition = /* GraphQL */ `
  subscription OnUpdatePosition {
    onUpdatePosition {
      id
      _id
      organizationId
      change_key
      map_id
      name
      parent
      pos_x
      pos_y
      rotation
      schema
      type
      x
      y
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePosition = /* GraphQL */ `
  subscription OnDeletePosition {
    onDeletePosition {
      id
      _id
      organizationId
      change_key
      map_id
      name
      parent
      pos_x
      pos_y
      rotation
      schema
      type
      x
      y
      createdAt
      updatedAt
    }
  }
`;
export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask {
    onCreateTask {
      id
      _id
      organizationId
      device_types
      handoff
      load
      map_id
      name
      processes
      quantity
      track_quantity
      type
      unload
      obj
      route_object
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTask = /* GraphQL */ `
  subscription OnUpdateTask {
    onUpdateTask {
      id
      _id
      organizationId
      device_types
      handoff
      load
      map_id
      name
      processes
      quantity
      track_quantity
      type
      unload
      obj
      route_object
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTask = /* GraphQL */ `
  subscription OnDeleteTask {
    onDeleteTask {
      id
      _id
      organizationId
      device_types
      handoff
      load
      map_id
      name
      processes
      quantity
      track_quantity
      type
      unload
      obj
      route_object
      createdAt
      updatedAt
    }
  }
`;
export const onCreateProcess = /* GraphQL */ `
  subscription OnCreateProcess {
    onCreateProcess {
      id
      _id
      organizationId
      name
      broken
      routes
      map_id
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateProcess = /* GraphQL */ `
  subscription OnUpdateProcess {
    onUpdateProcess {
      id
      _id
      organizationId
      name
      broken
      routes
      map_id
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteProcess = /* GraphQL */ `
  subscription OnDeleteProcess {
    onDeleteProcess {
      id
      _id
      organizationId
      name
      broken
      routes
      map_id
      createdAt
      updatedAt
    }
  }
`;
export const onCreateObject = /* GraphQL */ `
  subscription OnCreateObject {
    onCreateObject {
      id
      _id
      organizationId
      description
      map_id
      modelName
      name
      dimensions
      quantity
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateObject = /* GraphQL */ `
  subscription OnUpdateObject {
    onUpdateObject {
      id
      _id
      organizationId
      description
      map_id
      modelName
      name
      dimensions
      quantity
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteObject = /* GraphQL */ `
  subscription OnDeleteObject {
    onDeleteObject {
      id
      _id
      organizationId
      description
      map_id
      modelName
      name
      dimensions
      quantity
      createdAt
      updatedAt
    }
  }
`;
export const onCreateCard = /* GraphQL */ `
  subscription OnCreateCard {
    onCreateCard {
      id
      _id
      organizationId
      bins
      dates
      description
      flags
      lotNumber
      lotTemplateId
      name
      process_id
      totalQuantity
      processName
      count
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateCard = /* GraphQL */ `
  subscription OnUpdateCard {
    onUpdateCard {
      id
      _id
      organizationId
      bins
      dates
      description
      flags
      lotNumber
      lotTemplateId
      name
      process_id
      totalQuantity
      processName
      count
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteCard = /* GraphQL */ `
  subscription OnDeleteCard {
    onDeleteCard {
      id
      _id
      organizationId
      bins
      dates
      description
      flags
      lotNumber
      lotTemplateId
      name
      process_id
      totalQuantity
      processName
      count
      createdAt
      updatedAt
    }
  }
`;
export const onCreateSettings = /* GraphQL */ `
  subscription OnCreateSettings {
    onCreateSettings {
      id
      _id
      organizationId
      MiRMapEnabled
      accessToken
      authenticated
      currentMapId
      deviceEnabled
      loggers
      mapViewEnabled
      non_local_api
      non_local_api_ip
      refreshToken
      shiftDetails
      toggleDevOptions
      timezone
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateSettings = /* GraphQL */ `
  subscription OnUpdateSettings {
    onUpdateSettings {
      id
      _id
      organizationId
      MiRMapEnabled
      accessToken
      authenticated
      currentMapId
      deviceEnabled
      loggers
      mapViewEnabled
      non_local_api
      non_local_api_ip
      refreshToken
      shiftDetails
      toggleDevOptions
      timezone
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteSettings = /* GraphQL */ `
  subscription OnDeleteSettings {
    onDeleteSettings {
      id
      _id
      organizationId
      MiRMapEnabled
      accessToken
      authenticated
      currentMapId
      deviceEnabled
      loggers
      mapViewEnabled
      non_local_api
      non_local_api_ip
      refreshToken
      shiftDetails
      toggleDevOptions
      timezone
      createdAt
      updatedAt
    }
  }
`;
export const onCreateLotTemplate = /* GraphQL */ `
  subscription OnCreateLotTemplate {
    onCreateLotTemplate {
      id
      _id
      organizationId
      name
      displayNames
      fields
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateLotTemplate = /* GraphQL */ `
  subscription OnUpdateLotTemplate {
    onUpdateLotTemplate {
      id
      _id
      organizationId
      name
      displayNames
      fields
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteLotTemplate = /* GraphQL */ `
  subscription OnDeleteLotTemplate {
    onDeleteLotTemplate {
      id
      _id
      organizationId
      name
      displayNames
      fields
      createdAt
      updatedAt
    }
  }
`;
export const onCreateDevice = /* GraphQL */ `
  subscription OnCreateDevice {
    onCreateDevice {
      id
      _id
      organizationId
      battery_percentage
      connected
      current_task_queue_id
      dashboards
      device_model
      device_name
      distance_to_next_target
      idle_location
      map_id
      position
      shelf_attached
      state_text
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateDevice = /* GraphQL */ `
  subscription OnUpdateDevice {
    onUpdateDevice {
      id
      _id
      organizationId
      battery_percentage
      connected
      current_task_queue_id
      dashboards
      device_model
      device_name
      distance_to_next_target
      idle_location
      map_id
      position
      shelf_attached
      state_text
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteDevice = /* GraphQL */ `
  subscription OnDeleteDevice {
    onDeleteDevice {
      id
      _id
      organizationId
      battery_percentage
      connected
      current_task_queue_id
      dashboards
      device_model
      device_name
      distance_to_next_target
      idle_location
      map_id
      position
      shelf_attached
      state_text
      createdAt
      updatedAt
    }
  }
`;
export const onCreateStatus = /* GraphQL */ `
  subscription OnCreateStatus {
    onCreateStatus {
      id
      _id
      organizationId
      active_map
      mir_connection
      pause_status
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateStatus = /* GraphQL */ `
  subscription OnUpdateStatus {
    onUpdateStatus {
      id
      _id
      organizationId
      active_map
      mir_connection
      pause_status
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteStatus = /* GraphQL */ `
  subscription OnDeleteStatus {
    onDeleteStatus {
      id
      _id
      organizationId
      active_map
      mir_connection
      pause_status
      createdAt
      updatedAt
    }
  }
`;
export const onCreateTaskQueue = /* GraphQL */ `
  subscription OnCreateTaskQueue {
    onCreateTaskQueue {
      id
      _id
      organizationId
      device_type
      mission_status
      owner
      task_id
      custom_task
      dashboard
      showModal
      hil_response
      quantity
      lot_id
      start_time
      end_time
      hil_station_id
      hil_message
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTaskQueue = /* GraphQL */ `
  subscription OnUpdateTaskQueue {
    onUpdateTaskQueue {
      id
      _id
      organizationId
      device_type
      mission_status
      owner
      task_id
      custom_task
      dashboard
      showModal
      hil_response
      quantity
      lot_id
      start_time
      end_time
      hil_station_id
      hil_message
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTaskQueue = /* GraphQL */ `
  subscription OnDeleteTaskQueue {
    onDeleteTaskQueue {
      id
      _id
      organizationId
      device_type
      mission_status
      owner
      task_id
      custom_task
      dashboard
      showModal
      hil_response
      quantity
      lot_id
      start_time
      end_time
      hil_station_id
      hil_message
      createdAt
      updatedAt
    }
  }
`;
export const onCreateTaskQueueEvents = /* GraphQL */ `
  subscription OnCreateTaskQueueEvents {
    onCreateTaskQueueEvents {
      id
      _id
      organizationId
      device_type
      mission_status
      owner
      task_id
      custom_task
      dashboard
      showModal
      hil_response
      quantity
      lot_id
      start_time
      end_time
      hil_station_id
      hil_message
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTaskQueueEvents = /* GraphQL */ `
  subscription OnUpdateTaskQueueEvents {
    onUpdateTaskQueueEvents {
      id
      _id
      organizationId
      device_type
      mission_status
      owner
      task_id
      custom_task
      dashboard
      showModal
      hil_response
      quantity
      lot_id
      start_time
      end_time
      hil_station_id
      hil_message
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTaskQueueEvents = /* GraphQL */ `
  subscription OnDeleteTaskQueueEvents {
    onDeleteTaskQueueEvents {
      id
      _id
      organizationId
      device_type
      mission_status
      owner
      task_id
      custom_task
      dashboard
      showModal
      hil_response
      quantity
      lot_id
      start_time
      end_time
      hil_station_id
      hil_message
      createdAt
      updatedAt
    }
  }
`;
export const onCreateDashboard = /* GraphQL */ `
  subscription OnCreateDashboard {
    onCreateDashboard {
      id
      organizationId
      data
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateDashboard = /* GraphQL */ `
  subscription OnUpdateDashboard {
    onUpdateDashboard {
      id
      organizationId
      data
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteDashboard = /* GraphQL */ `
  subscription OnDeleteDashboard {
    onDeleteDashboard {
      id
      organizationId
      data
      createdAt
      updatedAt
    }
  }
`;
