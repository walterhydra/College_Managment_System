import Profile from '../models/Profile.js';

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const {
      firstName,
      lastName,
      phone,
      parentPhone,
      bloodGroup,
      address,
      dob,
    } = req.body;

    if (firstName) profile.firstName = firstName;
    if (lastName) profile.lastName = lastName;
    if (phone) profile.phone = phone;
    if (parentPhone) profile.parentPhone = parentPhone;
    if (bloodGroup) profile.bloodGroup = bloodGroup;
    if (address) profile.address = address;
    if (dob) profile.dob = dob;

    if (req.file) {
      // Create a local URL path
      profile.profilePhoto = `/uploads/${req.file.filename}`;
    }

    const updatedProfile = await profile.save();
    
    // Also re-fetch user to return the full payload
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
