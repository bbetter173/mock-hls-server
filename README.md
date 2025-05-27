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

Now start your stream at `http://localhost:8080/proxy?url=<stream url>`. The first playlist request will start the stream. Variant playlists are supported, and the playlist URL's contained in them will be rewritten to route through the proxy.

The source stream should be a VOD playlist that contains all the segments.

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
