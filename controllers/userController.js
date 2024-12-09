const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
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

    const { username, password,role } = req.body

      const hashPassword = await bcrypt.hash(password,10)
    
        try {
            const user = await prisma.user.create({
                data: {
                    username,
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

exports.updateUser = async (req, res) => { 

    const { id } = req.params
    const { email, password, name, firstName, phone, address, sexe, role } = req.body

    const hashPassword = await bcrypt.hash(password,10)
    
    const user = await prisma.user.update({
        where: { id },
         
    })

}

