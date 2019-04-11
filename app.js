const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const Redis = require('ioredis');
const dateFns = require('date-fns');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

const redis = new Redis(process.env.REDIS_URL || 'redis:6379');

app.get('/', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

// TODO: Validate query params

app.use('/petfinder', async (req, res, next) => {
  const {
    query: { clientId },
  } = req;
  // Check if a token exists in Redis
  const accessToken = await redis.get(clientId);
  const expiry = await redis.get('expiry');
  const now = new Date();
  const expiryDate = expiry ? dateFns.parse(expiry) : now;
  const isNotExpired = dateFns.isAfter(expiryDate, now);
  if (accessToken && isNotExpired) {
    // Make the request with the access token
    console.log('USING CACHED TOKEN');
    return next();
  }
  // If no, get an access token & store in Redis
  try {
    const { data: response } = await axios({
      method: 'POST',
      url: 'https://api.petfinder.com/v2/oauth2/token',
      data: `grant_type=client_credentials&client_id=${clientId}&client_secret=${
        process.env.CLIENT_SECRET
      }`,
    });
    const { access_token, expires_in } = response;
    const expiryDate = dateFns.addSeconds(new Date(), expires_in);
    const expiryDateString = expiryDate.toISOString();
    await redis
      .multi()
      .set(clientId, access_token)
      .set('expiry', expiryDateString)
      .exec();
    // Make the request with the access token
    console.log('USING NEW TOKEN');
    next();
  } catch (error) {
    const { response: { status = 500 } = {} } = error;
    res.status(status).json({ message: error.message || 'An error occurred' });
  }
});

app.get('/petfinder', async (req, res) => {
  const { query } = req;
  const { clientId, reqUrl, params, proxyHeaders = {} } = query;
  let accessToken;
  try {
    accessToken = await redis.get(clientId);
  } catch (error) {
    res.status(500).json({
      message: 'OAuth2 proxy failed to retrieve access token from storage.',
    });
  }
  const requestConfig = {
    method: 'GET',
    url: reqUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...proxyHeaders,
    },
  };
  try {
    if (params) {
      requestConfig.params = JSON.parse(params);
    }
  } catch (error) {
    res.status(400).json({ message: '`params` must be a valid JSON string' });
  }
  try {
    const response = await axios(requestConfig);
    res.json(response.data);
  } catch (error) {
    const { response: { status = 500 } = {} } = error;
    res.status(status).json({ message: error.message });
  }
});

module.exports = app;
