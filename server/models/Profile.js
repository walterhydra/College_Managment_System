import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    enrollmentNo: {
      type: String,
      unique: true,
      sparse: true, // Only students/alumni might have this
    },
    rollNo: {
      type: String,
    },
    program: {
      type: String, // e.g., "BTech - CSE"
    },
    semester: {
      type: Number,
    },
    batch: {
      type: String, // e.g., "2021-2025"
    },
    dob: {
      type: Date,
    },
    bloodGroup: {
      type: String,
    },
    fatherName: {
      type: String,
    },
    motherName: {
      type: String,
    },
    phone: {
      type: String,
    },
    parentPhone: {
      type: String,
    },
    address: {
      type: String,
    },
    profilePhoto: {
      type: String,
      default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
