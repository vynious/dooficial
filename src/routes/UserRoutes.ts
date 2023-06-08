import { FastifyInstance } from "fastify";
import User from "../controllers/UserController";
import { $ref } from "../schemas/UserSchema";

export async function UserRoutes (Application: FastifyInstance)  {
    // url : http://localhost:3001/api/user/
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

    Application.get("/profile", 
    {   preHandler: [Application.authenticate],
        schema: {
            response: {
                200: $ref("UserCoreSchema")
            }
        }
    }, User.getUser)

    Application.patch("/password/update", 
    {   preHandler: [Application.authenticate],
        schema: {
        body: $ref("PasswordSchema"),
        response: {
            201: $ref("UserCoreSchema")
        }
    }}, User.updatePassword)


    Application.patch("/username/update",
    {   preHandler: [Application.authenticate],
        schema: {
        body: $ref("UsernameSchema"),
        response: {
            200: $ref("UserCoreSchema")
        }
    }}, User.updateUsername)


    Application.delete("/profile/delete",
    {   preHandler: [Application.authenticate],
    }, User.deleteUser)


   
    

}