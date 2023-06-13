import prisma from "@prisma/client";
import dotenv from "dotenv";
import { Coordinates, isUserObject } from "../types/ModelTypes";
import Logging from "../utils/Logging";
import { FastifyReply, FastifyRequest } from "fastify";
import { CoordinatesInput } from "schemas/RestaurantSchema";
import { nearbyFoodOptions } from "../utils/GooglePlaces";

dotenv.config();






export default class Restaurant {
    /*
    need to store restaurant details 
        1. getRestaurantsByLocation (google maps api)
        2. 
    */
    public static getNearbyFood = async (req: FastifyRequest<{Body: CoordinatesInput}>, reply: FastifyReply) => {
        try {
            if (isUserObject(req.user)) {
                const location = req.body   
                const restaurants = await nearbyFoodOptions(location);
                if (restaurants) {
                    Logging.info("--- successfully queried for nearby restaurants ---")
                    reply.send(restaurants)
                } else {
                    Logging.warn("There are no restaurants with in this area of radius")
                }
            }
        } catch (error) {
            Logging.error(error)
        }
    }
    
}