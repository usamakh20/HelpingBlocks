const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    try {
        req.UserData = jwt.verify(req.headers.authorization, process.env.PWD);
        console.log(req.UserData);
        next()
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};