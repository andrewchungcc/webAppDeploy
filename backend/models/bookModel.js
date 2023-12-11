import mongoose from "mongoose";

// Create a schema
const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    times: {
      type: Number,
      required: true,
    },
    translator: {
        type: String,
        required: true,
      },
    painter: {
        type: String,
        required: true,
    },
    publisher: {
        type: String,
        required: true,
    },
    publish_date: {
        type: String,
        required: true,
    },
    cover: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
  },
  // The second argument is an options object.
  // In this case, we want to rename _id to id and remove __v
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    // This option is to make sure that when a new document is created,
    // the timestamps will be added automatically.
    // You can comment this out to see the difference.
    timestamps: false,
  },
);

// Create a model
const BookModel = mongoose.model("Book", bookSchema);

export default BookModel;
