const http = require('http');
const https = require('https');
const sharetribeSdk = require("sharetribe-flex-sdk");
const { createIdToken } = require("../../api-util/idToken");

const sdkUtils = require('../../api-util/sdk');
const createUserWithIdp = require("./createUserWithIdp");


const idpClientId = process.env.REACT_APP_MEMBERSPACE_CLIENT_ID;
const idpId = 'memberspace';
const rsaPrivateKey = process.env.RSA_PRIVATE_KEY; 
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


const loginWithIdp = (user, req, res, idpClientId, idpId)=> {
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
      .then(response => {
        if (response.status === 200) {
          res.redirect(`${rootUrl}#`);
        }
      })
      .catch(() => {
        console.log(
          'Authenticating with idp failed. User needs to confirm creating sign up in frontend.'
        );

        //Create user if logged in fails,
        //login fails because user do not exists.
        //Call create user with idp
        createUserWithIdp(req, res);
      });
}



module.exports = async (req, res, next) => {
    const user = req.body;
    const {email, firstName, lastName} = user;
    //Step 1: create idp token
    createIdToken(idpClientId, user, { signingAlg: 'RS256', rsaPrivateKey, keyId })
    .then(idpToken => {
      const userData = {
        email,
        firstName,
        lastName,
        idpToken
      };
      //Step 2: login with idp
      req.body.idpToken = idpToken;
      req.body.idpId = idpId;
      loginWithIdp(userData, req, res, idpClientId, idpId);
    })
    .catch(e => console.error(e));
};