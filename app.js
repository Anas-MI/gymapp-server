const createError = require('http-errors');
const express = require('express');
var cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const trainerRouter = require('./routes/trainers');
const userRouter = require('./routes/user');
const postsRouter = require('./routes/posts');
const commentRouter = require('./routes/comment');
const callRouter = require('./routes/call');

// const {onConnection} = require('./routes/socket');

const middleware = require('./middleware');
const auth = require('./auth');

const app = express();
// const server = require('http').Server(app);
// const socket_io = require('socket.io');
// const io = socket_io();
// app.io = io;
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// app.use(upload.array('file'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.get('/testAuthorization', auth.checkJWTValidity);
app.use('/register', registerRouter);
app.post('/login', auth.authenticate, auth.login);
app.use('/trainers', auth.ensureUser, trainerRouter);
app.use('/user', auth.ensureUser, userRouter);
app.use('/posts', auth.ensureUser, postsRouter);
app.use('/comment', auth.ensureUser, commentRouter);
app.use('/call', auth.ensureUser,callRouter);
// io.on('connection', onConnection);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
app.use(middleware.handleError);

// admin.messaging().sendToDevice(
//   ['dZe1F-nmTbqxzJ9w6DyfTM:APA91bE1Zh_f8f4PMBkPryzLK6HzkONOk29vog5nfHWC4W-6cULvxoQ8hlSmD2sMTx4zzDCP8VZPwpBK_5BEDXsgVx2eS6ttACF_4kPwUAqL5TkECEeKdafe_bcwNkoObsJkUi65pe58'],
//   {
//     data: {
//       "priority": "high",
//       "uuid": "uuid of user",
//       "name": "RNVoip",
//       "type": "call"
//     }
//   },
//   {
//     contentAvailable: true,
//     priority: 'high'
//   },
// );
module.exports = app;