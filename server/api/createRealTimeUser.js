const firebaseAdminSdk = require('../api-util/firebaseAdminSDK');

const collection = 'com1234'
const collectionRef = firebaseAdminSdk.collection(collection);

const createUser = require('../api/auth/createUser');

const observer = () => {
    collectionRef.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
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
                const password = process.env.SHARETRIBE_USER_PASSWORD;
                const userSynced = newDocumentData.userSynced;

                if (!userSynced) {
                    try {
                        const res = await createUser({
                            email,
                            firstName,
                            lastName,
                            password
                        });
                        console.log(res, '&& user created &&');
                      await collectionRef.doc(newDocumentId).set({userSynced:true}, {merge:true});
                    } catch (error) {
                        console.log(error, '&& error occured &&');
                    }
                }
            }
        });
    }, (error) => {
        console.error('Error listening to collection:', error);
    });
}

module.exports = observer;