#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const MockHLSServer = require('../src/mock-hls-server');

const optionDefinitions = [
    { name: 'host', type: String, defaultOption: true, defaultValue: 'localhost' },
    { name: 'port', type: Number, alias: 'p', defaultValue: 8080 },
    { name: 'windowSize', type: Number, defaultValue: 10 },
    { name: 'initialDuration', type: Number, defaultValue: 10 },
    { name: 'event', type: Boolean, defaultValue: false },
    { name: 'loop', type: Boolean, defaultValue: false },
    { name: 'logLevel', type: String, defaultValue: 'info' },
    { name: 'segmentsDir', type: String, alias: 's' },
    { name: 'segmentPrefix', type: String, alias: 'r' }
];

const { host, port, windowSize, initialDuration, event, loop, logLevel, segmentsDir, segmentPrefix } = commandLineArgs(optionDefinitions);
new MockHLSServer({ host, port, windowSize: event ? null : windowSize, initialDuration, loop, logLevel, segmentsDir, segmentPrefix });
