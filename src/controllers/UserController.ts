import { PrismaClient } from "@prisma/client";
import { IUser } from "types/ModelTypes";
import { hash } from "utils/Hashing";

const prisma = new PrismaClient();
 
export default class User {

    // args -> object of IUser but not saved in DB yet
    public static createUser = async (args: IUser) => {
        const {name, email, password, username} = args
        const hashedPassword = await hash(password);
        const user = await prisma.user.create({ data: {
            username: username,
            name: name,
            email :email,
            password: hashedPassword
        }})
        console.log("successfully created -> " ,user);
    }


    public static updatePassword = async (userId: string ,password:  string) => {
        const updatedHashedPassword = await hash(password);
        const updatedUserPassword = await prisma.user.update({
            where : {
                id: userId
            }, 
            data: {
                password: updatedHashedPassword
            }
        })
        if (updatedUserPassword) {
            console.log(`successfully updated password for ${userId}`)
        } else {
            console.log("update password unsuccessful")
        }
    }

    
    public static updateUsername = async (userId: string, username: string) => {
        const updatedUsername = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                username: username
            }
        })
        if (updatedUsername) {
            console.log(`successfully updated username to ${username}`)
        } else {
            console.log("update username unsuccessful");
        }
    }

    // deleting in order of foreign key constraints 
    public static deleteUser = async (userId: string) => {
        const deleteReviews = prisma.reviews.deleteMany({
            where: {
                userId: userId
            }
        });
        const deleteFollowing = prisma.follows.deleteMany({
            where: {
                userId: userId
            }
        })
        const deleteFollowers = prisma.follows.deleteMany({
            where: {
                friendId: userId
            }
        });
        const deleteUser = prisma.user.delete({
            where: {
                id: userId
            }
        })
        await prisma.$transaction([deleteReviews, deleteFollowing, deleteFollowers, deleteUser])
    }

    
}