const express = require('express');
const router = express.Router();

const signJwt = require('../auth').sign;
const TrainerData = require('../models/trainerData');
const UserData = require('../models/userData');
const User = require('../models/user');
const Slot = require('../models/slot');

const {userTypes} =  require("../constants")

const createUser = async (email, password, userType) => {
  const user = await User.create({
    email,
    password,
    userType
  });
  if (!(user && user.email))
    throw new Error("User creation failed");

  const data = userType===userTypes.TRAINER? await TrainerData.create({email}): await UserData.create({email});
  if (!(data && data.email))
    throw new Error("user data creation failed");

  if(userType===userTypes.TRAINER){
    // Create a default slot and add it
    const slot = await Slot.create();
    if (!slot) throw new Error("Error in creating slot");
    //
    const trainer = await TrainerData.addSlot(user, slot._id);
    // if(!trainer) throw new Error("Error in adding default slot");
  }

  return user;
}

router.post('/trainer', async function (req, res, next) {
  try {
    const {email, password} = req.body;
    await createUser(email, password, userTypes.TRAINER); // auto handles error
    const jwt = await signJwt({username: email,userType:userTypes.TRAINER});
    res.json({email, jwt, success: true});
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

router.post('/user', async function (req, res, next) {
  try {
    const {email, password} = req.body;
    await createUser(email, password, userTypes.USER); // auto handles error
    const jwt = await signJwt({username: email,userType:userTypes.USER});
    res.json({email, jwt, success: true});
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

module.exports = router;
