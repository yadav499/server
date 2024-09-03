const User=require('../models/AuthUser')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const signupcontroller = async (req, res) => {
  try {
    // Extract user data from request body
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send('User already exists.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

    // Respond with success message
    return res.status(201).send('User signed up successfully');
  } catch (e) {
    // Respond with error message
    return res.status(500).send(e.message);
  }
};
    // handle lgoin
const logincontroller = async (req, res) => {
  const { email, password } = req.body;

  // Validate request body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Optionally create a token or session here if using JWT or other auth mechanisms
    // const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // Return a success response with user info or token
    return res.status(200).json({ userId: user._id /*, token */ });

  } catch (e) {
    console.error('Login error:', e.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


// check is admin by id
const isadmincheck = async (req, res) => {
  const { userId } = req.params;
  
  

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Assuming 'isAdmin' field in your User model
    if (user.isAdmin) {
      return res.status(200).json({ isAdmin: true });
    } else {
      return res.status(200).json({ isAdmin: false });
    }
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

    module.exports={
        signupcontroller,logincontroller,isadmincheck
    }