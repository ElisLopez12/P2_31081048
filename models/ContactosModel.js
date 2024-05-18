const sqlite3 = require("sqlite3").verbose();
const { error } = require("console");
const {promisify}= require("util");

//crear la abase d datos
const db =new sqlite3.Database('./database/data.db',sqlite3.OPEN_READWRITE, (err) =>{
    if(err){
        console.error(err.message);
        return
    }
    console.log("Conectado a la base de datos");
});


//crear la tabla 
db.serialize(()=>{
         db.each(" CREATE TABLE IF NOT EXISTS contactos(email TEXT, nombre TEXT, comentario TEXT, ip TEXT, fecha DATE, id INTEGER PRIMARY KEY AUTOINCREMENT)",(err)=>{
            if (err){
                console.error(err.message)
            }
        });
})


//eliminar la tabla 
/* 
db.run("DROP TABLE contactos", (err)=>{
        if(err){
            console.error(err.message);
            return
        }
        console.log("borrado bien");
    });
*/  


//eliminar elementos de la tabla
/*db.run("DElETE FROM contactos WHERE id=4", (err)=>{
    if(err){
        console.error(err.message);
        return
    }
    console.log("borrado bien");
});
*/

class ContactosModel{
    static create(data,callback){
        const {email, nombre, comentario, ip, fecha}=data;
        const insertar=("INSERT INTO contactos (email, nombre, comentario, ip, fecha) VALUES(?,?,?,?,?)");
        db.serialize(()=>{
            db.each(insertar, [email, nombre, comentario, ip, fecha], function(err){
                callback(err,{id:this.lastID});
            }
            );
        });        
    }
}


module.exports=ContactosModel;