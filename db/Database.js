const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Hapus opsi useCreateIndex dan useFindAndModify
    })
    .then(() => {
      console.log(`MongoDB connected with server: ${mongoose.connection.host}`);
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
      process.exit(1); // Exit process with failure
    });
};

module.exports = connectDatabase;
