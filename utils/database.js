import mongoose from "mongoose";

let isconnected = false

export const connectToDB = async () => {
    mongoose.set('strictQuery', true)

    if (isconnected) {
        console.log('Mongodb is connected')
        return
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbname: 'share_prompt',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        isconnected = true

        console.log('mongodb connected')
    } catch (error) {
        console.log(error)
    }
}