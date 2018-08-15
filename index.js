require('dotenv').config();
const express = require('express');
const app = express();

// Imports for real time.
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const bodyParser = require('body-parser');
const cors = require('cors');

const { errorHandler } = require('./handlers/error');
const { loginRequired, ensureCorrectUser } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const serverRoutes = require('./routes/server');
const channelRoutes = require('./routes/channel');
const messageRoutes = require('./routes/message');


app.use(cors());
app.use(bodyParser.json());

// Routes.
app.use('/api/auth', authRoutes);
app.use('/api/users', 
  loginRequired,
	userRoutes
);
app.use('/api/users/:userId',
  loginRequired,
  ensureCorrectUser,
  serverRoutes
);
app.use('/api/users/:userId',
  loginRequired, 
  ensureCorrectUser,
  channelRoutes
);
app.use('/api/users/:userId',
  loginRequired, 
  messageRoutes
);

// Default error and error handler.
app.use(function(req, res, next) {
	let err = new Error('Not found.');
	err.status = 404;
	next(err);
});

app.use(errorHandler);

io
.on('connection', socket => {
	console.log('connected with io');

  // Socket for private rooom for direct messages and friend requests.
  socket.on('join', data => {
    socket.join(data.username);
  });

  // Socket for sending friend requests.
  socket.on('invite', data => {
    io.in(data.receiver).emit('invite', {
      sender: data.sender,
    });
  });

  // Socket for switching rooms to chat.
	socket.on('change room', ({ newRoom }) => {
		socket.leave(socket.room);
		socket.join(newRoom);
		socket.room = newRoom;
		socket.emit('change room', { 
			ok: true,
			room: socket.room,
		});
	});

  // Socket for sending messages in a room.
	socket.on('send', msg => {
		io.in(socket.room).emit('send', msg);
	});

	socket.on('disconnect', () => {
		console.log('disconnected');
	});
});


http.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log('Discord Clone started.');
});
