const expressJwt = require('express-jwt');
const config = require('config.json');
const userService = require('../users/user.service');

module.exports = jwt;

function jwt() {
    //const secret = config.secret;
    //return expressJwt({ secret: secret }).unless({
    return expressJwt({ secret: 'asdj;lsdf', isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/users/register'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
		console.log(config.secret);
        return done(null, true);
    }

    done();
};
