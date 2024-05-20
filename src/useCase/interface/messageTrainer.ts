import { ObjectId } from "mongoose"

interface iMessageTrainer {

    sender: ObjectId,
    receiver: ObjectId,
    content: string,
}
export default iMessageTrainer