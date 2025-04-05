import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

if(!MONGODB_URL){
    throw new Error("please define mongo db url in .env ")
}

let cashed = global.mongoose

if(!cashed){
    cashed = global.mongoose = {conn:null , promise:null}
    
}

export async function connectDatabase(){
    if(cashed.conn){
        return cashed.conn
    }

    if(!cashed.promise){
        const opts = {
            bufferCommands:true,
            maxPoolsize :10
        }   
        cashed.promise = mongoose.connect(MONGODB_URL,opts).then(()=> mongoose.connection)
    }


    try {
        cashed.conn = await cashed.promise
    } catch (error) {
        cashed.promise = null
        throw error
    }


    return cashed.conn;

}