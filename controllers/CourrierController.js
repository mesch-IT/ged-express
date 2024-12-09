const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Créer un nouveau courrier
exports.create = async (req, res) => {
    const {
        numero_ref,
        objet,
        nom_expediteur,
        prenom_expediteur,
        telephone_expediteur,
        statut,
        userId,
    } = req.body;

    try {
        const newCourrier = await prisma.courrier.create({
            data: {
                numero_ref,
                objet,
                nom_expediteur,
                prenom_expediteur,
                telephone_expediteur,
                statut: statut || 'En attente',
                User: {
                    connect: { id: userId }, // Relie le courrier à un utilisateur existant
                },
            },
        });
        res.status(201).json(newCourrier);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du courrier', error });
    }
};

// Obtenir tous les courriers
exports.getAll = async (req, res) => {
    try {
        const courriers = await prisma.courrier.findMany({
            include: {
                User: true,
                Traitement: true, // Inclut les relations si nécessaires
            },
        });
        res.status(200).json(courriers);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des courriers', error });
    }
};

// Obtenir un courrier par ID
exports.getById = async (req, res) => {
    const { id } = req.params;

    try {
        const courrier = await prisma.courrier.findUnique({
            where: { id: parseInt(id) },
            include: {
                User: true,
                Traitement: true,
            },
        });

        if (!courrier) {
            return res.status(404).json({ message: 'Courrier introuvable' });
        }

        res.status(200).json(courrier);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du courrier', error });
    }
};

// Mettre à jour un courrier
exports.update = async (req, res) => {
    const { id } = req.params;
    const {
        numero_ref,
        objet,
        nom_expediteur,
        prenom_expediteur,
        telephone_expediteur,
        statut,
        userId,
    } = req.body;

    try {
        const updatedCourrier = await prisma.courrier.update({
            where: { id: parseInt(id) },
            data: {
                numero_ref,
                objet,
                nom_expediteur,
                prenom_expediteur,
                telephone_expediteur,
                statut,
                userId,
            },
        });

        res.status(200).json(updatedCourrier);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du courrier', error });
    }
};

// Supprimer un courrier
exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.courrier.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: 'Courrier supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du courrier', error });
    }
};
