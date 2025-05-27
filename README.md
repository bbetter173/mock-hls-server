[![npm version](https://badge.fury.io/js/mock-hls-server.svg)](https://badge.fury.io/js/mock-hls-server)

# Mock HLS Server
Fake a live/event HLS stream from a VOD one. Useful for testing.

# Usage
```
npm install -g mock-hls-server
```
to install globally.

```
mock-hls-server
```
will start the server running on "http://localhost:8080".

```
mock-hls-server 0.0.0.0 -p 8000 --event
```
will start listening on all interfaces on port 8000. It will also serve the playlist as an EVENT playlist, which means URL's will never be removed from the start.

These are all the options:
- `host`
- `port`
- `windowSize`: The number of seconds to keep in the playlist. Not valid with `--event`.
- `initialDuration`: The number of seconds into the stream that should be available on the first playlist request.
- `event`: Changes the playlist type to EVENT, meaning no segments will ever be removed.
- `loop`: Loop the playlist.
- `logLevel`
- `segmentsDir` (alias: `-s`): Path to a directory to serve static files from under the `/segments/` path.
- `segmentPrefix` (alias: `-p`): Static prefix to prepend to video segment URLs instead of proxying them.

Now start your stream at `http://localhost:8080/proxy?url=<stream url>`. The first playlist request will start the stream. Variant playlists are supported, and the playlist URL's contained in them will be rewritten to route through the proxy.

The source stream should be a VOD playlist that contains all the segments.

# PM2 Support
Mock HLS Server includes built-in PM2 ecosystem configuration for running multiple instances in production environments.

## PM2 Scripts
```bash
# Setup and start PM2 (creates logs directory and starts all apps)
npm run pm2:setup

# Start in development mode (4 proxy instances + 2 segment server instances)
npm run pm2:start

# Start in production mode (optimized settings)
npm run pm2:start:prod

# Stop all instances
npm run pm2:stop

# Restart all instances
npm run pm2:restart

# Reload instances with zero downtime
npm run pm2:reload

# View logs
npm run pm2:logs

# Monitor instances
npm run pm2:monit

# Delete all instances
npm run pm2:delete
```

## PM2 Configuration
The ecosystem includes two pre-configured applications:

### 1. mock-hls-server (Main Proxy Server)
- **Instances**: 4 (development) / 4 (production)
- **Port**: 8080
- **Mode**: Cluster
- **Features**: HLS proxy with EXT-X-PROGRAM-DATE-TIME support

### 2. mock-hls-server-segments (Static File Server)
- **Instances**: 2 (development) / 2 (production)
- **Port**: 8081
- **Mode**: Cluster
- **Features**: Static segment serving with CORS support

## Environment Variables
PM2 configuration supports environment variables for easy customization:

- `HOST`: Server host (default: localhost/0.0.0.0 for prod)
- `PORT`: Server port (default: 8080/8081)
- `WINDOW_SIZE`: Playlist window size in seconds
- `INITIAL_DURATION`: Initial stream duration
- `LOG_LEVEL`: Logging level (info/warn/error)
- `SEGMENTS_DIR`: Directory for static file serving
- `SEGMENT_PREFIX`: Custom prefix for segment URLs
- `EVENT`: Set to 'true' for EVENT playlists
- `LOOP`: Set to 'true' to loop playlists

## Production Deployment
```bash
# Install PM2 globally
npm install -g pm2

# Setup log rotation
pm2 install pm2-logrotate

# Start in production mode
npm run pm2:start:prod

# Save PM2 configuration for auto-restart
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

# Examples

## Basic Usage
Run
```
mock-hls-server
```
and then start streaming 'http://localhost:8080/proxy?url=https%3A%2F%2Fdevstreaming-cdn.apple.com%2Fvideos%2Fstreaming%2Fexamples%2Fimg_bipbop_adv_example_ts%2Fmaster.m3u8'

## Static File Serving
To serve static HLS segments from a local directory:
```
mock-hls-server -s /path/to/segments
```
This will serve files from `/path/to/segments` under the `/segments/` path. For example, a file at `/path/to/segments/segment001.ts` would be accessible at `http://localhost:8080/segments/segment001.ts`.

The static file server automatically sets appropriate CORS headers and content types for HLS files (.ts and .m3u8).

## Custom Segment Prefix
To use a custom prefix for video segments instead of proxying them:
```
mock-hls-server --segment-prefix "https://cdn.example.com/videos/"
```
This will rewrite video segment URLs (`.ts`, `.m4s`, `.mp4`, `.m4v`) in playlists to use the custom prefix. For example, `segment001.ts` becomes `https://cdn.example.com/videos/segment001.ts`. Playlist files (`.m3u8`) continue to use the normal proxy behavior.

## PM2 Multi-Instance Setup
For high-availability production deployment:
```bash
# Start with PM2 in production mode
npm run pm2:start:prod

# Monitor performance
npm run pm2:monit

# View real-time logs
npm run pm2:logs
```

This will start 4 proxy server instances on port 8080 and 2 static file server instances on port 8081, with automatic load balancing and process management.
