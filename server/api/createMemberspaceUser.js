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
const rsaPrivateKey = process.env.RSA_PRIVATE_KEY;
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
              await axios.post(`${apiBaseUrl}/api/auth/create-user-with-idp`, signupUser);
              console.log('&& user created &&');
              await collectionRef.doc(newDocumentId).set({ userSynced: true }, { merge: true });
            } catch (error) {
              console.log(error, '&& error occured &&');
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
