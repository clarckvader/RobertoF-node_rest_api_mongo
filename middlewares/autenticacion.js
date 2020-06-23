const Usuario = require('../models/usuario').usuario;

const verifyUser = async (req, res , next)=>{
    try {
        const usuario = await Usuario.findById(req.usuario);
        if(!usuario) return res.status(401).json({mensaje: "Usuario inexistente"})
        if(!usuario.estado) return res.status(401).json({mensaje: "Usuario inhabilitado"});
        req.username = usuario.nombre;
        next();
    } catch (error) {
    return res.status(500).json({mensaje: error.message})        
    }

}

module.exports = verifyUser;