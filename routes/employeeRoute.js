const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Routes CRUD
router.post('/employee', employeeController.create); // Créer un employé
router.get('/employee', employeeController.getAll); // Obtenir tous les employés
router.get('/employee/:id', employeeController.getById); // Obtenir un employé par ID
router.put('/employee/:id', employeeController.update); // Mettre à jour un employé
router.delete('/employee/:id', employeeController.delete); // Supprimer (soft delete) un employé

module.exports = router;
