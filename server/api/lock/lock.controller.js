'use strict';

import {User} from '../../sqldb';
import {Company} from '../../sqldb';
import {Role} from '../../sqldb';
import {Room} from '../../sqldb';
import {btLock} from '../../sqldb';

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
 * Create a new lock with ...some info
 */
export function create(req, res) {
  let newLock = btLock.build(req.body);

  return newLock.save()
    .then(function () {

    })
    .catch(validationError(res));
}

/**
 * Get a lock info via db Room's lock_seq (roomLockSeq) and verify it via db btLock's lock_room
 * Used for showing lock info in the detailed room page
 */
export function show(req, res, next) {
  let roomLockSeq = req.params.seq;
  let roomLockBelongTo = req.params.lock_room;

  return btLock.find({
    where: {
      seq: roomLockSeq
    }
  })
    .then(theLock => {
      if (!theLock) {
        return res.status(404).end();
      }
      if (theLock.lock_room != roomLockBelongTo)
        return res.status(404).end();
      res.json(theLock.profile);
    })
    .catch(err => next(err));
}

/**
 * bind a lock to a room by set the db Room's lock_seq and set db btLock's lock_room
 * The parameters needed:
 * 1) room_to_be_bound : the room that the lock will bind to
 * 2) lock_to_be_binding : the lock that will be binded to the room
 * Return ?? Respond ??
 */
export function bindRoom(req, res) {

  let roomToBeBoundSeq =  req.body.room_seq;
  let lockToBeBindingSeq = req.body.lock_seq;

  btLock.find({
    where: {
      seq: lockToBeBindingSeq
    }
  })
    .then(theLock => {
      if (!theLock) {
        return res.status(404).end();
      }

      theLock.lock_room = roomToBeBoundSeq;
      //res.json(theLock.profile);
    })
    .catch(err => next(err));

  Room.find({
    where: {
      seq: roomToBeBoundSeq
    }
  })
    .then(theRoom => {
      if (!theRoom) {
        return res.status(404).end();
      }

      theRoom.room_lock_seq = lockToBeBindingSeq;
      //res.json(theLock.profile);
    })
    .catch(err => next(err));


}

/**
 * Send a given phone num the lock key.
 * brief:
 * lock_manager (who add the lock) can send a lock key to a user who might be renter or normal user
 *
 * The parameters needed:
 * 1) lockSeq : the seq. of lock whose key needed to be sent to the phone
 * 2) roomSeq : the room that the lock binds
 * 3) keyReceiverPhoneNum : the phone which we send the lock key to
 * 4) keyReceiverName : the name of receiver
 * 5) keyType : the type of lock key, pemanent or temporary
 * 6) keyStartTime : if temperory, the time when key starts to be effective
 * 7) keySEndTime : if temperory, the time when key ends to be effective
 * Return ?? Respond ??
 *
 */
export function sendLockKey(info, res)
{
  let lockSeq = info.lock_seq;
  let roomSeq = info.room_seq;
  let keyReceiverPhoneNum = info.phone_num;
  let keyReceiverName = info.phone_user_name;
  let retInfo = {};

    retInfo.keyType = info.key_type;

  if (retInfo.keyType = 2) {
    retInfo.keyStartTime= info.keyStartTime;
    retInfo.keyStopTime = info.keyEndTime;
  }

  // check if lock has been bond to room or not?
  // if a room has not been bound with a lock, web may not show the option like send the key.

  //find the lock key in db btlock
  btLock.find({
    where: {
      seq: lockSeq
    }
  })
    .then(theLock => {
      if (!theLock) {
        return res.status(404).end();
      }
      retInfo.lockKey = theLock.lock_key;
    })
    .catch(err => next(err));

  // find the receiver User ID
  User.find({
    where: {
      phone: keyReceiverPhoneNum
    }
  })
    .then(theUser => {
      if (!theUser) {
        return res.status(404).end();
      }
      retInfo.User_ID = theUser.id;
    })
    .catch(err => next(err));


  // call the application layer router to response
  resRouter('nEkeyAsk', retInfo, res );

}



