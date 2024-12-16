import mongoose, { Model, Schema } from "mongoose";

export interface IAdmin extends Document {
    _id: string;
    username: string;
    name: string;
    email: string;
    password: string;
    role: "admin";
    resetToken?: string;
    resetTokenExpiry?: Date;
  }
  

const adminSchema = new Schema<IAdmin>({
    username: {
        type: String,
        required: [true, 'A username is required'],
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'A name is required'],
    },
    email: {
        type: String,
        required: [true, 'A email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'A password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
        type: String,
        default: "admin",
    },
    resetToken: String,
    resetTokenExpiry: Date,
}, {
    timestamps: true,
});

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;