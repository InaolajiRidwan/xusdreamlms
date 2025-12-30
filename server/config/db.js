import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.CONNECTIONDB_URL}`);
    console.log("mongoDb connected ☎️");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDb;
