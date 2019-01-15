'use strict';

const AWS = require('aws-sdk');
const UUID = require('uuid/v4');
AWS.config.update({ region: 'us-east-1' });

let dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * GET all time entries
 * 
 * @param {Object} request 
 */
const getAllTimeEntries = (request) => {
    var params = {
        TableName: 'time-entries',
        ScanIndexForward: false,
        IndexName: 'user_id-start_time-index'
    };

    return dynamoDb.scan(params).promise().then(response => response.Items);
}

/**
 * GET the specified user time entries sorted by the most recent
 * 
 * @param {Object} request 
 */
const getTimeEntriesByUserId = (request) => {
    var params = {
        TableName: 'time-entries',
        ScanIndexForward: false,
        IndexName: 'user_id-start_time-index',
        KeyConditionExpression: "user_id = :uid",
        ExpressionAttributeValues: {
            ":uid": request.pathParams.id,
        }
    };
    return dynamoDb.query(params).promise().then(response => response.Items);
}

/**
 * Create a new time entry
 * {
 *      "task_id":null,
 *      "description":"First task",
 *      "start":"2019-01-12T16:37:20",
 *      "duration":null,
 *      “user_id”:"1",
 *      "project_id":null
 *  }
 * @param {Object} request 
 */
const createTimeEntry = (request) => {
    if (request.body.start == null || request.body.start === "")
        throw Error('{"error":"A start date must be specified"}');
    if (request.body.user_id == null || request.body.user_id === "")
        throw Error('{"error":"A user id be must be specified"}');
    if ((request.body.duration == null && request.body.stop != null)
        || (request.body.stop == null && request.body.duration != null))
        throw Error('{"error":"You must specify both stop time and duration or neither"}');

    var params = {
        TableName: 'time-entries',
        Item: {
            id: UUID(),
            description: request.body.description, // task description, can be null
            start_time: new Date(request.body.start).getTime(), //The date is transformed to a number as a sorting method
            start: request.body.start,
            stop: request.body.stop,
            duration: request.body.duration,
            task_id: request.body.task_id,
            user_id: request.body.user_id,
            project_id: request.body.project_id
        }
    };
    return dynamoDb.put(params).promise(); // returns dynamo result 
};

/**
 * update the specified time entry in the query string
 * {
 *      "task_id":null,
 *      "description":"First task",
 *      "stop":"2019-01-12T16:37:20",
 *      "project_id":null
 *  }
 * @param {Object} request 
 */
const updateTimeEntryById = (request) => {
    if (request.pathParams.id == null || request.pathParams.id === "")
        throw Error('{"error":"A time entry id be must be specified"}');
    if ((request.body.duration == null && request.body.stop != null)
        || (request.body.stop == null && request.body.duration != null))
        throw Error('{"error":"You must specify both stop time and duration or neither"}');
    var params = {
        TableName: "time-entries",
        Key: {
            "id": request.pathParams.id
        },
        UpdateExpression: "set description = :d, stop=:s, #dt=:du, task_id=:t, project_id=:p",
        ExpressionAttributeValues: {
            ":d": request.body.description,
            ":s": request.body.stop,
            ":du": request.body.duration,
            ":t": request.body.task_id,
            ":p": request.body.project_id
        },
        ExpressionAttributeNames: {
            "#dt": "duration"
        },
        ReturnValues: "UPDATED_NEW"
    };
    return dynamoDb.update(params).promise().then(response => response.Items);
}

module.exports = {
    getAllTimeEntries,
    getTimeEntriesByUserId,
    createTimeEntry,
    updateTimeEntryById
}
