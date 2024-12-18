const express = require('express');
const router = express.Router();
const traitementController = require('../controllers/traitementController');

// Routes CRUD
router.post('/traitement', traitementController.assignCourrier); // Assigner un courrier à un employé
router.post('/traitement/comment', traitementController.addComment); // Ajouter ou mettre à jour un commentaire
router.get('/traitement', traitementController.getAll); // Obtenir tous les traitements
router.get('/traitement/:id', traitementController.getById); // Obtenir un traitement par ID
// Route pour obtenir les courriers assignés à un employé
router.get('/courriers/assigned/:employeeId', traitementController.getAssignedCourriersByEmployee);
router.get('/courriers/traitement/:courrierId', traitementController.getTraitementsByCourrier);

module.exports = router;
