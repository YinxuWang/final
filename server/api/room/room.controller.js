'use strict';

import {User} from '../../sqldb';
import {Company} from '../../sqldb';
import {Role} from '../../sqldb';
import {Room} from '../../sqldb';
import {UserRoom} from '../../sqldb';


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
    attributes: ['room_name', 'group_seq', 'room_address', 'room_model', 'room_floor', 'room_mgnr_seq']
  })
    .then(theRoom => {

    })
    .catch(handleError(res));
}

/**
 * Creates a new room. (Only web-side user can use this function)
 * Brief：
 * web side requests creating a new room in db Room. If a room_manager /
 * presents in request body, create an entry in db UserRoom.
 * Parameters needed:
 * room_name:
 * room_address:
 * room_model:
 * area:
 * floor:
 * room_group_seq:
 * room_manager_name: the one who is in charge of the room and with rights to bind lock /
 * edit room info, send the lock key, etc, who is the very lock manager. This /
 * parameter for now is mandatory and should be optional for later version.
 *
 */
export function create(req, res) {
  let reqInfo = req.body;
  let roomSeq;

  if(req.body.room_manager_name) {
    delete reqInfo.room_manager;
  }

  let newRoom = Room.build(reqInfo)
    .save()
    .then(function (theRoom) {
      roomSeq = theRoom.seq;
    })
    .catch(validationError(res));

  if(req.body.room_manager_name)
  {
    let newUrRoom = {};
    newUrRoom.ur_room_seq = roomSeq;

    User.findall({
      where: {
        name:req.body.room_manager_name
      }
    })
      .then(theUser => {
        if (!theUser) {
          console.log("Create Room: cannot find the user (lock manager) named as " + "req.body.room_manager_name" + ".");
          return res.status(404).end();
        }
        newUrRoom.ur_user_seq = theUser.seq;
      })
      .catch(err => next(err));

    newUrRoom.ur_user_type = 2; //user type is type lock manager
    newUrRoom.ur_user_status = 0; //status active

    UserRoom.build(newUrRoom).save().then().catch(validationError(res));
    console.log("The room is created and a room/lock manager is added successfully.");
  }
}

/**
 * Get a room info via room seq?
 */
export function show(req, res, next) {
  let roomSeq = req.params.seq;

  return Room.findall({
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
 * brief:
 * web side user requests to change room info, if a room_manager/
 * presents, which means a new lock/room manager substitutes /
 * the old one. server should changes the ur_user_status in db UserRoom,/
 * and create a new entry in db UserRoom for new room manager.
 * parameters needed: (for the parameters unmodified, just remain the same)/
 * room_name:
 * room_address:
 * room_model:
 * room_floor:
 * room_area:
 * room_lock_seq:
 * room_group_seq:
 * room_manager_name: ?
 * room_manager_seq:
 * room_company:
 * TODO optimize update operation?
 */
export function webChangeRoomInfo(req, res) {

  Room.update({
    room_name : req.body.room_name,
    room_address: req.body.room_address,
    room_model : req.body.room_model,
    room_floor : req.body.room_floor,
    room_area : req.body.room_area,
    room_lock_seq : req.body.room_lock_seq,
    room_group_seq : req.body.room_group_seq,
  },{
    where: {
    seq : req.body.seq
    }
  });

  UserRoom.update({
    ur_user_status : 2
  },{
    where: {
      ur_user_seq : req.body.room_manager_seq,
      ur_room_seq : req.body.room_seq
    }
  });

  // create a new entry for new lock/room manager
  let newUserRoom = {};
  //UserRoom.build(newUrRoom).save().then().catch(validationError(res));


  res.send();

}

