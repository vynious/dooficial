import { PrismaClient } from "@prisma/client";
import { FastifyRequest, FastifyReply } from "fastify";
import { CreateUserInput, IUser, PasswordInput, UUIDInput, UserLoginInput, UsernameInput} from "schemas/UserSchema";
import { isUserObject } from "../types/ModelTypes";
import Logging from "../utils/Logging";


const prisma = new PrismaClient();

export default class Follows {

    public static followUser = async (req: FastifyRequest<{Params: UUIDInput}>,  reply: FastifyReply) => {
        try {
            console.log("!2")
            if (isUserObject(req.user)) {
                const currentUser = req.user
                const {id} = req.params // id of person of interest
                const targetId = await prisma.user.findUnique({
                    where: {
                        id: id
                    }
                });
                
                const follow = await prisma.follows.create({ data: {
                    userId: currentUser.id,
                    friendId: id
                }});
                
                if (targetId && follow) {
                    Logging.info(`new follow -> ${follow}`);
                    Logging.info(`${currentUser.name} followed ${targetId.name}`)
                } else {
                    Logging.warn(`user id: ${id} does not exist`);
                }
            }
        } catch (error) {
            Logging.error(error)
        }
    }



}