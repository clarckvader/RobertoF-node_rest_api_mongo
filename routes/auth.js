const  express = require('express');
const bcrypt = require ("bcrypt");
const Usuario = require("../models/usuario").usuario;
const jwt =  require("jsonwebtoken")

const router = express.Router();


router.post('/login', async(req , res)=>{

    try {
        const usuario = await Usuario.findOne({email: req.body.email}).select('password');
        if(!usuario) return res.status(404).json({mensaje:"Usuario o contraseña invalidos"}); 
        if(!bcrypt.compareSync(req.body.password, usuario.password)) return res.status(404).json({mensaje:"Usuario o contraseña invalidos"});
        const token = jwt.sign({usuario_id: usuario._id}, process.env.SECRET_KEY, {expiresIn: 3600} )
        return res.status(200).json({llave: token})
    } catch (error) {
        console.log(error);
        return res.status(500).json({mensaje: error.message})
        
    }
});

module.exports = router;