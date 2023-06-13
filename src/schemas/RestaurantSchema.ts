import  {z} from "zod"
import { buildJsonSchemas } from "fastify-zod"


/* model Restaurant {
    id String @id @default(uuid())
    name String 
    location String
    reviews Reviews[]
    @@unique([name,location])
} */

export const CoordinatesSchema = z.object({
    lat: z.number(),
    long: z.number()
})

export const RestaurantSchema =  z.object({
    name: z.string(),
    location: z.string(),
})

export type CoordinatesInput = z.infer<typeof CoordinatesSchema>
export type RestaurantInput = z.infer<typeof RestaurantSchema>


