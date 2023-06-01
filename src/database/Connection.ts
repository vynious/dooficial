import { PrismaClient } from "@prisma/client";
import { IReview } from "types/IReview";
import { IUserDetails } from "types/IUserDetails";

const prisma = new PrismaClient();
 
export const createUser = async (details: IUserDetails) => {
    const {name, email, password, username} = details
    const user = await prisma.user.create({ data: {
        username: username,
        name: name,
        email :email,
        password: password
    }})
    console.log("successfully created -> " ,user);
}

export const writeReview = async (details: IReview) => {
    const {userId, restaurantId, rating, description} = details 
    const review = await prisma.reviews.create({data: {
        userId: userId,
        restaurantId: restaurantId,
        ratings: rating,
        description: description,
    }})
    console.log("successfully wrote a review -> ", review);
}