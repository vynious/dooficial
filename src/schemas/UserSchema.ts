import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";


// Input Validation for Users 
  
const CreateUserSchema = z.object({
    name: z.string({
        required_error: "Missing name",
        invalid_type_error: "Only strings allowed"
    }),
    username: z.string({
        required_error: "Missing username",
        invalid_type_error: "Only strings allowed"
    }),
    email: z.string().email({ message: "Invalid Email Address" }),
    password: z.string().min(8, { message: "Minimum password length is 8" })
  });
  
const CreateUserResponseSchema = z.object({
    id: z.string(),
    name: z.string({
        required_error: "Missing name",
        invalid_type_error: "Only strings allowed"
    }),
    username: z.string({
        required_error: "Missing username",
        invalid_type_error: "Only strings allowed"
    }),
    email: z.string().email({ message: "Invalid Email Address" })
})

const LoginSchema = z.object({
    email: z.string().email({message: "Invalid email"}),
    password: z.string()
})

const CreateLoginResponseSchema = z.object({
    accessToken: z.string()
})



export type CreateUserInput = z.infer<typeof CreateUserSchema>
export type UserLoginInput = z.infer<typeof LoginSchema>