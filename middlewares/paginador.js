const paginador = (req , res , next) =>{
    let p = Number.parseInt(req.query.p);
    let r = Number.parseInt(req.query.r);
    p = Number.isNaN(p)|| p <= 0 ? 1 : p;
    r= Number.isNaN(r) || r <= 1 ? 10 : r;
    req.paginacion = {p : p - 1 , r : r};
    next();
}

module.exports = paginador;