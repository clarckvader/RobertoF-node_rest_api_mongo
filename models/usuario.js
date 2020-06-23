const mongoose = require('mongoose');
const uniqueValidator= require('mongoose-unique-validator')
const bcrypt = require('bcrypt')
const moment = require('moment-timezone')

const Schema = mongoose.Schema;

const rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol valido'
}
const UsuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        
    },
    email:{
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        select: false,
    },
    estado:{
        type: Boolean,
        default: true

    },
    rol:{
        type: String,
        enum: rolesValidos,
        default:'USER_ROLE'


    },
    creado:{
        type: Date,
    },
    modificado:{
        type: Date,
    }
});

//Para validar que un dato de este esquema sea unico (En PATH va el nombre del objeto que se intenta repetir)
UsuarioSchema.plugin(uniqueValidator, {message: "El {PATH} debe ser unico"})

UsuarioSchema.pre('save', function(next){
    if(this.isNew){
      this.creado = moment().tz("America/La_Paz").format();
    }else{
        this.modificado = moment().tz("America/La_Paz").format();
    }
    if(this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, 10); 
    }
    next();
});

usuario =  mongoose.model('Usuario', UsuarioSchema); 

module.exports = {
    usuario, rolesValidos
};

