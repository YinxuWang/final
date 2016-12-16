'use strict';

import {User} from '../../sqldb';
import {Company} from '../../sqldb';
import {Role} from '../../sqldb';
import {Room} from '../../sqldb';
import {Lock} from '../../sqldb';
import {UserRoom} from '../../sqldb';
import {OpenInfo} from '../../sqldb';
import {resRouter} from './index';


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
 * Mobile app user wants to register and asks for a check num.
 * Brief:
 * Check if the user has registered, respond the request /
 * with email or cell phone message; or respond with error message.
 * Parameters needed:
 * senderUserID: the app user's ID
 * reg_type: register type 1-phone number, 2-email
 * ret_value: the phone num or email address.
 * time_c: time when the user request register check num.
 * user_pw: user password
 *
 */
export function mobileRegChkNum(info, res) {
  let retinfo = {status_code: 'ok'};
  //check if the user has alread registered
  User.findall({
    where: {
      id: info.senderUser_ID
    }
  }).then(theUser => {
    if (theUser)
      return 0;
    else {
      resRouter('nChkNumAnw', info.senderUser_ID, null, retInfo);
      //email or short message
      return 0;
    }
  }).catch(err => next(err));

}

/**
 * Mobile app user asks to register.
 * Brief:
 * User asks to register after
 * Parameters needed:
 * senderUserID: the app user's ID
 * reg_type: register type 1-phone number, 2-email
 * reg_value: the phone num or email address.
 * reg_chk_num: register check num
 * time_c: time when the user request register check num.
 */
export function mobileRegister(info, res) {

  let retInfo = {};


  UserReg.findall({
      reg_name: info.reg_name,
      reg_value: info.reg_value,
      reg_vcode: info.reg_chk_num,
      reg_time: {
        $between: [info.reg_time - 90000, info.reg_time]
      }
    }
  ).then(theUserReg => {
    if (!theUserReg) {
      return 0;
    }
    //generate id and populate db User
    retInfo.status_code = 'OK';
    retInfo.reg_value = info.reg_value;
    retInfo.User_ID = 0;

    return resRouter('nRegAnw', info.senderUser_ID, null, retInfo);
  })
}

/**
 * Mobile app user asks to log in.
 * Brief:
 * User asks to register after
 * Parameters needed:
 * senderUserID: the app user's ID
 * reg_type: register type 1-phone number, 2-email
 * reg_value: the phone num or email address.
 * reg_chk_num: register check num
 * time_c: time when the user request register check num.
 */


/**
 * Get list of room and send to mobile app
 * Brief:
 * send a list of room to the mobile app whose user might be lock/room manager or a renter.
 * here, for now, we do not take the case that a lock/manager is also a renter into consideration.
 * Parameters needed:
 * senderUserID: the app user's ID
 * //done
 */
