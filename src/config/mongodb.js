import { MongoClient, ObjectId } from "mongodb";


const url=process.env.DB_URL;
let client;
export const connectToMongoDB=async()=>{
    // Await the connection and let any failure propagate, so the caller can
    // decide not to start the server (rather than silently continuing).
    client=await MongoClient.connect(url);
    console.log("MongoDB (native driver) is connected");
    await createCounter(client.db());
    await createIndexes(client.db());
}

export const getClient =()=>{
    return client;
}

export const getDB= ()=>{
    return client.db();
}

const createCounter = async(db)=>{
    const existingCounter=await db.collection("counters")
        .findOne({_id:'cartItemId'});
        if(!existingCounter){
            await db.collection("counters")
                .insertOne({_id:'cartItemId',value:0});
        }
}
const createIndexes = async(db)=>{
    try {
        await db.collection("products").createIndex({price:1,})
        await db.collection("products").createIndex({name:1,category:-1})

    } catch (err) {
        console.log(err);
    }
}