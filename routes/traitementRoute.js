const express = require('express');
const router = express.Router();
const traitementController = require('../controllers/traitementController');

// Routes CRUD
router.post('/traitement', traitementController.assignCourrier); // Assigner un courrier à un employé
router.put('/traitement/:id', traitementController.addComment); // Ajouter ou mettre à jour un commentaire
router.get('/traitement', traitementController.getAll); // Obtenir tous les traitements
router.get('/traitement/:id', traitementController.getById); // Obtenir un traitement par ID

module.exports = router;
