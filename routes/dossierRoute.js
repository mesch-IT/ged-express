const express = require('express');
const router = express.Router();
const dossierController = require('../controllers/DossierController')


router.get('/dossiers', dossierController.getDossiers)
router.post('/dossiers', dossierController.createDossier)
router.post('/courriers/link', dossierController.linkCourrierToDossier)


module.exports = router