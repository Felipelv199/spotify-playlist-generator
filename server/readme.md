# Spotify Playlist Generator Service

Backend application for the creation of Spotify Tracks Playlist from your liked songs.

## Application

### Requirements

|Tool|Version|
|----|-------|
| Node | `^v18.17` |
| npm | `^9.6` |

### Environment Variables

Create file on the root of the project named `.env.local` filled with the listed environment varibles.

| Variable | Value |
|----------|-------|
| PORT | 8080 |
| REDIRECT_URI | <SECRET_VARIABLE> |
| CLIENT_ID | <SECRET_VARIABLE> |
| CLIENT_SECRET | <SECRET_VARIABLE> |

### Setup

1. Install Typescript globally using npm
```shell
npm install -g typescript
```
2. Run the install dependencies command from npm
```shell
npm install
```
3. Build the project using typescript
```shell
tsc
```
4. Run the start script
```shell
npm start
```