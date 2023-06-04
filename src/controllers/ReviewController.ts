import { PrismaClient } from "@prisma/client";
import { IReview } from "types/ModelTypes";

const prisma = new PrismaClient();

export default class Review {
    
    // write a review
    public static writeReview = async (args: IReview) => {
        try {
            const {userId, restaurantId, ratings, description} = args 
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
    public static displayReviewsByTarget = async (username: string) => {
        try {
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
    public static displayReviewsByRestaurant = async (restaurantName:  string, location: string) => {

        try {
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
        } catch (error) {
            console.log(error)
        }
        
    }

    // can pack these 2 variables into {} object then unpack later one
    // takes in the userId & restaurantId to find specific review for deletion
    public static deleteReview = async (userId: string, restaurantId: string) => {
        try {
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