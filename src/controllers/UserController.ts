import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { hash } from "../utils/Hashing";
import { FastifyRequest, FastifyReply } from "fastify";
import { CreateUserInput, PasswordInput, UUIDInput, UserLoginInput, UsernameInput} from "schemas/UserSchema";
import { Application } from "../App";

import { isUserObject } from "../types/ModelTypes";

const prisma = new PrismaClient();
 
/*
Type Casting Inputs -> Which to use, How to efficiently do it ?? 
-- refer to schema page for refractoring then use the refractored.
*/


export default class User {

    // args -> object of IUser but not saved in DB yet
    public static createUser = async (req: FastifyRequest<{Body: CreateUserInput}>, reply: FastifyReply) => {
        try {
            const {name, username, email, password} = req.body
            const hashedPassword = await hash(password);
            const user: CreateUserInput = await prisma.user.create({ data: {
                username: username,
                name: name,
                email :email,
                password: hashedPassword
            }})
            console.log("successfully created -> ",user);
            reply.status(201).send(user);
        } catch (error) {
            console.log(error);
        }
    }

    public static loginUser = async (req: FastifyRequest<{Body: UserLoginInput}>, reply: FastifyReply) => {
        try {
            const {email, password} = req.body;
            console.log(email, password);
            const user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });
            console.log(user);
            if (user && await bcrypt.compare(password, user.password)) {
                const accessToken = Application.jwt.sign(user, {expiresIn: "5m"});
                console.log(accessToken)
                reply.send({accessToken: accessToken})
            } else {
                console.log(`${email} does not exist/password wrong`);
            }
        } catch (error) {
            console.log(error); 
        }
    }

    public static updatePassword = async (req: FastifyRequest<{Body: PasswordInput}>, reply: FastifyReply) => {
        try {   
                if (isUserObject(req.user)) {
                    const {password} = req.body;
                    const id = req.user.id
                    const updatedHashedPassword = await hash(password);
                    const updatedUserPassword = await prisma.user.update({
                        where : {
                            id: id
                        }, 
                        data: {
                            password: updatedHashedPassword
                        }
                    })
                    if (updatedUserPassword) {
                        console.log(`---successfully updated password for ${id}---`)
                        reply.status(201).send(updatedUserPassword)
                    } else {
                        console.log("update password unsuccessful")
                    }
                }

                
        } catch (error) {
            console.log(error)
        }
        
    }

    
    public static updateUsername = async (req: FastifyRequest<{ Body: UsernameInput}>, reply: FastifyReply) => {
        try {
            if (isUserObject(req.user)) {
                const id = req.user.id
                const {username} = req.body;
                const updatedUsername = await prisma.user.update({
                    where: {
                        id: id
                    },
                    data: {
                        username: username
                    }
                })
                if (updatedUsername) {
                    console.log(`successfully updated username to ${username}`)
                    reply.send(updatedUsername)
                } else {
                    console.log("update username unsuccessful");
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    // deleting in order of foreign key constraints 
    public static deleteUser = async (req: FastifyRequest<{}>, reply: FastifyReply) => {
  
        try {
            if (isUserObject(req.user)) {
                const id = req.user.id;
                const deleteReviews = prisma.reviews.deleteMany({
                    where: {
                        userId: id
                    }
                });
                const deleteFollowing = prisma.follows.deleteMany({
                    where: {
                        userId: id
                    }
                })
                const deleteFollowers = prisma.follows.deleteMany({
                    where: {
                        friendId: id
                    }
                });
                const deleteUser = prisma.user.delete({
                    where: {
                        id: id
                    }
                })
                await prisma.$transaction([deleteReviews, deleteFollowing, deleteFollowers, deleteUser])
                console.log(`successfully deleted all tracers of ${id}`)
            }

        } catch (error) {
            console.log(error)
        }
  
    }

    public static getUser = async (req: FastifyRequest<{}>, reply: FastifyReply) => {
        try {
            if (isUserObject(req.user)) {
                reply.send(req.user)
            } else {
                console.log("idk why the code will even make it here? because validation will settle")
            }
        } catch (error) {
            console.log(error)
        }
    }

    public static follow = async () => {

    }


    public static RESET = async () => {
        await prisma.user.deleteMany({})
    }

    
}