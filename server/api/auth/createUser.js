const sharetribeSdk = require('sharetribe-flex-sdk');
const { handleError } = require('../../api-util/sdk');

const CLIENT_ID = process.env.REACT_APP_SHARETRIBE_SDK_CLIENT_ID;
const BASE_URL = process.env.REACT_APP_SHARETRIBE_SDK_BASE_URL;
const baseUrl = BASE_URL ? { baseUrl: BASE_URL } : {};

module.exports = async (user) => {

    const sdk = sharetribeSdk.createInstance({
        clientId: CLIENT_ID,
        ...baseUrl,
    });

   return await sdk.currentUser.create(user);   
};
