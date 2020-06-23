const express = require('express');
const Categoria = require('../models/categoria')




const router = express.Router();

router.get('/', async(req,res)=>{
    try {
        const categoria = await Categoria.find({})
        .select('descripcion')        
        .sort('descripcion')
     
        if(!categoria) return res.status(404).json({mensaje: "No hay categoria existentes"})
        return res.status(200).json(categoria)
    } catch (error) {
        return res.status(500).json({mensaje: error.message})
        
    }
}  )
router.get('/:id', async(req,res)=>{
    try{
    const categoria = await Categoria.findById(req.params.id)
    .populate('usuario', ' nombre email -_id')
    if(!categoria) return res.status(404).json({mensaje: "No se encuentra la categoria"})
    return res.status(200).json(categoria)
}catch(error){
    return res.status(500).json({mensaje: error.message})
}

})
    

router.post('/', async(req,res)=>{
  
   try {
    const categoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario: req.usuario
    })
       await categoria.save();
       return res.status(201).json({categoria: categoria})
   } catch (error) {
    return res.status(400).json({mensaje: error});
       
   }
});


router.put('/:id', async(req,res)=>{
    try {
        const categoria = await Categoria.findById(req.params.id)
        categoria.set(req.body);
        await categoria.save();
        return res.status(200).json(categoria)
    } catch (error) {
        return res.status(500).json({mensaje: error});
    }
})
router.delete('/:id', async(req,res)=>{
    try {
        const categoria = await Categoria.findByIdAndDelete(req.params.id);
        if(!categoria) return res.status(404).json({mensaje: "No existe la categoria"})
        return res.status(200).json(categoria)
    } catch (error) {
        return res.status(500).json({mensaje : error.message})
        
    }
})

module.exports = router;