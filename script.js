const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();
// Middleware
app.use(express.json());
const corsOptions = {
  origin: ['http://localhost:3000', 'https://gymstore.vercel.app'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
// Connect to MongoDB 
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/product'));
app.use('/api/members', require('./routes/memberRoutes'));
// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  // console.log(`Frontend URL: ${corsOptions.origin}`);
});

app.get("/", (req, res) => {
  res.status(200).send({ message: 'Server is up and running' });
});






// app.post('/api/auth/login', async (req, res) => {
//     const { username, password } = req.body;
  
//     try {
//       // Check if the user exists
//       const user = await User.findOne({ username });
//       if (!user) {
//         return res.status(400).json({ message: 'Invalid username or password' });
//       }
  
//       // Compare the password
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res.status(400).json({ message: 'Invalid username or password' });
//       }
  
//       // Generate JWT
//       const payload = { userId: user._id };
//       const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
//       res.status(200).json({ token });
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });

