'use strict';

const ApiBuilder = require('claudia-api-builder');
const TimeEntries = require('./model/timeEntries');
const Projects = require('./model/projects');

let api = new ApiBuilder();

/* Time entries routes */
api.get('/v1/user/{id}/time-entries', TimeEntries.getTimeEntriesByUserId);

api.get('/v1/time-entries', TimeEntries.getAllTimeEntries);
api.post('/v1/time-entries', TimeEntries.createTimeEntry, { success: 201 }); // returns HTTP status 201 - Created if successful
api.put('/v1/time-entries/{id}', TimeEntries.updateTimeEntryById, { success: 200 }); // returns HTTP status 201 - Created if successful

/* Projects routes */
api.post('/v1/projects', Projects.createProject, { success: 201 }); // returns HTTP status 201 - Created if successful
api.get('/v1/user/{id}/projects', Projects.getProjectsByUserId);
api.get('/v1/projects', Projects.getAllProjects);

module.exports = api;