import { Request, Response } from "express";
import TrainerUseCase from "../../useCase/trainerUseCase";


class TrainerController {

    private _TrainerUseCase: TrainerUseCase

    constructor(trainerUseCase: TrainerUseCase) {
        this._TrainerUseCase = trainerUseCase
    }

    async login (req: Request, res: Response) {
        
        try {

        const {email,password} = req.body
        const trainerData=await this._TrainerUseCase.login(email,password)

        if(trainerData?.data?.token){

            res.cookie("trainerJWT", trainerData.data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: "none",
                maxAge: 30 * 24 * 60 * 60 * 1000,
              });
        }
        
        res.status(trainerData.status).json(trainerData.data)
            
            

        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json({
              message: err.message,
              stack: process.env.NODE_ENV === "production" ? null : err.stack,
            });
        }
    }

    async logout (req: Request, res: Response) {
        try {
            res.cookie("trainerJWT", "", {
                httpOnly: true,
                expires: new Date(0),
            })

            res.status(200).json({ message: "Logged out successfully" });
            
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json({
              message: err.message,
              stack: process.env.NODE_ENV === "production" ? null : err.stack,
            });
        }
    }



}

export default TrainerController