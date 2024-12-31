// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//   const token = req.header('x-auth-token'); // Token header mein hona chahiye

//   if (!token) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT_SECRET ko .env se read karte hain
//     req.user = decoded.id; // User ki id ko request object mein set karte hain
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// module.exports = authMiddleware;





const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Token ko Authorization header se nikal rahe hain
  const token = req.header('Authorization')?.replace('Bearer ', ''); // 'Bearer ' ko remove karte hain

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT_SECRET ko .env se read karte hain
    req.user = decoded.id; // User ki id ko request object mein set karte hain
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
