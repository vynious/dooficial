import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { hash } from "../utils/Hashing";
import { FastifyRequest, FastifyReply } from "fastify";
import { CreateUserInput, PasswordInput, UUIDInput, UserLoginInput, UsernameInput} from "schemas/UserSchema";
import { Application } from "../App";
import { isUserObject } from "../types/ModelTypes";
import Logging from "../utils/Logging";

const prisma = new PrismaClient();
 
/*
-- functionality for users --
1. register user
2. login user 
3. update username
4. update password
5. delete user account
6. read user details 
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
            Logging.log(`successfully created -> ${user}`);
            reply.status(201).send(user);
        } catch (error) {
            Logging.error(error);
        }
    }

    public static loginUser = async (req: FastifyRequest<{Body: UserLoginInput}>, reply: FastifyReply) => {
        try {
            const {email, password} = req.body;
            const user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });
            if (user && await bcrypt.compare(password, user.password)) {
                const accessToken = Application.jwt.sign(user, {expiresIn: "5m"});
                Logging.log(`Access Token -> ${accessToken}`)
                reply.send({accessToken: accessToken})
            } else {
                Logging.warn(`${email} does not exist/password wrong`);
            }
        } catch (error) {
            Logging.error(error); 
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
                        Logging.log(`Successfully updated password for ${id}`)
                        reply.status(201).send(updatedUserPassword)
                    } else {
                        Logging.warn("update password unsuccessful")
                    }
                }
        } catch (error) {
            Logging.error(error)
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
                    Logging.log(`Successfully updated username to ${username}`)
                    reply.send(updatedUsername)
                } else {
                    Logging.warn("update username unsuccessful");
                }
            }
        } catch (error) {
            Logging.error(error)
        }
    }

    // deleting in order of foreign key constraints 
    public static deleteUser = async (req: FastifyRequest<{}>, reply: FastifyReply) => {
        try {
            if (isUserObject(req.user)) {
                const id = req.user.id
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
                Logging.log(`Successfully deleted all tracers of ${id}`)
            }

        } catch (error) {
            Logging.error(error)
        }
  
    }

    public static getUser = async (req: FastifyRequest<{}>, reply: FastifyReply) => {
        try {
            if (isUserObject(req.user)) {
                Logging.log("successfully retrieved details")
                reply.send(req.user)
            } else {
                Logging.warn("idk why the code will even make it here? because validation will settle")
            }
        } catch (error) {
            Logging.error(error)
        }
    }



    public static RESET = async () => {
        await prisma.user.deleteMany({})
    }

    
}