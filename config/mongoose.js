const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

//conectar a la base de datos con un usuario y contraseña con la siguiente linea de codigo:
//mongodb://usuario:contraseña@localhost:27017/cursonode`
const mongo = mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,{
    useNewUrlParser : true,
    useUnifiedTopology: true,
    
})

mongo
.then(response => console.log("Conectado a la base de datos"))
.catch(error => console.log(error))

module.exports=  mongo;
