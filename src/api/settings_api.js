/**
 * All of the API calls for Settings
 * 
 * Created: ?
 * Created by: ?
 * 
 * Edited: March 18 20201
 * Edited by: Daniel Castillo
 * 
 *  NEEDS TO BE FIXED
 *  WORKS FOR NOW
 * 
 * Add flow for when there are no settings
 * 
 */

// logging for error in API
import errorLog from './errorLogging'

// import the API category from Amplify library
import { API } from 'aws-amplify'

import getUserOrgId from './user_api'

// import the GraphQL queries, mutations and subscriptions
import { settingsByOrgId } from '../graphql/queries';
import { createSettings, updateSettings } from '../graphql/mutations';

export async function getSettings() {
    try {

        const userOrgId = await getUserOrgId()

        const res = await API.graphql({
            query: settingsByOrgId,
            variables: { organizationId: userOrgId }
        })

        let settings = res.data.SettingsByOrgId.items[0]

        if(settings !== undefined){
            let GQLdata = {
                ...settings,
                loggers: JSON.parse(settings.loggers),
                shiftDetails: JSON.parse(settings.shiftDetails),
                timezone: JSON.parse(settings.timezone)
            }
            
            return GQLdata;
        }else{
            return null
        }
    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function postSettings(settings) {
    try {

        const input = {
            ...settings,
            loggers: JSON.stringify(settings.loggers),
            shiftDetails: JSON.stringify(settings.shiftDetails),
            timezone: JSON.stringify(settings.timezone)
        }

        delete input.createdAt
        delete input.updatedAt

        let dataJson = await API.graphql({
            query: createSettings,
            variables: { input: input }
        })

        return dataJson.data.createSettings;
    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}

export async function putSettings(settings) {
    try {

        const userOrgId = await getUserOrgId()

        const settingsStuff = await getSettings()

        if(settingsStuff !== null){

            let input

            if(settings.id){
                input = {
                    ...settings,
                    organizationId: userOrgId,
                    loggers: JSON.stringify(settings.loggers),
                    shiftDetails: JSON.stringify(settings.shiftDetails),
                    timezone: JSON.stringify(settings.timezone)
                }    
            }else{
                input = {
                    ...settingsStuff,
                    organizationId: userOrgId,
                    loggers: JSON.stringify(settingsStuff.loggers),
                    shiftDetails: JSON.stringify(settingsStuff.shiftDetails),
                    timezone: JSON.stringify(settingsStuff.timezone)
                }    
            }

            delete input.createdAt
            delete input.updatedAt

            let dataJson = await API.graphql({
                query: updateSettings,
                variables: { input: input }
            })

            return dataJson.data.updateSettings;

        }else{
            postSettings({
                ...settings,
                organizationId: userOrgId
            })
        }
    } catch (error) {
        // Error 😨
        errorLog(error)
    }
}
