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

// Parse command line arguments
const args = commandLineArgs(optionDefinitions);

// Support environment variables for PM2 integration
const config = {
    host: process.env.HOST || args.host,
    port: parseInt(process.env.PORT) || args.port,
    windowSize: process.env.WINDOW_SIZE ? parseInt(process.env.WINDOW_SIZE) : args.windowSize,
    initialDuration: process.env.INITIAL_DURATION ? parseInt(process.env.INITIAL_DURATION) : args.initialDuration,
    event: process.env.EVENT === 'true' || args.event,
    loop: process.env.LOOP === 'true' || args.loop,
    logLevel: process.env.LOG_LEVEL || args.logLevel,
    segmentsDir: process.env.SEGMENTS_DIR || args.segmentsDir,
    segmentPrefix: process.env.SEGMENT_PREFIX || args.segmentPrefix
};

// Create server instance
new MockHLSServer({ 
    host: config.host, 
    port: config.port, 
    windowSize: config.event ? null : config.windowSize, 
    initialDuration: config.initialDuration, 
    loop: config.loop, 
    logLevel: config.logLevel, 
    segmentsDir: config.segmentsDir, 
    segmentPrefix: config.segmentPrefix 
});
