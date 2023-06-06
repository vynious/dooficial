import { PrismaClient } from "@prisma/client";
import { IUser, PLogin, PUser, PUsername } from "types/ModelTypes";
import { hash } from "../utils/Hashing";
import { FastifyRequest, FastifyReply } from "fastify";
import { CreateUserInput, PasswordInput, UUIDInput, UserLoginInput, UsernameInput} from "schemas/UserSchema";

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
            // unhash and save in session ? 
        } catch (error) {
            console.log(error);
        }
    }

    public static updatePassword = async (req: FastifyRequest<{Params: UUIDInput , Body: PasswordInput}>, reply: FastifyReply) => {
        try {
            const {password} = req.body;
            const {id} = req.params;
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
                console.log(`successfully updated password for ${id}`)
            } else {
                console.log("update password unsuccessful")
            }
        } catch (error) {
            console.log(error)
        }
        
    }

    
    public static updateUsername = async (req: FastifyRequest<{Params: UUIDInput, Body: UsernameInput}>, reply: FastifyReply) => {
        try {
            console.log(req.params, req.body);
            const {id} = req.params;
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
        } catch (error) {
            console.log(error)
        }
    }

    // deleting in order of foreign key constraints 
    public static deleteUser = async (req: FastifyRequest<{Params: UUIDInput}>, reply: FastifyReply) => {
  
        try {
            const {id} = req.params
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