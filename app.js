// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const socketIO = require('socket.io');
// const http = require('http');
// const path = require('path');
// const auth = require('./middleware/auth');

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/marketplace', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// //   useFindAndModify: false,
// //   useCreateIndex: true
// })
// .then(() => console.log('MongoDB Connected'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Body parser middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Session middleware
// app.use(session({
//   secret: 'your-secret-key',
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/marketplace' })
// }));

// // View engine setup
// app.set('view engine', 'ejs');

// // Static folder
// app.use(express.static(path.join(__dirname, 'public')));

// // Routes
// app.use('/', require('./routes/index'));
// app.use('/users', require('./routes/users'));
// app.use('/shops', require('./routes/shops'));
// app.use('/products', require('./routes/products'));

// // Dashboard route with authentication middleware
// app.get('/dashboard', auth, async (req, res) => {
//   try {
//     const User = require('./models/User');
//     const user = await User.findById(req.session.userId).populate('shops').populate('pendingInvites');
//     res.render('dashboard', { shops: user.shops, pendingInvites: user.pendingInvites });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
//   }
// });
// // Socket.io for chat functionality
// io.on('connection', socket => {
//     console.log('New client connected');
    
//     socket.on('login', username => {
//         socket.username = username;
//         // console.log(socket.username);
//     });

//     socket.on('joinShop', shopId => {
//       socket.join(`shop_${shopId}`);
//     });
  
//     socket.on('chat message', async ({ shopId, message }) => {
//       try {
//         // Save message to database or perform any necessary operations
        
//         // Emit the message to all members of the shop using Socket.IO
//         io.to(`shop_${shopId}`).emit('chat message', {
//           sender: socket.username,  // Assuming socket.username is set somewhere
//           content: message,
//           createdAt: new Date()
//         });
//       } catch (err) {
//         console.error('Error sending message:', err);
//         socket.emit('chat error', 'Error sending message'); // Emit error to sender
//       }
//     });
  
//     socket.on('disconnect', () => {
//       console.log('Client disconnected');
//     });
//   });
  

// // Start server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server started on http://localhost:${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const auth = require('./middleware/auth'); // Your updated auth middleware
const User = require('./models/User'); // Import User model
const Shop = require('./models/Shop'); // Import Shop model

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/marketplace', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/marketplace' })
}));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// View engine setup
app.set('view engine', 'ejs');

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for all routes requiring authentication
app.use('/dashboard', auth);

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/shops', require('./routes/shops'));
app.use('/products', require('./routes/products'));

app.get('/dashboard', auth, async (req, res) => {
  try {
    const User = require('./models/User');
    const user = await User.findById(req.session.userId).populate('shops').populate('pendingInvites');
    res.render('dashboard', { shops: user.shops, pendingInvites: user.pendingInvites });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Socket.io for chat functionality
// io.on('connection', socket => {
//   console.log('New client connected');

//   // Retrieve username from session
// //   const username = socket.handshake.session.username; 

// //   if (username) {
// //     socket.username = username;
// //     console.log(`User logged in: ${username}`);
// //   } else {
// //     console.error('Username not found in session');
// //     socket.username = 'Guest'; // Set a default username or handle error
// //   }



//   // Handle joining a shop chat room based on shopId
//   socket.on('joinShop', shopId => {
//     socket.join(`shop_${shopId}`);
//     console.log(`User joined shop chat: ${socket.username} in shop ${shopId}`);
//   });

//   // Handle chat message sending
//   socket.on('chat message', async ({ shopId, message }) => {
//     try {
//       // Emit the message to all members of the shop using Socket.IO
//       io.to(`shop_${shopId}`).emit('chat message', {
//         sender: socket.username,
//         content: message,
//         createdAt: new Date()
//       });
//     } catch (err) {
//       console.error('Error sending message:', err);
//       socket.emit('chat error', 'Error sending message');
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });




// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected');
  
    // Handle joining shop chat room
    socket.on('joinShop', (shopId) => {
      socket.join(`shop_${shopId}`);
      console.log(`User joined shop chat: ${socket.username} in shop ${shopId}`);
    });
  
    // Handle chat message sending
    socket.on('chat message', ({ shopId, message }) => {
      io.to(`shop_${shopId}`).emit('chat message', {
        sender: socket.id, // Use socket.id as sender for demo (replace with actual user identification)
        content: message,
        createdAt: new Date()
      });
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
  

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
