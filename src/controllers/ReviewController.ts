import { PrismaClient } from "@prisma/client";
import { IReview } from "types/ModelTypes";

const prisma = new PrismaClient();

export default class Review {
    
    // write a review
    public static writeReview = async (args: IReview) => {
        const {userId, restaurantId, ratings, description} = args 
        const review: IReview = await prisma.reviews.create({data: {
            userId: userId,
            restaurantId: restaurantId,
            ratings: ratings,
            description: description,
        }})
        console.log("successfully wrote a review -> ", review);
    }



    



    // filter reviews by users in cronological order
    public static displayReviewsByTarget = async (username: string) => {
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
    }






    // filter reviews by restaurant & location in cronological order
    public static displayReviewsByRestaurant = async (restaurantName:  string, location: string) => {
        const reviews: IReview[] | null = await prisma.reviews.findMany({
            where: {
                restaurant: {
                    name: restaurantName,
                    location: location
                }
            },
            orderBy: {
                datetime: "desc"
            }
        });
        if (reviews) {
            console.log(`these are the reviews for ${restaurantName} located at ${location}`)
        } else {
            console.log("restaurant has no reviews")
        }
    }
    


}