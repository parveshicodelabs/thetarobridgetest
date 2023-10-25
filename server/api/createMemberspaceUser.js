const axios = require('axios');

const firebaseAdminSdk = require('../api-util/firebaseAdminSDK');
const { createIdToken } = require('../api-util/idToken');

const collection = 'com1234';
const collectionRef = firebaseAdminSdk.collection(collection);

//Determining api's root url
const port = process.env.REACT_APP_DEV_API_SERVER_PORT;
let apiBaseUrl;
if (process.env.NODE_ENV === 'development') {
  apiBaseUrl = `http://localhost:${port}`;
} else {
  apiBaseUrl = process.env.REACT_APP_MARKETPLACE_ROOT_URL;
}

const idpClientId = process.env.REACT_APP_MEMBERSPACE_CLIENT_ID;
const idpId = 'memberspacetst';
const rsaPrivateKey = "-----BEGIN RSA PRIVATE KEY-----\n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\n-----END RSA PRIVATE KEY-----"
const keyId = process.env.KEY_ID;

const fireStoreListener = () => {
  collectionRef.onSnapshot(
    snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          const newDocumentData = change.doc.data();
          const newDocumentId = change.doc.id;
          // console.log('New document added:', newDocumentData);
          // console.log('new document id', newDocumentId);

          //let's create new user in sharetirbe
          //User must not be created if they are already created
          const email = newDocumentData.memberEmail;
          const firstName = newDocumentData.memberFirstName;
          const lastName = newDocumentData.memberLastName;
          const userSynced = newDocumentData.userSynced;

          if (!userSynced) {
            try {
              //make a request to the create user with idp endpoint
              //The createUserWithIpd middleware requires a idpToken besides
              //user details.
              //Generate idpToken
              const user = {email, firstName, lastName, userId:newDocumentId, emailVerified:true}
              console.log('User:=>', user)
              const idpToken = await createIdToken(
                idpClientId,
                user,
                { signingAlg: 'RS256', rsaPrivateKey, keyId }
              );
              console.log('idp token generated:=>>', idpToken);
              //Having idpToken create user with idp
              const signupUser = {email, firstName, lastName, idpToken, idpId}
              const config = {
                headers: {
                  'Content-Type': 'application/json',
                },
              };
              await axios.post(`${apiBaseUrl}/api/auth/create-user-with-idp`, signupUser, config);
              console.log('&& user created &&');
              await collectionRef.doc(newDocumentId).set({ userSynced: true }, { merge: true });
            } catch (error) {
              console.log('&& error occured &&');
            }
          }
        }
      });
    },
    error => {
      console.error('Error listening to collection:', error);
    }
  );
};

module.exports = fireStoreListener;
