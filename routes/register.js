const express = require('express');
const router = express.Router();

const signJwt = require('../auth').sign;
const utility = require('../utility/utility');
const {saveFileToServer} = require('../config/uploadConfig');
const UserData = require('../models/userData');
const User = require('../models/user');

const createUser = async (email, password, userType) => {
  const user = await User.create({
    email,
    password,
    userType
  });
  if (!(user && user.email))
    throw new Error("User creation failed");
  const userData = await UserData.create({ // create basic userData object for future updation
    email,
    userType
  });
  if (!(userData && userData.email))
    throw new Error("UserData creation failed");
  return user;
}

router.post('/trainer', async function (req, res, next) {
  try {
    const {email, password} = req.body;
    await createUser(email, password, 'COACH'); // auto handles error
    const jwt = await signJwt({username: email});
    res.json({email, jwt, success: true});
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});
// router.post('/trainer', saveFileToServer.single('file'), async function (req, res, next) {
//   try {
//     let imageUrl = '';
//     if (req.file && req.file.path) {
//       imageUrl = await utility.uploadLocalFile(req.file.path);
//     }
//     const trainer = await User.create({
//       ...req.body,
//       userType:'COACH'
//     });
//     if (!(trainer && trainer.email))
//       throw new Error("User creation failed");
//
//     const trainerData = await UserData.create({
//       ...req.body,
//       displayPictureUrl: imageUrl,
//       userType:'COACH'
//     });
//     if (!(trainerData && trainerData.email))
//       throw new Error("UserData creation failed");
//
//     const {email} = trainer;
//     res.json({email, success: true});
//
//     // const {startTime, endTime} = req.body;
//     // if(startTime && endTime){
//     //
//     // }
//   } catch
//     (err) {
//     res.status(500).json({
//       err: err.message
//     });
//   }
// });

router.post('/user', async function (req, res, next) {
  try {
    const {email, password} = req.body;
    await createUser(email, password, 'USER'); // auto handles error
    const jwt = await signJwt({username: email});
    res.json({email, jwt, success: true});
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

module.exports = router;
