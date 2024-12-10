const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const auth = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Accès refusé. Token manquant.');

    try {
        // Vérification et décryptage du token
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verified;

        const { id, type } = verified; // Récupération de l'id et du type ('user' ou 'employee')

        let entity;

        // Vérification dans la base de données en fonction du type
        if (type === 'user') {
            entity = await prisma.user.findUnique({
                where: { id, isdeleted: false },
            });
        } else if (type === 'employee') {
            entity = await prisma.employee.findUnique({
                where: { id, isdeleted: false },
            });
        } else {
            return res.status(401).send('Accès refusé. Type d\'utilisateur inconnu.');
        }

        if (!entity) return res.status(401).send('Accès refusé. Utilisateur non trouvé.');

        // Attacher les données de l'utilisateur/employé au req pour un accès ultérieur
        req.user = entity;
        next();
    } catch (err) {
        console.error('Auth error:', err);
        res.status(400).send({
            message: 'Token invalide.',
            error: err,
        });
    }
};

module.exports = auth;
