export interface IUser {
    name: string
    username: string
    email: string
    password: string
}

export interface IReview {
    userId: string
    restaurantId: string
    ratings: number
    description: string
}