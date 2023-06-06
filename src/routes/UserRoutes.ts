import { FastifyInstance } from "fastify";
import User from "../controllers/UserController";
import { $ref } from "../schemas/UserSchema";


export async function UserRoutes (Application: FastifyInstance)  {
    // Application.get("/", )
    Application.post("/create", {schema: {
        body: $ref("UserCreationSchema"),
        response: {
            201: $ref("UserCoreSchema")
        } 
    }}, User.createUser);



    Application.post("/:id/password/update", {schema: {
        body: $ref("PasswordSchema"),
    }}, User.updatePassword)




    Application.post("/:id/username/update", { schema: {
            body: $ref("UsernameSchema"),
            response: {
                200: $ref("UserCoreSchema")
            }
        }}, User.updateUsername)
}