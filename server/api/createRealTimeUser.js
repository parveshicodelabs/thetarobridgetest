const firebaseAdminSdk = require('../api-util/firebaseAdminSDK');

const collection = 'com1234'
const collectionRef = firebaseAdminSdk.collection(collection);

const createUser = require('../api/auth/createUser');


const observer = ()=> {
    collectionRef.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(async(change) => {
          if (change.type === 'added') {
            const newDocumentData = change.doc.data();
            console.log('New document added:', newDocumentData);

            //let's create new user in sharetirbe
            const email = newDocumentData.memberEmail;
            const firstName = newDocumentData.memberFirstName;
            const lastName = newDocumentData.memberLastName;
            const password = process.env.SHARETRIBE_USER_PASSWORD;

            try {
                const res = await createUser({
                    email,
                    firstName,
                    lastName,
                    password
                });
                console.log(res, '&& user created &&');
            } catch (error) {
                console.log(error, '&& error occured &&');
            }

          }
        });
      }, (error) => {
        console.error('Error listening to collection:', error);
      });
}

  module.exports = observer;