const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt')

// Créer un nouvel employé
exports.create = async (req, res) => {
    const { nom, prenom, fonction, telephone, email, password, role } = req.body;
    const hashPassword = await bcrypt.hash(password, 10)

    try {
        const newEmployee = await prisma.employee.create({
            data: {
                nom,
                prenom,
                fonction,
                telephone,
                email,
                password:hashPassword,
                role,
            },
        });
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l\'employé', error });
    }
};

// Obtenir tous les employés
exports.getAll = async (req, res) => {
    try {
        const employees = await prisma.employee.findMany({
            where: { isdeleted: false }, // Exclut les employés supprimés
            include: {
                Traitement: true, // Inclut les relations si nécessaires
            },
        });
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des employés', error });
    }
};

// Obtenir un employé par ID
exports.getById = async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await prisma.employee.findUnique({
            where: { id: parseInt(id) },
        });

        if (!employee || employee.isdeleted) {
            return res.status(404).json({ message: 'Employé introuvable' });
        }

        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'employé', error });
    }
};

// Mettre à jour un employé
exports.update = async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, fonction, telephone, email, role, password } = req.body;

    let hashPassword = await bcrypt.hash(password, 10);

    try {
        const updatedEmployee = await prisma.employee.update({
            where: { id: parseInt(id) },
            data: {
                nom,
                prenom,
                fonction,
                telephone,
                email,
                role,
                password:hashPassword,
            },
        });

        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'employé', error });
    }
};

// Supprimer un employé (soft delete)
exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.employee.update({
            where: { id: parseInt(id) },
            data: { isdeleted: true },
        });
        res.status(200).json({ message: 'Employé supprimé avec succès (soft delete)' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'employé', error });
    }
};
