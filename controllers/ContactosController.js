const ContactosModel= require('../models/ContactosModel');

exports.agregarContacto=(req,res)=>{
    const data={
        email:req.body.email,
        nombre:req.body.nombre,
        comentario:req.body.comentario,
        ip:req.ip,
        fecha: new Date()
    };
    ContactosModel.create(data, (err,nuevoContacto)=>{
        if(err){
            res.status(500).send('Error al guardar el contacto');
            return
        }
        res.status(200).send('Contacto guardado con exito');
    });
};

