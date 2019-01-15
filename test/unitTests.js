'use strict';
const { expect } = require('chai'),
    TimeEntries = require('../model/timeEntries'),
    Projects = require('../model/projects');

var time = new Date().toISOString();

describe('Time entries test', function () {
    it('Should list all time entries', function (done) {
        TimeEntries.getAllTimeEntries(
            {
                requestContext: {
                    resourcePath: '/v1/time-entries',
                    httpMethod: 'GET'
                }
            }
        )
            .then(result => {
                expect(result).to.be.an("Array");
                return done();
            })
            .catch(error => {
                return done(error);
            });
    });
    it('Should list all specified user\'s task sorted by most recent to the oldest', function (done) {
        TimeEntries.getTimeEntriesByUserId(
            {
                requestContext: {
                    resourcePath: '/v1/user/{id}/time-entries',
                    httpMethod: 'GET'
                },
                pathParams: {
                    id: '1'
                }
            })
            .then(result => {
                //expect(result).to.be.a("Array");
                expect(result).to.not.be.lengthOf(0);
                return done();
            })
            .catch(error => {
                return done(error);
            });
    });
    it('Specified user should not have time entries', function (done) {
        TimeEntries.getTimeEntriesByUserId(
            {
                requestContext: {
                    resourcePath: '/v1/user/{id}/time-entries',
                    httpMethod: 'GET'
                },
                pathParams: {
                    id: '-1'
                }
            }
        )
            .then(result => {
                expect(result).to.be.lengthOf(0);
                return done();
            })
            .catch(error => {
                return done(error);
            });
    });
    it('Should be able to create a time entry with no description', function (done) {
        TimeEntries.createTimeEntry(
            {
                requestContext: {
                    resourcePath: '/v1/time-entries',
                    httpMethod: 'POST'
                },
                body: {
                    "task_id": null,
                    "description": null,
                    "start": time,
                    "stop": null,
                    "duration": null,
                    "user_id": "1",
                    "project_id": null
                }
            }
        )
        .then(result => {
            expect(result).to.be.empty;
            return done();
        })
        .catch(error => {
            return done(error);
        });
    });
    it('Should be able to create a time entry manually (start-stop time and duration)', function (done) {
        TimeEntries.createTimeEntry(
            {
                requestContext: {
                    resourcePath: '/v1/time-entries',
                    httpMethod: 'POST'
                },
                body: {
                    "task_id": null,
                    "description": "Test task with start stop time " + time,
                    "start": time,
                    "stop": time,
                    "duration": 0,
                    "user_id": "1",
                    "project_id": null
                }
            }
        )
        .then(result => {
            expect(result).to.be.empty;
            return done();
        })
        .catch(error => {
            return done(error);
        });
    });
    it('Should be able to update a time entry for only project_id, stop, duration, description and task_id', function (done) {
        TimeEntries.createTimeEntry(
            {
                requestContext: {
                    resourcePath: '/v1/time-entries/{id}',
                    httpMethod: 'PUT'
                },
                body: {
                    "task_id": null,
                    "description": "Updated task from a test " + time,
                    "start": time,
                    "stop": time,
                    "duration": 0,
                    "user_id": "1",
                    "project_id": null
                },
                pathParams: {
                    id: '8fc93e10-8543-4b12-aa82-79a0f5d968f2'
                }
            }
        )
        .then(result => {
            expect(result).to.be.empty;
            return done();
        })
        .catch(error => {
            return done(error);
        });
    });

});

describe('Projects test', function () {
    it('Should be able to create a project', function (done) {
        Projects.createProject(
            {
                requestContext: {
                    resourcePath: '/v1/projects',
                    httpMethod: 'POST'
                },
                body: {
                    "description": "Unit test project",
                    "user_id": "1"
                }
            }
        )
        .then(result => {
            expect(result).to.be.empty;
            return done();
        })
        .catch(error => {
            return done(error);
        });
    });
    it('Should list all projects', function (done) {
        Projects.getAllProjects(
            {
                requestContext: {
                    resourcePath: '/v1/projects',
                    httpMethod: 'GET'
                }
            }
        )
            .then(result => {
                expect(result).to.be.an("Array");
                return done();
            })
            .catch(error => {
                return done(error);
            });
    });
    it('Should list all specified user\'s projects', function (done) {
        Projects.getProjectsByUserId(
            {
                requestContext: {
                    resourcePath: '/v1/user/{id}/projects',
                    httpMethod: 'GET'
                },
                pathParams: {
                    id: '1'
                }
            })
            .then(result => {
                expect(result).to.not.be.lengthOf(0);
                return done();
            })
            .catch(error => {
                return done(error);
            });
    });
    it('Should not list any projects', function (done) {
        Projects.getProjectsByUserId(
            {
                requestContext: {
                    resourcePath: '/v1/user/{id}/projects',
                    httpMethod: 'GET'
                },
                pathParams: {
                    id: '-1'
                }
            })
            .then(result => {
                expect(result).to.be.lengthOf(0);
                return done();
            })
            .catch(error => {
                return done(error);
            });
    });
    

});