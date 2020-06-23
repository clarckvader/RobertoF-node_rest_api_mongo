const jwt = require("jsonwebtoken")

const Verifytoken = async (req, res , next) => {
    try {
        const decoded = jwt.verify(req.get('token'), process.env.SECRET_KEY);
        req.usuario = decoded.usuario_id;
        next();
    } catch (error) {
        return res.status(401).json({mensaje: error.message})
        
    }
    
}

module.exports = Verifytoken;