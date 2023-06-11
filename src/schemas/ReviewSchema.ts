import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";


const DescriptionSchema = z.object({
    description: z.string()
})

const RatingSchema = z.object({
    ratings: z.number(),
})

const ReviewSchema = z.object({
    userId: z.string(),
    restaurantId: z.string(),
    ...RatingSchema.shape,
    ...DescriptionSchema.shape
})

export type RatingInput = z.infer<typeof RatingSchema>
export type DescriptionInput = z.infer<typeof DescriptionSchema>
export type ReviewInput = z.infer<typeof ReviewSchema>

export const {schemas: ReviewSchemas, $ref} = buildJsonSchemas({
    DescriptionSchema,
    RatingSchema,
    ReviewSchema
})