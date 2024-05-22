import gymReviewsModel from "../db/gymReviewsModel"

class GymReviewsRepository{


    async addGymReview(userId:string,body:any){
        const review = await gymReviewsModel.create({
            ...body,
            userId
        })
        return review
    }

}

export default GymReviewsRepository