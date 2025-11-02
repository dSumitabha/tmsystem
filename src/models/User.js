import mongoose from 'mongoose';

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, },
    email: { type: String, required: true, unique: true, },
    password: { type: String, required: true, },
    isAdmin : { type: Boolean, default: false, }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields  
  }
);

// Export the model if not already created (to prevent model overwrite error)
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;