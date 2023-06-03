import { PrismaClient } from "@prisma/client";
import { IReview } from "types/ModelTypes";

const prisma = new PrismaClient();

export default class Review {
 
    public static writeReview = async (args: IReview) => {
        const {userId, restaurantId, rating, description} = args 
        const review = await prisma.reviews.create({data: {
            userId: userId,
            restaurantId: restaurantId,
            ratings: rating,
            description: description,
        }})
        console.log("successfully wrote a review -> ", review);
    }



}