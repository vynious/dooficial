import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { IRestaurant, IReview, PReview, PUser, PUserXRest, PUsername } from "../types/ModelTypes";

const prisma = new PrismaClient();

export default class Review {
    
    // write a review
    public static writeReview = async (req: FastifyRequest <{Params: PUser, Body: PReview}>, reply: FastifyReply) => {
        try {
            const {userId} = req.params
            const {restaurantId, ratings, description} = req.body
            const review: IReview = await prisma.reviews.create({data: {
                userId: userId,
                restaurantId: restaurantId,
                ratings: ratings,
                description: description,
            }})
            console.log("successfully wrote a review -> ", review);
        } catch (error) {
            console.log(error)
        }
       
    }


    // filter reviews by users in cronological order
    public static displayReviewsByTarget = async (req: FastifyRequest<{Body: PUsername}>, reply: FastifyReply) => {
        
        try {
            const {username} =  req.body;
            const reviews: IReview[] | null = await prisma.reviews.findMany({
                where: {
                    user: {
                        username: username
                    }
                },
                orderBy: {
                    datetime: "desc"  
                }
            });
            if (reviews) {
                console.log(`these are the reviews by`)
            } else {
                console.log("user has not written any reviews")
            }
        } catch (error) {
            console.log(error)
        }

    }


    // filter reviews by restaurant name & location in cronological order
    public static displayReviewsByRestaurant = async (req: FastifyRequest<{Body: IRestaurant}>, reply: FastifyReply) => {
        try {
            const {name, location} = req.body;
            const reviews: IReview[] | null = await prisma.reviews.findMany({
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
                console.log(`these are the reviews for ${name} located at ${location}`)
            } else {
                console.log("restaurant has no reviews")
            }
        } catch (error) {
            console.log(error)
        }
        
    }

    // can pack these 2 variables into {} object then unpack later one
    // takes in the userId & restaurantId to find specific review for deletion
    public static deleteReview = async (req: FastifyRequest<{Params: PUserXRest}>, reply: FastifyReply) => {
        
        try {
            const {userId , restaurantId} = req.params;
            const reviewForDelete: IReview|null = await prisma.reviews.delete({
                where: {
                    userId_restaurantId: {
                        userId: userId,
                        restaurantId: restaurantId
                    }
                }
            });
            if (reviewForDelete) {
                console.log("review successfully deleted")
            } else {
                console.log("cannot find specific review")
            }
        } catch (error) {
            console.log(error)
        }
    }


    public static updateReview = async () => {
        
    }

}