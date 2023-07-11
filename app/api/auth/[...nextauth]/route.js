import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google'

import User from "@models/user";
import { connectToDB } from "@utils/database";

const handler = NextAuth({
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks:{
        async session({session}) {
            const seesionUser = await User.findOne({
                email: session.user.email
            })
    
            session.user.id = seesionUser._id.toString();

            return session
        },
    
        async signIn({profile}){
            try {
                await connectToDB()
    
                // check if user already exist
                const userexist = await User.findOne({
                    email:profile.email
                })
    
                //add new user
                if (!userexist) {
                    await User.create({
                        email: profile.email,
                        username:  profile.name.replace(" ", "").toLowerCase(),
                        image:profile.picture
                    })
                }
                return true
            } catch (error) {
                console.log(error)
                return false
            }
        }
    }
})

export {handler as GET, handler as POST}