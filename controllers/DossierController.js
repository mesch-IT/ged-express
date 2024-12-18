const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



exports.createDossier = async (req, res) => {
    const { name, parentId } = req.body;
    try {
        const dossier = await prisma.dossier.create({
            data: {
                name,
                parentId: parseInt(parentId) || null, // null pour un dossier racine
            },
        });
        res.status(201).json(dossier);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du dossier.' });
    }
};

exports.linkCourrierToDossier = async (req, res) => {
    const { courrierId, dossierId } = req.body;

    try {
        // Vérifie si le courrier existe
        const courrier = await prisma.courrier.findUnique({
            where: { id: parseInt(courrierId) },
        });

        if (!courrier) {
            return res.status(404).json({ error: "Courrier introuvable." });
        }

        // Vérifie si le dossier existe
        const dossier = await prisma.dossier.findUnique({
            where: { id: parseInt(dossierId) },
        });

        if (!dossier) {
            return res.status(404).json({ error: "Dossier introuvable." });
        }

        // Met à jour le courrier pour lier le dossier
        const updatedCourrier = await prisma.courrier.update({
            where: { id: parseInt(courrierId) },
            data: { dossierId: parseInt(dossierId) },
        });

        res.status(200).json(updatedCourrier);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de l'association du courrier au dossier." });
    }
};



exports.getDossiers = async (req,res) => {
    try {
        const dossiers = await prisma.dossier.findMany({
            where: { parentId: null }, // Récupère uniquement les dossiers racines
            include: {
                children: true, // Inclut les sous-dossiers
                courriers: true, // Inclut les courriers
            },
        });
        res.status(200).json(dossiers);
    } catch (error) {
        res.status(500).json({ error});
    }
};

