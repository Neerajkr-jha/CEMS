const jwt = require('jsonwebtoken');
const user=require('../models/User');


//uesr authentication middleware
const protect = async (req, res, next) => {
    let token = req.headers.authorization && 
                req.headers.authorization.startsWith('Bearer ') ? 
                req.headers.authorization.split(' ')[1] : null;
    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await user.findById(decoded.id).select('-password');
            if(!req.user){
                res.status(401).json({message: 'Not authorized'});
            }
            next();
        }
        catch (error) {
            res.status(401).json({message: 'Not authorized'});
        }
    }else{
        res.status(401).json({message: 'Not authorized'});
    }
}

const admin = (req, res, next) => {
    if(req.user && req.user.role === 'admin'){
        next();
    }else{
        res.status(401).json({message: 'Admin authorization required'});
    }
}

module.exports = { protect, admin };
