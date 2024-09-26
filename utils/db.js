import mongoose from "mongoose";
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

main().then(() => console.log("Connected")).catch((err) => console.log(err));
export default main