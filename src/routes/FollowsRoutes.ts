import { FastifyInstance } from "fastify";
import Follows from "../controllers/FollowsController";
import { $ref } from "../schemas/UserSchema";

export async function FollowsRoutes (Application: FastifyInstance) {
    Application.post("/:id", 
    {   preHandler: [Application.authenticate],
    }, Follows.followUser)


}