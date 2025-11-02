import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    // added a column which will store a human communicatble id
    taskId: { type: String, required: true, unique: true, trim: true, },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // using string base status for better recognition at api response
    status: {
        type: String,
        enum: ["pending", "in_progress", "completed"],
        default: "pending",
    },

    // using string base priority for better recognition at api response
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },
      
    dueDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
