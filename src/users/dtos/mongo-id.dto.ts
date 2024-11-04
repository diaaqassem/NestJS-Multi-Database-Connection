import { IsMongoId } from "class-validator";

export class MongoId {
    @IsMongoId()
    id: string; // Replace with the actual Mongoose ObjectId type in your application. For example, 'mongoose.Types.ObjectId' in Node.js with Mongoose.js
}