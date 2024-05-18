var express = require('express');
var router = express.Router();
const contactosController=require('../controllers/ContactosController'); 

router.post('/agregarContacto', contactosController.agregarContacto);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',nombre:'Elis lopez', cedula:3181048, seccion:2 });
});

module.exports = router;
