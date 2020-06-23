
const app = require('./config/express')
require("./config/mongoose");
const dotenv = require('dotenv');
const cors = require('cors');

const verifytoken = require("./middlewares/token");
const verifyuser = require("./middlewares/autenticacion")
const verifyAdmin = require ("./middlewares/autorizacion")
const logs = require('./middlewares/logs')

dotenv.config();

app.use(cors())

app.use('/auth', require('./routes/auth'))
app.use('/usuarios', [verifytoken, verifyuser, verifyAdmin], require ('./routes/usuario') )
//app.use('/usuarios', require ('./routes/usuario') )
app.use('/categoria', [verifytoken, verifyuser, verifyAdmin, logs] ,require('./routes/categoria'))
app.use('/productos', require('./routes/productos'))
//Llamando al puerto de .env
app.listen(process.env.NODE_PORT, ()=>{
    console.log( `Escuchando en el puerto ${process.env.NODE_PORT}`)
});