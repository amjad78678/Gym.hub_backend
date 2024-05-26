import gymReviewsModel from "../db/gymReviewsModel"

class GymReviewsRepository{


    async addGymReview(userId:string,body:any){
        const review = await gymReviewsModel.create({
            ...body,
            userId
        })
        return review
    }
    async getAllGymReviews(gymId:string){
        const reviews = await gymReviewsModel.find({gymId:gymId}).populate("userId")
        return reviews
    }

    async isUserReviewed(userId:string,gymId:string){
        const review = await gymReviewsModel.findOne({userId:userId,gymId:gymId})
        return review
    }

    async updateRatingGym(reviewData:any,reviewId:string){
        const review = await gymReviewsModel.findByIdAndUpdate(reviewId,reviewData)
        return review
    }


}

export default GymReviewsRepository