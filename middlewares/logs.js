const logger = require('simple-node-logger');
const moment = require('moment')
const logger_options = {
    errorEventName:'error',
    logDirectory:'./logs', // NOTE: folder must exist and be writable...
    fileNamePattern:'log-<DATE>.log',
    dateFormat:'YYYY.MM.DD'
};

const log = logger.createRollingFileLogger( logger_options );

const logs = (req, res, next) =>{
    next();
    log.info(req.method, " ",
    req.originalUrl,
    "Usurario: ", req.username,
    "Fecha:", moment().format('DD-MM-YYYY'),
    "IP:", req.ip,
    "Agente: ", req.get("User-Agent"));

    console.log(req)


}

module.exports = logs