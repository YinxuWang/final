'use strict';

import {User} from '../../sqldb';
import {Company} from '../../sqldb';
import {Role} from '../../sqldb';
import config from '../../config/environment';
import {Room} from '../../sqldb';
import jwt from 'jsonwebtoken';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of room
 * restriction: 'admin'
 * db might be supposed to have a user id whose owner (the user) manages the room
 * key : room_mgnr_seq
 */
export function index(req, res) {
  return Room.findAll({
    attributes: ['room_name', 'room_address', 'room_model', 'room_floor', 'room_mgnr_seq']
  })
    .then(theRoom => {
      res.status(200).json(theRoom);
    })
    .catch(handleError(res));
}

/**
 * Creates a new room
 */
export function create(req, res) {
  var newRoom = Room.build(req.body);
  newRoom.setDataValue('provider', 'local');
  newRoom.setDataValue('role', 'user');
  return newRoom.save()
    .then(function (user) {
      var token = jwt.sign({_id: user._id}, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({token});
    })
    .catch(validationError(res));
}

/**
 * Get a room via room seq?
 */
export function show(req, res, next) {
  let roomSeq = req.params.seq;

  return Room.find({
    where: {
      seq: roomSeq
    }
  })
    .then(theRoom => {
      if (!theRoom) {
        return res.status(404).end();
      }
      res.json(theRoom.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a room by referring to room_seq
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return Room.destroy({where: {_id: req.params.id}})
    .then(function () {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a room's by referring to room_seq
 */
export function changeRoomInfo(req, res) {

  let theRoom = Room.find({

    where: {
      seq : req.body.seq
    }

  });

  theRoom.update({
    room_name : req.body.roomName,
    room_model : req.body.roomModel,
    room_floor : req.body.roomFloor,
    room_LockSeq : req.body.roomLockSeq,
    room_group_seq : req.body.groupSeq,
  }).then(function() {})

}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user.id;

  return User.find({
    where: {
      id: userId
    },
    attributes: [
      'id',
      'name',
      'role',
      'phone',
      'mail'
    ]
  })
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}
