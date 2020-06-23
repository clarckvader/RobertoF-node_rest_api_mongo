const moongose = require ("mongoose");

const moment = require("moment-timezone")

const Schema = moongose.Schema;

const productoSchema = new Schema({
    nombre: {type: String, required:[true, 'El precio es necesario']},
    precio: { type: Number, required:[true, ' El precio es necesario']},
    descripcion:{ type: String, required: false},
    disponible: {type: Boolean, required: true, default: true},
    img: {type: String, required: false},
    categoria:{ type: Schema.Types.ObjectId, ref: 'Categoria'},
    usuario:{ type: Schema.Types.ObjectId, ref: 'Usuario'},
    creado: { type: Date},
    modificado: { type: Date},
})

productoSchema.pre('save', function(next){
    if(this.isNew){
        this.creado= moment().tz('America/La_Paz').format();
    }else{
        this.modificado= moment().tz('America/La_Paz').format();
    }
    next();
})
module.exports = moongose.model('Producto', productoSchema);