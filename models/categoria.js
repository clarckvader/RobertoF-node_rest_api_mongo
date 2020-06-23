const moongose = require ("mongoose");
const uniqueValidator = require("mongoose-unique-validator")
const moment = require("moment-timezone")

const Schema = moongose.Schema;

const CategoriaSchema = new Schema({
    descripcion:{
        type : String,
        unique: true,
        require: [true, "La descripcion es obligatoria"]
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        select: false
    },
    creado:{type: Date,},
    modificado:{type: Date}
})

CategoriaSchema.pre('save', function(next){
    if(this.isNew){
        this.creado = moment().tz('America/La_Paz').format();
    }else{
        this.modificado = moment().tz('America/La_Paz').format();
    }
    next();
})

CategoriaSchema.plugin(uniqueValidator, {mesagge: "El campo {PATH} debe ser unico"})

module.exports = moongose.model('Categoria', CategoriaSchema)