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

        // Met à jour le statut du courrier à "En cours"
        await prisma.courrier.update({
            where: { id: courrierId },
            data: { statut: "En cours" },
        });

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
    const { commentaire, urlsPj,employeeId,idCourrier } = req.body;

    try {
       
        const addComment = await prisma.traitement.create({
            data: {
                commentaire, // Le champ commentaire reste simple
                urlsPj: urlsPj || [], // Par défaut à une liste vide si aucun n'est fourni
                Courrier: {
                    connect: { id: idCourrier }
                }, 
                Employee: {
                    connect: { id: employeeId }
                }
            },

        });

        res.status(200).json({ message: "Commentaire ajouté avec succès",addComment });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du commentaire", error });
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

// Obtenir les courriers assignés à un employé
exports.getAssignedCourriersByEmployee = async (req, res) => {
    const { employeeId } = req.params;

    try {
        // Récupérer tous les traitements de l'employé
        const traitements = await prisma.traitement.findMany({
            where: { employeeId: parseInt(employeeId) },
            include: {
                Courrier: true, // Détails du courrier assigné
            },
            orderBy: { createdAt: "desc" } // Trie par date de création
        });

        // Filtrer les doublons en utilisant un Set pour les IDs des courriers
        const courriersUniques = [];
        const idsCourriers = new Set();

        traitements.forEach(traitement => {
            const courrier = traitement.Courrier;
            if (!idsCourriers.has(courrier.id)) {
                idsCourriers.add(courrier.id); // Ajoute l'ID au Set
                courriersUniques.push(courrier); // Ajoute le courrier unique
            }
        });

        res.status(200).json({
            message: "Courriers assignés récupérés avec succès",
            courriers: courriersUniques
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des courriers assignés :", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};



exports.getTraitementsByCourrier = async (req, res) => {
    const { courrierId } = req.params;

    try {
        // Récupérer tous les traitements liés au courrier avec les employés et les détails du courrier
        const traitements = await prisma.traitement.findMany({
            where: {
                courrierId: parseInt(courrierId),
            },
            include: {
                Courrier: true, // Inclut les détails du courrier
                Employee: true, // Inclut les détails des employés
            },
        });

        res.status(200).json(traitements);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des traitements", error });
    }
};



