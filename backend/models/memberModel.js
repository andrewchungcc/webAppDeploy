import mongoose from "mongoose";

// Create a schema
const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    account: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    creditCard: {
      type: Number,
      validate: {
        validator: function (v) {
          // Check if the credit card number has exactly 16 digits
          return /^\d{16}$/.test(v);
        },
        message: props => `${props.value} is not a valid 16-digit credit card number!`
      },
      required: true,
    },
    favorite: {
      type: Array, 
      default: [], 
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
    // timestamps: true,
  },
);

// Create a model
const MemberModel = mongoose.model("members", memberSchema);

export default MemberModel;
