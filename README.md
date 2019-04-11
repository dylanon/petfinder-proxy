# Petfinder Proxy

Manages tokens and secrets, and proxies network requests. Works with [Petfinder API v2](https://www.petfinder.com/developers/v2/docs/).

## Getting started

To use this proxy to support a front-end app, you should run your own copy of it - You can do this for free on Heroku.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

1. Create a [Heroku](https://www.heroku.com/) account (or log in if you have one already).
2. Click the Deploy button above.
3. Fill in the **App Name** - the proxy will be deployed to _http://your-app-name-here.herokuapp.com_
4. Fill in your Petfinder `clientSecret`.
5. Click **Deploy App**.

## How to use

Note: This proxy only supports GET requests.

Send your request to the `/petfinder` endpoint (e.g. _http://your-app-name-here.herokuapp.com/petfinder_) with the following query params:

### Query Params

- `clientId` **(required)**: your API key (provided by Petfinder)
- `reqUrl` **(required)**: the Petfinder API endpoint URL you want to request data from
- `params` (optional): query params for your Petfinder API call (an object, formatted as a JSON string) - e.g. `{"page": 2}`
- `proxyHeaders` (optional): any headers you need to send along with your Petfinder API call (an object, formatted as a JSON string) - e.g. `{"My-Custom-Header": "headerValueHere"}`

### Example Request

```javascript
fetch(
  'http://your-app-name-here.herokuapp.com/petfinder?reqUrl=https://api.petfinder.com/v2/animals&params={"page": 2}&clientId=yourapikeyhere'
)
  .then(res => res.json())
  .then(petData => console.log(petData));
```

or, with [axios](https://github.com/axios/axios):

```javascript
axios({
  method: 'GET',
  url: 'http://your-app-name-here.herokuapp.com/petfinder',
  params: {
    reqUrl: 'https://api.petfinder.com/v2/animals',
    params: {
      page: 2,
    },
    clientId: 'yourapikeyhere',
  },
}).then(res => console.log(res.data));
```

## Developing

- Install [Docker](https://www.docker.com/)
- `yarn` to install JavaScript dependencies
- Create a file named `.env` in the project's root directory with the following environment variables:

```
CLIENT_SECRET=yourClientSecretHere
REDIS_URL=redis:6379
```

- `docker-compose up` from the project's root directory to start the app (listens on port 4000 by default)
