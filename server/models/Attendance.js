import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    required: true 
  },
  markedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  },
  records: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    role: { 
      type: String, 
      enum: ['student', 'staff'], 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['present', 'absent', 'late', 'half-day'], 
      required: true 
    }
  }]
}, { timestamps: true });

// Compound unique index to prevent duplicate submissions for the same normalized date
attendanceSchema.index({ date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
