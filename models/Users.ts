import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    email: string;
    fullName?: string;
    password?: string; 
    following?: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: Object[]
      }
    providers: {
        provider: string;
        providerId: string;
    }[];
    image?: string;  
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
    {
        fullName: {
            type: String,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
        },
        following: {
            type: [Schema.Types.ObjectId],
            ref: 'User',
            default: []
          },
        password: {
            type: String,
            required: false,  
            minlength: [6, "Password should be at least 6 characters"]
        },
        providers: [{
            provider: String, 
            providerId: String  
        }],
        image: {
            type: String,
            default: null
        }
    },
    { timestamps: true }
);

// Hash password only if it exists and is modified
userSchema.pre("save", async function(next) {
    if (this.isModified("password") && this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to check password validity
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

const User = models?.User || model<IUser>("User", userSchema);
export default User;