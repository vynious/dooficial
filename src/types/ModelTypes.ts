

export interface IUser {
    userId: string,
    name: string
    username: string
    email: string
    password: string
}

export interface PUser {
    userId: string
}

export interface PLogin {
    password: string
}

export interface PUsername {
    username: string
} 






export interface IReview {
    userId: string
    restaurantId: string
    ratings: number
    description: string
}

export interface PReview {
    restaurantId: string,
    ratings: number,
    description: string
}


export interface PUserXRest {
    userId: string,
    restaurantId: string
}





export interface IRestaurant {
    name: string,
    location: string,
}



// params typing
