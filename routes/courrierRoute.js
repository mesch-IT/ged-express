const express = require('express');
const router = express.Router();
const courrierController = require('../controllers/CourrierController');

// Routes CRUD
router.post('/courriers', courrierController.create); // Créer un courrier
router.get('/courriers', courrierController.getAll); // Obtenir tous les courriers
router.get('/courriers/:id', courrierController.getById); // Obtenir un courrier par ID
router.put('/courriers/:id', courrierController.update); // Mettre à jour un courrier
router.delete('/courriers/:id', courrierController.delete); // Supprimer un courrier
router.patch('/courriers/:courrierId/close', courrierController.closeCourrier)

module.exports = router;
