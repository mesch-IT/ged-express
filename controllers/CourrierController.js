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
        keywords, // Mots-clés ajoutés dans la requête
    } = req.body;

    try {
        let dossier = null;

        // Vérifier si un dossier existe déjà pour les mots-clés donnés
        if (keywords && keywords.length > 0) {
            dossier = await prisma.dossier.findFirst({
                where: {
                    name: `Dossier - ${keywords.join(", ")}`, // Vérifie si un dossier avec ces mots-clés existe
                },
            });
        }

        // Si aucun dossier n'existe pour ces mots-clés, créer un nouveau dossier
        if (!dossier) {
            dossier = await prisma.dossier.create({
                data: {
                    name: `Dossier - ${keywords.join(", ")}`,
                },
            });
        }

        // Créer le courrier et l'associer au dossier et à l'utilisateur
        const newCourrier = await prisma.courrier.create({
            data: {
                numero_ref,
                objet,
                nom_expediteur,
                prenom_expediteur,
                telephone_expediteur,
                statut: statut || 'En attente',
                keywords: keywords || [], // Enregistrer les mots-clés
                User: {
                    connect: { id: userId }, // Relie le courrier à un utilisateur existant
                },
                dossier: {
                    connect: { id: dossier.id }, // Relie le courrier au dossier
                },
            },
        });

        res.status(201).json(newCourrier);
    } catch (error) {
        console.error("Erreur lors de la création du courrier :", error);
        res.status(500).json({ message: 'Erreur lors de la création du courrier', error });
    }
};

exports.getAllKeywords = async (req, res) => {
    try {
        const keywords = await prisma.courrier.findMany({
            select: {
                keywords: true, // Récupère uniquement le champ "keywords"
            },
        });

        // Extraire les mots-clés uniques
        const uniqueKeywords = [...new Set(
            keywords
                .flatMap((item) => item.keywords) // Combine tous les tableaux de mots-clés
                .filter((keyword) => keyword && keyword.trim() !== "") // Ignore les mots-clés vides ou null
        )];

        res.status(200).json(uniqueKeywords);
    } catch (error) {
        console.error("Erreur lors de la récupération des mots-clés :", error);
        res.status(500).json({ message: 'Erreur lors de la récupération des mots-clés', error });
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

// Fonction pour changer le statut d'un courrier en "Clôturé"
exports.closeCourrier = async (req, res) => {
    const { courrierId } = req.params; // Récupère l'ID du courrier depuis les paramètres de l'URL

    try {
        const updatedCourrier = await prisma.courrier.update({
            where: { id: Number(courrierId) }, // Filtre par l'ID du courrier
            data: { statut: 'Clôturé' }, // Met à jour le statut en "Clôturé"
        });

        res.status(200).json({
            message: 'Statut du courrier mis à jour en Clôturé',
            courrier: updatedCourrier,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la mise à jour du statut du courrier',
            error,
        });
    }
};
