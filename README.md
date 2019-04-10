# Petfinder Proxy

Manages tokens and secrets, and proxies network requests.

## First, deploy your own copy to Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## How to use

Note: This proxy only supports GET requests.

Send your request to the `/petfinder` endpoint, with the following query params:

### Query Params

- `clientId` **(required)**: your API key (provided by Petfinder)
- `reqUrl` **(required)**: Petfinder API endpoint URL you want to request data from
- `params`: query params for your Petfinder API call (an object, formatted as a JSON string) - e.g. `{"page": 2}`
- `proxyHeaders`: any headers you need to send along with your Petfinder API call (an object, formatted as a JSON string) - e.g. `{"My-Custom-Header": "headerValueHere"}`

## Developing

- Install Docker
- `docker-compose up` from the project directory to start the app (listens on port 4000 by default)