export function mobileRoomIndex(info, res) {

  let urRoomInfo = [];
  let retInfo = [];
  let retValue;
  let roomListLength;
  let senderUserID = info.senderUserID;


  UserRoom.findAll({
    //attributes: ['seq', 'room_name', 'room_group_seq', 'room_lock_seq', 'room_floor', 'room_mgnr_seq']
    attribute: ['ur_room_seq', 'ur_key_type', 'ur_keys_starttime', 'ur_key_endtime'],
    where: {
      ur_user_seq: senderUserID
    }
  })
    .then(theUrRoom => {
      roomListLength = theUrRoom.length;
      urRoomInfo = theUrRoom;
    })
    .catch(handleError(res));


  for (let urRoom in urRoomInfo) {
    retValue = urRoom;
    let roomLockSeq;
    Room.findall({
      attribute: ['room_name', 'room_address', 'room_lock_seq'],
      where: {
        seq: urRoom.ur_room_seq,
        ur_user_status: {
          $ne: 2 //已经被删除的不予显示。
        }
      }
    })
      .then(theRoom => {
        if (!theRoom) {
          console.log("Room shown in ur_room entry cannot be found");

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

  resRouter('nRoomListAsk', senderUserID, null, retInfo, res);
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
 * done
 */
export function bindRoomLock(info, res) {
  let senderUserID = info.senderUser_ID;
  let newLockObj = {};
  let resInfo;

  Room.findall({
    where: {
      seq: info.lock_room
    }
  }).then(theRoom => {
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
    .then(function () {
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
 * open_lock_seq:
 * open_user_seq:
 */
export function lockOpenRec(info, res) {

  let resInfo = {};
  Lock.findall({
    where: {
      lock_id: info.open_lock_id
    }
  }).then(theLock => {
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

  // TODO what is open_type ?
  OpenInfo.update({
      open_time: new Date(),
      open_lock_id: info.open_lock_info,
      open_user_seq: info.open_user_info
    }
  );


  resRouter('nOpenRecAnw', info.senderUserId, null, resInfo, res);

}

/**
 * Return a lock/door open event log
 * Brief:
 * mobile app asks the log of lock/door open event
 * Parameters needed:
 * senderUserID: the app user's ID
 * open_lock_seq: log of the lock
 * open_user_seq: log of the user
 */
export function lockOpenLog(info, res) {
  // show the latest open record first.

  OpenInfo.findall({
    order: 'seq DESC', // the one with max open seq is latest.
    where: {
      open_user_seq: info.open_user_seq,
      open_lock_seq: info.open_lock_seq,
    }
  })
    .then(theOpenInfo => {
      if (!theOpenInfo) {
        console.log("No open record so far for lock %s and user %s", info.open_lock_seq, info.open_user_seq);
        return res.status(404).end();
      }
      return resRouter('nOpenLogAnw', info.senderUserID, info.senderUserID, theOpenInfo);
    })
    .catch(err => next(err));
}


/**
 * send the mobile app (lock_manager) the list of room/lock and its user (renter).
 * Brief:
 * lock_manager asks for a list of users who using room/lock,
 * server respond with the information.
 * Parameters needed:
 * senderUserID: the app user's ID
 * done
 */
export function getLockUserList(info, res) {

  //check its role first

  let retInfo = [];
  let retValue = {};
  let managedRooms = [];
  User.findall({
    where: {
      id: info.senderUser_ID
    }
  }).then(theUser => {
      if (!theUser) {
        console.log("The User %s cannot be found in database.", info.senderUser_ID);
        return res.status(404).end();
      }
      //check if the user is lock_manager
      if (theUser.role != 2) {
        console.log("The User %s is not lock manager.", info.senderUser_ID);
        return res.status(404).end();
      }
    }
  ).catch(err => next(err));

  UserRoom.findall({
    attribute: ['ur_room_seq'],
    where: {
      ur_user_seq: info.senderUser_ID
    }
  }).then(theUserRooms => {
    managedRooms = theUserRooms;
  }).catch(err => next(err));

  for (let roomseq in managedRooms) {
    UserRoom.findall({
      attribute: ['ur_key_type', 'ur_key_starttime', 'ur_key_endtime', 'ur_user_seq'],
      where: {
        ur_user_type: 3, //Renter
        ur_room_seq: roomseq,
        ur_user_status: {
          $ne: 2 //hide those whose status is 2, that is, deleted
        }
      }
    }).then(theUserRoom => {
      retValue = {
        user_seq: theUserRoom.ur_user_seq,
        user_type: theUserRoom.ur_key_type,
        key_type: theUserRoom.ur_key_type,
        time_c: theUserRoom.ur_key_starttime,
        time_e: theUserRoom.ur_key_endtime
      }
    }).catch(err => next(err));

    User.findall({
      attribute: ['id', 'name'],
      where: {
        seq: retValue.user_seq
      }
    }).then(theUser => {
        retValue.user_ID = theUser.id;
        retValue.user_name = theUser.name;
      }
    ).catch(err => next(err));
    retInfo.push(retValue);
  }
  resRouter('netUserlistAnw', info.senderUserID, null, retInfo);
}

/**
 * the mobile app (lock_manager) requests to edit the info of the list of room/lock and its user (renter).
 * Brief:
 * lock_manager asks for editing information/status/rights of room/lock user,
 * server updates the db and informs the targeted room/lock user via nCmaPush.
 * Parameters needed:
 * senderUserID: the app user's ID
 * lock_user_ID: the user whose info will be edited.
 * new_user_status: the new lock user status
 * new_name (optional):
 */
export function editLockUserInfo(info, res) {

  //check the role of sender first?

  let lockUserSeq;
  let retInfo = {};
  User.findall({
    attribute: 'seq',
    where: {
      id: info.lock_user_ID
    }
  }).then(theUser => {
    if (!theUser) {
      console.log("The User %s cannot be found in database.", info.lock_user_ID);
      return res.status(404).end();
    }

    lockUserSeq = theUser.seq;
  })
    .catch(err => next(err));
  //TODO give a user new NAME?
  if (lockUserSeq) {
    // update status
    UserRoom.update({
        ur_user_status: info.lock_user_status
      }, {
        where: {
          ur_user_seq: lockUserSeq
        }
      }
    );
  }
  resRouter('nUstaEditAnw', info.senderUserID, null, retInfo);
  //TODO notify the lock_user that his/her status/name has beend changed.
}

/**
 * the mobile app (lock_manager) requests to clear a lock user, disable all rights.
 * Brief:
 * lock_manager asks for clear a lock user, server changes his/her status (ur_user_status)
 * in db UserRoom.
 * Parameters needed:
 * senderUserID: the app user's ID
 * lock_user_ID: the user whose info will be edited.
 * lock_ID: the new lock user status
 * done
 */
export function clearLockUser(info, res) {

  let sendUserseq;
  let lockSeq;

  Lock.findall({
    attribute: ['seq'],
    where: {
      lock_id: info.lock_ID
    }
  }).then(theLock => {
    if (!theLock) {
      console.log("ClearLockUser: The lock %s cannot be found.", info.lock_ID);
      return res.status(404).end();
    }
    lockSeq = theLock.seq;
  }).catch(err => next(err));

  User.findall({
    attribute: ['seq'],
    where: {
      id: info.senderUserID
    }
  }).then(theUser => {
    if (!theUser) {
      console.log("ClearLockUser: The user %s cannot be found.", info.senderUserID);
      return res.status(404).end();
    }
    sendUserseq = theUser.seq;
  }).catch(err => next(err));

  UserRoom.findall({
    where: {
      ur_user_seq: sendUserseq,
      ur_lock_seq: lockSeq
    }
  }).then(theUserRoom => {
    if (!theUserRoom) {
      console.log("ClearLockUser: The user-room cannot be found.");
      return res.status(404).end();
    }
  }).catch(err => next(err));

  UserRoom.update({
    ur_user_status: 2
  }, {
    where: {
      ur_user_seq: sendUserseq,
      ur_lock_seq: lockSeq
    }
  });
  return resRouter('nClearLockAnw', info.senderUserID, info.senderUserID, null);
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
 * app client requests to change a room's info
 * brief:
 * app asks to change the info of room, (room_set:) 1-room_name, 2-room_group_seq,
 * 3-door_open_notification, 4-lock_mngpw
 * parameters needed:
 * room_set: used to choose the info needed to be changed
 * new_value: the new_value used to set the info
 * lock_id:
 * room_manager_id:
 */
export function mobileChangeRoomInfo(info, res) {

  switch (info.room_set) {
    //修改房间名
    case 1:
      Room.update({
        room_name: info.new_value
      }, {
        where: {
          room_name: info.room_name
        }
      });
      break;
    //修改房间分组
    case 2:
      Room.update({
        room_name: info.room_name,
      }, {
        where: {
          room_name: info.new_value
        }
      });
      break;
    //开关开锁提醒
    case 3:
    /*Lock.update({
     room_name: req.body.room_name,
     }, {
     where: {
     room: req.body.room_name
     }
     });
     break;
     */
    //修改管理员密码
    case 4:
      Lock.update({
        lock_id: info.lock_id,
      }, {
        where: {
          lock_mngpw: info.new_value
        }
      });
      break;
    default:
      console.log("appChangeRoomInfo: the roomset %s cannnot be found", info.room_set);
      break;
  }
}

