const http = require('http');
const https = require('https');
const sharetribeSdk = require("sharetribe-flex-sdk");
const { createIdToken } = require("../../api-util/idToken");
const sdkUtils = require('../../api-util/sdk');
const createUserWithIdp = require("./createUserWithIdp");
const { v4: uuidv4 } = require('uuid');

const { handleError, serialize, typeHandlers } = require('../../api-util/sdk');

const idpClientId = process.env.REACT_APP_MEMBERSPACE_CLIENT_ID;
const idpId = process.env.REACT_APP_MEMBERSPACE_IDP_ID;
const rsaPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----
`
const keyId = process.env.KEY_ID;

const CLIENT_ID = process.env.REACT_APP_SHARETRIBE_SDK_CLIENT_ID;
const CLIENT_SECRET = process.env.SHARETRIBE_SDK_CLIENT_SECRET;
const TRANSIT_VERBOSE = process.env.REACT_APP_SHARETRIBE_SDK_TRANSIT_VERBOSE === 'true';
const USING_SSL = process.env.REACT_APP_SHARETRIBE_USING_SSL === 'true';
const BASE_URL = process.env.REACT_APP_SHARETRIBE_SDK_BASE_URL;
const rootUrl = process.env.REACT_APP_MARKETPLACE_ROOT_URL;

// Instantiate HTTP(S) Agents with keepAlive set to true.
// This will reduce the request time for consecutive requests by
// reusing the existing TCP connection, thus eliminating the time used
// for setting up new TCP connections.
const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const baseUrl = BASE_URL ? { baseUrl: BASE_URL } : {};


const loginWithIdp = (user, req, res, idpClientId, idpId) => {
  const tokenStore = sharetribeSdk.tokenStore.expressCookieStore({
    clientId: CLIENT_ID,
    req,
    res,
    secure: USING_SSL,
  });

  const sdk = sharetribeSdk.createInstance({
    transitVerbose: TRANSIT_VERBOSE,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    httpAgent,
    httpsAgent,
    tokenStore,
    typeHandlers: sdkUtils.typeHandlers,
    ...baseUrl,
  });

  return sdk
    .loginWithIdp({
      idpId,
      idpClientId,
      idpToken: user.idpToken,
    })
    .then(apiResponse => {
      const { status, statusText, data } = apiResponse;
      res
        .clearCookie('st-authinfo')
        .status(status)
        .set('Content-Type', 'application/transit+json')
        .send(
          serialize({
            status,
            statusText,
            data,
          })
        )
        .end();
    })
    .catch(e => {
      handleError(res, e);
    });
}

module.exports = async (req, res, next) => {
  const user = req.body;
  const userId = uuidv4();
  const { email, firstName, lastName, } = user;
  //Step 1: create idp token
  createIdToken(idpClientId, { ...user, emailVerified: true, userId }, { signingAlg: 'RS256', rsaPrivateKey, keyId })
    .then(idpToken => {
      const userData = {
        email,
        firstName,
        lastName,
        idpToken,
        emailVerified: true,
        userId,
      };
      console.log(idpToken, 'idp token created!')
      //Step 2: login with idp
      loginWithIdp(userData, req, res, idpClientId, idpId);
    })
    .catch(e => console.error(e));
}