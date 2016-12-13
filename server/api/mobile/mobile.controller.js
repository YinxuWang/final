'use strict';

import {User} from '../../sqldb';
import {Company} from '../../sqldb';
import {Role} from '../../sqldb';
import {Room} from '../../sqldb';
import {Lock} from '../../sqldb';
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
 * Get list of room and send to mobile app
 * Brief:
 * send a list of room to the mobile app whose user might be lock/room manager or a renter.
 * here, for now, we do not take the case that a lock/manager is also a renter into consideration.
 * Parameters needed:
 * senderUserID: the app user's ID
 */
export function mobileRoomIndex(info, res) {

  let urRoomInfo = [];
  let retInfo = [];
  let retValue;
  let roomListLength;
  let roomLockBTMac;
  let roomLockKeyType;
  let roomLockType_S;
  let roomLockType_E;
  let roomLockMngPw;
  let senderUserID = info.senderUserID;
  let receiverUserID;


  UserRoom.findAll({
    //attributes: ['seq', 'room_name', 'room_group_seq', 'room_lock_seq', 'room_floor', 'room_mgnr_seq']
    attribute: ['ur_room_seq', 'ur_key_type', 'ur_keys_starttime', 'ur_key_endtime'],
    where: {
      ur_user_seq : senderUserID
    }
  })
    .then(theUrRoom => {
       roomListLength = theUrRoom.length;
       urRoomInfo = theUrRoom;
    })
    .catch(handleError(res));


  for(let urRoom in urRoomInfo)
  {
    retValue = urRoom;
    let roomLockSeq;
    Room.findall({
      attribute: ['room_name', 'room_address', 'room_lock_seq'],
      where: {
        seq: urRoom.ur_room_seq
      }
    })
      .then(theRoom => {
        if (!theLock) {
          console.log("Room shown in ur_room entry cannot be found")

          return res.status(404).end();
        }

        delete retValue.ur_room_seq;
        retValue.room_name = theRoom.room_name;
        retValue.lock_Time_S = theRoom.room_address;
        roomLockSeq = theRoom.room_lock_seq;
      })
      .catch(err => next(err));

    if (roomLockSeq) {
      Lock.findall({
        where: {
          seq: roomLockSeq
        }
      })
        .then(theLock => {
          if (!theLock) {
            console.log("The room " + "retValue.room_name" + "has no lock.");
            return res.status(404).end();
          }

          retValue.lock_mngpw = theLock.lock_mngpw;
          retValue.lock_btmac = theLock.lock_btmac;
        })
        .catch(err => next(err));
    }
    retInfo.push(retValue);
  }

  resRouter('nRoomListAsk',senderUserID, receiverUserID, retInfo, res);
}



/**
 * Bind a lock to a room
 * Brief:
 * lock manager gets the lock_key and lock_id via app and send them here,
 * server stores the info and binds the lock to a room and the company.
 * Parameters needed:
 * senderUserID: the app user's ID
 * lock_key:
 * lock_id:
 * lock_btname:
 * lock_btmac:
 * lock_mngpw:
 * lock_room:
 */
export function bindRoomLock(info, res)
{
  let senderUserID = info.senderUser_ID;
  let newLockObj = {};
  let resInfo;

  Room.findall({
    where:{
      seq : info.lock_room
    }
  }).then(theRoom=>{
      if (!theLock) {
        console.log("The Room " + "info.lock_room" + "cannot be found.");
        return res.status(404).end();
      }
      newLockObj.lock_company = theRoom.room_company_seq;
    }
  ).catch(err => next(err));


  newLockObj.lock_bindtime = new Date();
  newLockObj.lock_id = info.lock_id;
  newLockObj.lock_key = info.lock_key;
  newLockObj.lock_btname = info.lock_btname;
  newLockObj.lock_btmac = info.lock_btname;
  newLockObj.lock_mngpw = info.lock_mngpw;
  newLockObj.lock_room = info.lock_room;
  newLockObj.lock_manager = senderUserID;

  let newLock = Lock.build(newLockObj)
    .save()
    .then(function(){
      resRouter('nbindAnw', senderUserID, null, resInfo, res);
      }
    ).catch();

}


/**
 * Record a lock/door open event
 * Brief:
 * mobile app opens the lock and asks to record this event
 * Parameters needed:
 * senderUserID: the app user's ID
 * lock_id:
 */
export function lockOpenRec(info,res) {

  let resInfo = {};
  Lock.findall({
    where:{
      lock_id : info.lock_id
    }
  }).then(theLock=>{
      if (!theLock) {
        console.log("The Lock" + "info.lock_id" + "has not been bound to any room.");
        return res.status(404).end();
      }
      theLock.update({
          lock_counter: theLock.lock_counter + 1
        }
      );
    }
  ).catch(err => next(err));

  resRouter('nOpenRecAnw', info.senderUserId, null, resInfo, res);

}


/**
 * send the mobile app (lock_manager) the list of room/lock and its user.
 * Brief:
 * lock_manager asks for a list of users who using room/lock,
 * server respond with the information.
 * Parameters needed:
 * senderUserID: the app user's ID
 */
export function getLockUserList(info, res) {

  //check its role first

  User.findall({
    where:{
      id : info.senderUser_ID
    }
  }).then(theUser=> {
      if (!theUser) {
        console.log("The User" + "info.senderUser_ID" + "cannot be found in database.");
        return res.status(404).end();
      }
      //check if the user is lock_manager
      if (theUser.role != 2) {
        console.log("The User" + "info.senderUser_ID" + "is not lock manager.");
        return res.status(404).end();
      }
    }
  ).catch(err => next(err));


}




/**
 * Get a room info via room seq?
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

