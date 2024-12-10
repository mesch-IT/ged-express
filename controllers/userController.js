const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('dotenv').config()


exports.getUser = async (req, res) => {


    try {
        const users = await prisma.user.findMany()

        return res.status(200).json({
            message: 'Users fetched successfully',
            users
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error fetching users',
            error
        })
    }
}

exports.createUser = async (req,res) => { 

    const { email, password,role } = req.body

      const hashPassword = await bcrypt.hash(password,10)
    
        try {
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashPassword,  
                    role
                }
            })

            return res.status(201).json({
                message: 'User created successfully',
                user
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Error creating user',
                error
            })
        }
}
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifie si l'utilisateur existe dans la table User
        let entity = await prisma.user.findFirst({
            where: {
                email: email,
                isdeleted: false,
            },
        });

        let type = 'user'; // Par défaut, considère que c'est un User

        // Si l'utilisateur n'existe pas dans User, vérifier dans Employee
        if (!entity) {
            entity = await prisma.employee.findFirst({
                where: {
                    email: email, // Pour les employés, on utilise l'email comme identifiant
                    isdeleted: false,
                },
            });
            type = 'employee'; // Change le type si c'est un Employee
        }

        // Si aucune entité n'a été trouvée
        if (!entity) {
            return res.status(400).json({
                message: 'Identifiant ou mot de passe incorrect',
            });
        }

        // Vérifie la validité du mot de passe
        const isPasswordValid = await bcrypt.compare(password, entity.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'Identifiant ou mot de passe incorrect',
            });
        }

        // Crée un token JWT avec le type pour différencier les User et Employee
        const token = jwt.sign(
            {
                id: entity.id,
                email: type === 'user' ? entity.email : entity.email, // Username pour User, email pour Employee
                role: entity.role,
                type, // Ajoute 'user' ou 'employee' dans le token
            },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        );

        // Envoie le token JWT dans la réponse
        res.header('auth-token', token).json({
            message: 'Connexion réussie',
            token,
        });
    } catch (error) {
        console.error('Erreur lors du login:', error);
        res.status(500).json({
            message: 'Erreur interne du serveur',
            error,
        });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params; // ID de l'utilisateur à mettre à jour
        const { email, password, role } = req.body; // Données envoyées pour la mise à jour

        // Vérification si l'utilisateur existe
        const existingUser = await prisma.user.findUnique({
            where: { id: parseInt(id, 10) },
        });

        if (!existingUser) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé',
            });
        }

        // Hash du mot de passe si fourni
        let hashPassword = existingUser.password; // Conserve l'ancien mot de passe par défaut
        if (password) {
            hashPassword = await bcrypt.hash(password, 10);
        }

        // Mise à jour de l'utilisateur
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id, 10) },
            data: {
                email: email || existingUser.email, // Garde l'ancien email si aucun n'est fourni
                password: hashPassword,
                role: role || existingUser.role, // Garde l'ancien rôle si aucun n'est fourni
            },
        });

        res.status(200).json({
            message: 'Utilisateur mis à jour avec succès', 
            user: updatedUser,
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        res.status(500).json({
            message: 'Erreur interne du serveur',
            error,
        });
    }
};


