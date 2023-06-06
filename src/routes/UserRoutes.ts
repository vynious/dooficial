import { FastifyInstance } from "fastify";
import User from "../controllers/UserController";
import { $ref } from "../schemas/UserSchema";

export async function UserRoutes (Application: FastifyInstance)  {
    // Application.get("/", )
    Application.post("/register", 
    {   schema: {
        body: $ref("UserCreationSchema"),
        response: {
            201: $ref("UserCoreSchema")
        } 
    }}, User.createUser);

    Application.post("/login", 
    {   schema: {
        body: $ref("UserLoginSchema"),
        response: {
            200: $ref("UserLoginResponseSchema")
        }
    }}, User.loginUser)

    Application.get("/:id", 
    {

    }, User.getUser)

    Application.post("/password/update", 
    {   preHandler: [Application.authenticate],
        schema: {
        body: $ref("PasswordSchema"),
        response: {
            201: $ref("UserCoreSchema")
        }
    }}, User.updatePassword)


    Application.post("/:id/username/update",
    {   preHandler: [Application.authenticate],
        schema: {
        body: $ref("UsernameSchema"),
        response: {
            200: $ref("UserCoreSchema")
        }
    }}, User.updateUsername)


   
    

}