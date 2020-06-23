const express = require ('express');
const usuari = require('../models/usuario').usuario;


const router = express.Router();

//Listar todos los usuarios
router.get('/', (req, res)=>{
    usuari.find().where('estado', true)
    .then( response => res.status(200).json(response))
    .catch( error => res.status(400).json({mensaje:error}))
    //return res.status(200).send(usuarios)
});
//para encontrar el usuario de un objeto "usuarios" mediante su id y devolverlo por GET
router.get('/:id', async (req,res)=>{
    const usuario = await usuari.findById(req.params.id)
    if(!usuario) return res.status404().json({mensaje: "No se encontro al usuario"});
    return res.status(200).json(usuario)
    /*console.log(req.params.id)
    const usr = usuarios.find(usuario => usuario.id === Number(req.params.id));
    if(usr) return res.status(200).send(usr);
    else return res.status(404).send({mensaje: "No se encontro el usuario"});*/
})

//Crear nuevo usuario
router.post('/' ,async(req, res)=>{
    const usuario = new usuari({
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
        rol: req.body.rol
    });
    try {
        const nuevo = await usuario.save();
        return res.status(201).json({usuario: nuevo})
        
    }catch (error) {
        return res.status(400).json({mensaje: error});
    }
});

//Se pasa el "id" como parametro de la ruta porque porque a diferencia de los query params, este no se usa para realizar un filtro
//Actualizar datos de usuarios
router.put('/:id', async(req,res)=>{
   
  const usuario= await usuari.findById(req.params.id);
  if(!usuario) return res.status(404).json({mensaje: "no se encuentra al usuario"})
    usuario.set(req.body);
    try{
        await usuario.save();
        return res.status(200).json(usuario);
    }catch(error){
        return res.status(400).json({mensaje: error});
    }

})

//Cambiar estado a "True"
router.patch('/:id/activar',async (req,res)=>{
        const usuario = await usuari.findById(req.params.id).where('estado', false);
        if(!usuario) return res.status(404).json({mensaje: 'No se encuentra al usuario'});
        (usuario).set({estado: true});
        try {
            await usuario.save();
            return res.status(200).json(usuario);
        } catch (error) {
            return res.status(400).json({mensaje: error.message})
        }
        
    })
   
  
//Cambiar estado a "False"
router.patch('/:id/desactivar', async (req,res)=>{
    const usuario = await usuari.findById(req.params.id).where('estado', true);
    if(!usuario) return res.status(404).json({mensaje: 'No se encuentra al usuario'});
    (usuario).set({estado: false});
    try {
        await usuario.save();
        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(400).json({mensaje: error.message})
    }
})
 //Eliminar usuario de la BD
router.delete('/:id', async (req,res)=>{
    try {
        
        const usuario = await usuari.findByIdAndRemove(req.params.id);
       if (!usuario) return res.status(404).json({mensaje: "No se encuentra al usuario"});
       else{
           return res.status(200).json(usuario);
       }
       
    } catch (error) {
        if(error.name === 'CastError') return res.status(400).json({mensaje: "El id es invalido"})
        else{
            return res.status(400).json({mensaje: error.message})
        }
    }
  

});

module.exports = router;