


import { FastifyInstance } from "fastify";
import Restaurant from "../controllers/RestaurantController";


export async function RestaurantRoutes (Application: FastifyInstance) {

    Application.post("/nearbyfood", 
    {   preHandler: [Application.authenticate],
    }, Restaurant.getNearbyFood)
}