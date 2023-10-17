const loginWithIdp = require("./loginWithIdp");

const idpClient = process.env.REACT_APP_MEMBERSPACE_CLIENT_ID;

module.exports = async (req, res) => {
    console.log(req.cookies['_ms-access-token'], 'cookie');
    const accessToken = req.cookies['_ms-access-token']
    
    const { user } = req;
    if(!accessToken || !user){
        return res.status(400).json({message:'missing access token or user'})
    }
    user['idpToken'] = accessToken;
    loginWithIdp(null, user, req, res, idpClient, 'memberspace');
};