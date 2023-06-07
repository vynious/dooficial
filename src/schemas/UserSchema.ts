import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";


// Input Validation for Users 
/*
    This page needs some refractoring to make it neatier
    too many redundant schemas that can be made concise.
*/

/// single field 
const PasswordSchema = z.object({
    password: z.string().min(8, { message: "Minimum password length is 8" })
});

const UsernameSchema = z.object({
    username: z.string({
        required_error: "Missing username",
        invalid_type_error: "Only strings allowed"
    })
})

const UUIDSchema = z.object({
    id: z.string()
})

const EmailSchema = z.object({
    email: z.string().email({ message: "Invalid Email Address" })
})

const NameSchema = z.object({
    name: z.string({
        required_error: "Missing name",
        invalid_type_error: "Only strings allowed"
    }),
})

const UserCoreSchema = z.object({
    ...NameSchema.shape,
    ...UsernameSchema.shape,
    ...EmailSchema.shape,
})

const UserCreationSchema = z.object({
    ...UserCoreSchema.shape,
    ...PasswordSchema.shape
})

const UserSchema = z.object({
    ...UUIDSchema.shape,
    ...UserCreationSchema.shape
})

const UserLoginSchema = z.object({
    ...EmailSchema.shape,
    ...PasswordSchema.shape
})

const UserLoginResponseSchema = z.object({
    accessToken: z.string()
})

///

// used as interface for type casting user's inputs in req.body/params 
export type CreateUserInput = z.infer<typeof UserCreationSchema>
export type UserLoginInput = z.infer<typeof UserLoginSchema>
export type PasswordInput = z.infer<typeof PasswordSchema>
export type UsernameInput = z.infer<typeof UsernameSchema>
export type EmailInput = z.infer<typeof EmailSchema>
export type NameInput = z.infer<typeof NameSchema>
export type UUIDInput = z.infer<typeof UUIDSchema>
export type IUser = z.infer<typeof UserSchema>

export const {schemas: UserSchemas, $ref } = buildJsonSchemas({
    UUIDSchema,
    NameSchema,
    EmailSchema,
    PasswordSchema,
    UsernameSchema,
    UserCoreSchema,
    UserCreationSchema,
    UserLoginSchema,
    UserSchema,
    UserLoginResponseSchema
})