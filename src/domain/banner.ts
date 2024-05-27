import { Document, ObjectId } from 'mongoose';

interface Banner extends Document {
    _id?: string
    bannerImage: any
    title: string
    description: string
    isDeleted: boolean
}

export default Banner