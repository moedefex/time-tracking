'use strict';

const AWS = require('aws-sdk');
const UUID = require('uuid/v4');
AWS.config.update({region:'us-east-1'});

let dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * Create a new project indicating the user who created it
 * 
 * @param {Object} request 
 */
const createProject = (request) => {
    if (request.body.description == null || request.body.description === "")
        throw Error('{"error":"A description for the project must be specified"}');
    if (request.body.user_id == null || request.body.user_id === "")
        throw Error('{"error":"The user who is creating the project must be specified"}');
    var params = {
        TableName: 'projects',
        Item: {
            id: UUID(),
            description: request.body.description, // project description
            user_id: request.body.user_id //the user who created the project
        }
    };
    return dynamoDb.put(params).promise(); // returns dynamo result 
}

/**
 * GET all projects information
 * 
 * @param {Object} request 
 */
const getAllProjects = (request) => {
    return dynamoDb.scan({ TableName: 'projects' })
        .promise()
        .then(response => response.Items);
}

/**
 * GET the specified user time entries sorted by the most recent
 * 
 * @param {Object} request 
 */
const getProjectsByUserId = (request) => {
    var params = {
        IndexName: 'user_id-index',
        KeyConditionExpression: "user_id = :uid",
        TableName: 'projects',
        ExpressionAttributeValues: {
            ":uid": request.pathParams.id,
        }
    };
    return dynamoDb.query(params).promise().then(response => response.Items);
}

module.exports = {
    createProject,
    getProjectsByUserId,
    getAllProjects
}