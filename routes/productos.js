const path = require('path');
const fs = require ('fs');
const express = require("express");
const Producto = require("../models/producto")
const paginador = require('../middlewares/paginador')
const fileupload = require('express-fileupload');
const producto = require('../models/producto');
const { json } = require('express');


const router = express.Router();
router.use(fileupload());

//Buscar  producto por nomnbre
router.get('/buscar', async(req,res) =>{
    try {
        const q = req.query.q;
        const regex = new RegExp(q, "i");
        const producto = await Producto.find({disponible: true, nombre: regex});
        if(!producto) return res.status(404).json({mensaje: " No se encuentra ningun producto"})
        return res.status(200).json(producto)
    } catch (error) {
         return res.status(500).json({mensaje: error.message})
    }

} )


//Lista de productos
router.get('/',  paginador ,async(req, res)=>{
    try {
        const cantidad = await Producto.find({disponible:true}).count();
        const producto = await Producto
        .find({disponible:true})
        .skip( req.paginacion.p * req.paginacion.r)
        .limit(req.paginacion.r);
        if(!producto) return res.status(404).json({mensaje: "No hay productosdisponibles"})
        return res.status(200).json({cantidad: cantidad, producto: producto})
    } catch (error) {
        return res.status(400).json({mensaje: error.message})
    }
})




//Ver imagen (Comprobando si existe)
router.get('/imagen/:nombre', (req,res)=> {
   const pathImagen = path.resolve(__dirname,`../uploads/${req.params.nombre}`)
   if(fs.existsSync(pathImagen)){
       return res.sendFile(pathImagen);
   }else{
       const noImagepath = path.resolve(__dirname, `../assets/unnamed.png`)
       res.sendFile(noImagepath);
   }
    

});

//Buscar producto por id
router.get('/:id', async(req, res)=>{
    try {
        const producto = await Producto.findById(req.params.id)
        if(!producto) return res.status(400).json({mensaje: 'No existe este producto'})
    } catch (error) {
        return res.status(400).json({mensaje: error.message});
    }
})
//Crear nuevo producto
router.post('/', async(req, res)=>{
try {
    let data = req.body;
    data.usuario = req.usuario;
    const producto = new Producto(data);
    await producto.save();
    return res.status(201).json(producto);
} catch (error) {
    return res.status(500).json({mensaje: error.message})
}

})
//Actualizar datos de productos
router.put('/:id', async(req, res)=>{
    try {
        const producto = await Producto.findById(req.params.id);
        if(!producto) return res.status(404).json({mensaje: "No se encuentra el producto"})
        producto.set(req.body);
        await producto.save();
        return res.status(200).json(producto)
    } catch (error) {
         return res.status(500).json({mensaje: error.message})
        
    }
})
//Eliminar productos
router.delete('/:id', async(req, res)=>{
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id)
        if(!producto) return res.status(404).json({mensaje: "No se encuentra el producto"})
        return res.status(200).json({mensaje: "producto borrado"}) 
    } catch (error) {
        return res.status(500).json({mensaje: error.message})
    }
})

//Cargar Imagen
router.put('/:id/imagen', async(req,res)=>{
    if(!req.files) return res.status(400).json({mensaje: "No se selecciono ninguna imagen"});
    const imagen = req.files.imagen;
    if(!validarExtension(imagen.name)) return res.status(404).json({mensaje: "No se admite el tipo de archivo"})
    try {
        const producto = await Producto.findById(req.params.id);
        if(!producto) return res.status(404).json({mensaje: "No se encontro la categoria"})
        const [nombre, extension] = imagen.name.split(".");
        const nombreArchivo = `${req.params.id}-${new Date().getTime()}.${extension}`;
        await imagen.mv(`uploads/${nombreArchivo}`);
        producto.set({img: nombreArchivo});
        await producto.save();
        return res.status(200).json({mensaje: "Imagen subida correctamente", file: nombreArchivo})

    } catch (error) {
        return res.status(500).json({mensaje: error.message})
    }

})


//(Eliminar imagen)
router.delete('/:id/imagen', async(req,res)=>{
    try {
        const producto = await Producto.findById(req.params.id)
        if(!producto) return res.status(404)-json({mensaje: "No se encuentra el producto"})
        const pathImagen = path.resolve(__dirname, `../uploads/${producto.img}`);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
            producto.set({img: null})
            await producto.save();
            return res.status(200).json({mensaje: "La imagen se borro correctamente"})
        }else{
            producto.set({img: null})
            await producto.save();
            return res.status(404).json({mensaje: "No se encuentra el archivo"});

        }
    } catch (error) {
        return res.status(500).json({mensaje: error.message})
        
    }
    
})

//Funcion para validar la extension de la imagen
const validarExtension = (file) => {
    const extensionesValidads = ['png', 'jpg'];
    const [nombre, extension] = file.split('.')
    if(extensionesValidads.indexOf(extension)<0) return false;
    console.log(file);
    return true;
}
module.exports = router;