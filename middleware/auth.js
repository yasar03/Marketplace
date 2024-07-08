// // middleware/auth.js
// module.exports = function (req, res, next) {
//     if (req.session && req.session.userId) {
//       return next();
//     } else {
//       return res.redirect('/users/login');
//     }
//   };
  
// middleware/auth.js
const User = require('../models/User'); // Adjust path as per your project structure

module.exports = async function (req, res, next) {
  try {
    if (req.session && req.session.userId) {
      // Fetch user details from database
      const user = await User.findById(req.session.userId);

      if (user) {
        // Store username in session if found
        req.session.username = user.username;
        return next();
      } else {
        // Redirect to login if user not found
        return res.redirect('/users/login');
      }
    } else {
      // Redirect to login if session or userId not found
      return res.redirect('/users/login');
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).send('Internal Server Error');
  }
};
