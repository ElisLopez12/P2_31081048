const ContactosModel = require("../models/ContactosModel");


class ContactosController {
  constructor() {
    this.contactosModel = new ContactosModel();
    this.add = this.add.bind(this);
  }

  async obtenerIp() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip; 
    } catch (error) {
      console.error('Error al obtener la ip:', error);
      return null; 
    }
  }

  async obtenerPais(ip) {
    try {
      const response = await fetch('https://ipinfo.io/'+ip+'?token=8ce00bc8d3bc24');
      const data = await response.json();
      return data.country; 
    } catch (error) {
      console.error('Error al obtener el país:', error);
      return null; 
    }
  }

    async add(req, res) {
    // Validar los datos del formulario

    const { email, name, mensaje } = req.body;

    if (!email || !name || !mensaje) {
      res.status(400).send("Faltan campos requeridos");
      return;
    }

    // Guardar los datos del formulario
    const ip = await this.obtenerIp();
    const fecha = new Date().toISOString();
    const pais = await this.obtenerPais(ip);

   
    await this.contactosModel.crearContacto(email, name, mensaje, ip, fecha, pais);

    const contactos = await this.contactosModel.obtenerAllContactos();

    console.log(contactos);

    try{
        res.status(200).send("Datos enviados exitosamente")
    }catch{
        res.status(500).send("Error al enviar los datos")
    }

    }
}

module.exports = ContactosController;