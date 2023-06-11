import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { isUserObject } from "../types/ModelTypes";
import { ReviewInput } from "../schemas/ReviewSchema";
import Logging from "../utils/Logging";
import { RestaurantInput } from "../schemas/RestaurantSchema";
// add on missing schemas

const prisma = new PrismaClient();

export default class Review {
    
    // write a review
    public static writeReview = async (req: FastifyRequest <{Body: ReviewInput}>, reply: FastifyReply) => {
        try {
            if (isUserObject(req.user)) {
                const userId = req.user.id;
                const {restaurantId, ratings, description} = req.body
                const review = await prisma.reviews.create({data: {
                    userId: userId,
                    restaurantId: restaurantId,
                    ratings: ratings,
                    description: description,
                }})
                Logging.log(`successfully wrote a review -> ${review}`);
            }
        } catch (error) {
            Logging.error(error)
        }
       
    }


    // filter reviews by users in cronological order
    public static displayReviewsByTarget = async (req: FastifyRequest<{}>, reply: FastifyReply) => {
        
        try {
            if (isUserObject(req.user)) {
                const userId = req.user.id
                const reviews = await prisma.reviews.findMany({
                    where: {
                        id: userId
                    },
                    orderBy: {
                        datetime: "desc"  
                    }
                });
                if (reviews) {
                    Logging.log(`these are the reviews by`)
                } else {
                    Logging.warn("user has not written any reviews")
                }
            }
        } catch (error) {
            Logging.error(error)
        }

    }


    // filter reviews by restaurant name & location in cronological order
    public static displayReviewsByRestaurant = async (req: FastifyRequest<{Body: RestaurantInput}>, reply: FastifyReply) => {
        try {
            const {name, location} = req.body;
            const reviews= await prisma.reviews.findMany({
                where: {
                    restaurant: {
                        name: name,
                        location: location
                    }
                },
                orderBy: {
                    datetime: "desc"
                }
            });
            if (reviews) {
                Logging.log(`these are the reviews for ${name} located at ${location}`)
            } else {
                Logging.warn("restaurant has no reviews")
            }
        } catch (error) {
            Logging.error(error)
        }
        
    }

    // can pack these 2 variables into {} object then unpack later one
    // takes in the userId & restaurantId to find specific review for deletion
    public static deleteReview = async (req: FastifyRequest<{Body: RestaurantInput}>, reply: FastifyReply) => {
        try {
            if (isUserObject(req.user)) {
                const userId = req.user.id
                const {name, location} = req.body;
                const restaurant = await prisma.restaurant.findUnique({
                    where: {
                        name_location: {name: name, location: location}
                    }
                })
                if (restaurant) {
                    const reviewForDelete = await prisma.reviews.delete({
                        where: {
                            userId_restaurantId: {userId: userId, restaurantId: restaurant.id}
    
                        }
                    });
                    if (reviewForDelete) {
                        Logging.log("review successfully deleted")
                    } else {
                        Logging.warn("cannot find specific review")
                    }
                } else {
                    Logging.warn("restaurant does not exists")
                }   
            }
        } catch (error) {
            Logging.error(error)
        }
    }


    public static updateReview = async () => {
        
    }

}