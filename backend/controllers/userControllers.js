import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

//desc   Login of user
//api    POST api/users/login
//access Public

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      token:
        'Bearer ' +
        jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '7d',
        }),
    });
  } else {
    res.status(401);
    throw new Error('Email or password is invalid');
  }
});

//desc   Register of user
//api    POST api/users/register
//access Public

export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    res.status(401);
    throw new Error('User is already existed with this email');
  } else {
    try {
      const user = await User.create({
        name,
        email,
        password,
      });
      res.json({
        _id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        token:
          'Bearer ' +
          jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
          }),
      });
    } catch (e) {
      res.status(400);
      throw new Error('Invalid User info');
    }
  }
});

//desc   Profile data of the user
//api    GET api/users/profile
//access Private

export const profile = asyncHandler(async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isAdmin: req.user.isAdmin,
  });
});

//desc   Update profile data
//api    PUT api/users/profile
//access Private

export const updateProfile = asyncHandler(async (req, res) => {
  const existedUser = await User.findById(req.user._id);

  if (existedUser) {
    existedUser.name = req.body.name || existedUser.name;
    existedUser.email = req.body.email || existedUser.email;
    if (req.body.password) {
      existedUser.password = req.body.password;
    }
    const user = await existedUser.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