/**
 * generate a temporary lock password.
 * The parameters needed
 * 1) pwType : the type of lock password, pemanent or temporary
 * 2) pwEffectiveTime:
 * 3) pwStartTime : if temperory, the time when password starts to be effective
 * Return ?? Respond ??
 *
 */
function generateLockPassword(pwType, pwEffectiveTime, pwStartTime)
{
  let pw_10Decimal;
  let pw_28Bit = pwType << 24 + pwEffectiveTime << 19 + pwStartTime;

  console.log("pw_28bit as decimal is", pw_28bit);


  // TODO, pw_10Decimal = Encry10(pw_28Bit);

  return pw_10Decimal = pw_28Bit;
}
/**
 *  the App client wants to get a lock password, generate a temporary password and respond with that.
 * The parameters needed:
 * 1) lockSeq : the seq. of lock whose password needed to be sent to the phone
 * 2) roomSeq : the room that the lock binds
 * 3) PwType : the type of lock password, pemanent or temporary
 * 4) Pw_Time_S : if temperary, the time when password starts to be effective
 * 5) Pw_TIme_P: if temperary, the effective period
 * Return ?? Respond ??
 *
 */
export function getLockPassword(info, res)
{
  let retInfo = {};


  // check if lock has been bond to room or not?
  // if a room has not been bound with a lock, web may not show the option like send the key.

  User.find({
    where: {
      id: info.senderUser_ID
    }
  })
    .then(theUser => {
      if (!theUser) {
        return res.status(404).end();
      }
      retInfo.lockpw_username = theUser.name;
      retInfo.lockpw_userphone = theUser.phone;
      retInfo.lockpw_sender_name = theUser.name;
      retInfo.lockpw_sender_seq = theUser.seq;

    })
    .catch(err => next(err));

  retInfo.lockpw_content = generateLockPassword(info.PwType, info.Time_P, info.Time_S);

  retInfo.lockpw_send_time = Date.parse(new Date());
  retInfo.lockpw_Type = info.Pw_type;
  retInfo.lockpw_lock_seq= info.lock_seq;
  retInfo.lockpw_starttime = info.Pw_Time_S;

  //create an entry in db btLockPw
  btLockPw.build(retInfo).save();

  retInfo.User_ID = info.senderUser_ID;

  // call the application layer router to response
  resRouter('nTempPwAns', retInfo, res );

}

/**
 * Send a given phone num the lock password.
 * The parameters needed:
 * 1) lockSeq : the seq. of lock whose password needed to be sent to the phone
 * 2) roomSeq : the room that the lock binds
 * 3) PwReceiverPhoneNum : the phone which we send the lock password to
 * 4) PwReceiverName : the name of receiver
 * 5) PwType : the type of lock password, pemanent or temporary
 * 6) Pw_Time_S : if temperary, the time when password starts to be effective
 * 7) Pw_TIme_P: if temperary, the effective period
 * Return ?? Respond ??
 *
 */
export function sendLockPassword(info, res)
{
  let retInfo = {};


  // TODO, check if lock has been bond to room or not?
  // if a room has not been bound with a lock, web may not show the option like send the key.

  User.find({
    where: {
      id: info.senderUser_ID
    }
  })
    .then(theUser => {
      if (!theUser) {
        return res.status(404).end();
      }

      retInfo.lockpw_sender_name = theUser.name;
      retInfo.lockpw_sender_seq = theUser.seq;

    })
    .catch(err => next(err));

  retInfo.lockpw_username = info.PwReceiverName;
  retInfo.lockpw_userphone = info.PwReceiverPhoneNum;

  retInfo.lockpw_content = generateLockPassword(info.PwType, info.Time_P, info.Time_S);

  retInfo.lockpw_send_time = Date.parse(new Date());
  retInfo.lockpw_Type = info.Pw_type;
  retInfo.lockpw_lock_seq= info.lock_seq;
  retInfo.lockpw_starttime = info.Pw_Time_S;

  //create an entry in db btLockPw
  btLockPw.build(retInfo).save();

  //TODO something Strange with sendLockPassword.
  retInfo.User_ID = info.senderUser_ID;

  // TODO send out the password to user via cell phone message

  // call the application layer router to response
  resRouter('nTempPwAns', retInfo, res );

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

