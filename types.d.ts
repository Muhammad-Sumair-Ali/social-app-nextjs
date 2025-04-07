import { Connection } from "mongoose";


declare global {
    const mongoose:{
        conn: Connection | null
        promise: Promise<Connection> | null 
    }
}

export {};