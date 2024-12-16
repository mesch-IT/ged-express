const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Assigner un courrier à un employé
exports.assignCourrier = async (req, res) => {
    const { courrierId, employeeId } = req.body;

    try {
        // Vérifie si le courrier existe
        const courrier = await prisma.courrier.findUnique({ where: { id: courrierId } });
        if (!courrier) {
            return res.status(404).json({ message: "Courrier introuvable" });
        }

        // Vérifie si l'employé existe
        const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
        if (!employee || employee.isdeleted) {
            return res.status(404).json({ message: "Employé introuvable ou supprimé" });
        }

        // Crée un enregistrement dans Traitement
        const traitement = await prisma.traitement.create({
            data: {
                courrierId,
                employeeId,
                commentaire: null, // Par défaut à null
            },
        });

        res.status(201).json({ message: "Courrier assigné avec succès", traitement });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'assignation du courrier", error });
    }
};

// Ajouter ou mettre à jour un commentaire
exports.addComment = async (req, res) => {
    const { id } = req.params;
    const { commentaire, urlsPj } = req.body;

    try {
        // Vérifie si le traitement existe
        const traitement = await prisma.traitement.findUnique({ where: { id: parseInt(id) } });
        if (!traitement) {
            return res.status(404).json({ message: "Traitement introuvable" });
        }

        // Met à jour le commentaire
        const updatedTraitement = await prisma.traitement.update({
            where: { id: parseInt(id) },
            data: {
                commentaire,
                urlsPj
            },
        });

        res.status(200).json({ message: "Commentaire mis à jour avec succès", updatedTraitement });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du commentaire", error });
    }
};

// Obtenir tous les traitements
exports.getAll = async (req, res) => {
    try {
        const traitements = await prisma.traitement.findMany({
            include: {
                Employee: true, // Inclut les détails de l'employé
                Courrier: true, // Inclut les détails du courrier
            },
        });

        res.status(200).json(traitements);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des traitements", error });
    }
};

// Obtenir un traitement par ID
exports.getById = async (req, res) => {
    const { id } = req.params;

    try {
        const traitement = await prisma.traitement.findUnique({
            where: { id: parseInt(id) },
            include: {
                Employee: true, // Inclut les détails de l'employé
                Courrier: true, // Inclut les détails du courrier
            },
        });

        if (!traitement) {
            return res.status(404).json({ message: "Traitement introuvable" });
        }

        res.status(200).json(traitement);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du traitement", error });
    }
};
