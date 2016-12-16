'use strict'


/**
 * Brief:
 * application layer communication routers, used for frame and unframe application layer communication protocol
 */


/**
 * Brief:
 * applicaiton protocol request router
 *
 * Application protocol:
 * NetCmd||USER_ID||EKEY【Information.toByteArray】
 *
 * EKEY:
 *
 */
function jsonToByteArray(jsonData) {
  return Buffer.from(jsonData, 'utf8');
}

function ByteArrayToJson(ByteArray) {
  return String.fromCharCode.apply(null, ByteArray);
}


export function reqRouter(req, res) {
  let reqData;
  let NetCmd;
  let User_ID;
  let EkeyByteArray;
  let Information = {};
  let retInfo = {};

  [NetCmd, User_ID, EkeyByteArray] = req.body.split('||');
  reqData = req.body.split('||');
  // information = EkeyDecry(EkeyByteArray);
  Information = EkeyByteArray;
  // String to JSON Object
  Information = eval("(" + Information + ")");
  Information.senderUser_ID = User_ID;

  switch (NetCmd) {
    //APP用户注册申请验证码
    case 'nChkNumAsk' :
      mobileRegChkNum(info, res);
      break;

    //APP用户手机注册申请
    case 'nRegAsk' :
      mobileRegister(Information, res);
      break;

    //用户登录请求
    case 'nLogAsk' :
      console.log("请求指令：%s, 用户ID：%s,登录类型：%d,密码：%s, 手机或邮箱：%s", NetCmd, Information.senderUser_ID, Information.log_type, Information.user_pw, Information.phone_email);

      retInfo.status_code = 'OK';
      resRouter('nLogAnw', Information.senderUser_ID, null, retInfo, res)
      break;

    //用户重置密码请求
    case 'nPwAsk' :

      break;

    //房间列表申请
    case 'nRoomListAsk' :
      mobileRoomIndex(Information, res);
      break;

    //电子钥匙申请
    case 'nEkeyLoadAsk' :
      generateLockKey(Information, res);
      break;

    //绑定门锁校验请求
    case 'nBindChkAsk' :
      bindRoomLock(Information, res);
      break;

    //开锁记录
    case 'nOpenDoor' :
      lockOpenRec(Information, res);
      break;

    //发送电子钥匙申请
    case 'nEkeyAsk' :
      sendLockKey(Information, res);
      break;

    //发送密码申请
    case 'nTempPwAsk' :
      getLockPassword(Information, res);
      break;

    //门锁用户列表查询申请
    case 'nUserListAsk' :
      getLockUserList(info, res);
      break;

    //用户状态修改申请
    case 'nStaChgAsk' :
      editLockUserInfo(info, res);
      break;

    //开锁记录查询
    case 'nOpenRecAsk' :
      lockOpenLog(Information, res)
      break;
    //清除门锁用户请求
    case 'nClearAsk' :
      clearLockUser(info, res);
      break;

    //房间信息修改申请
    case "nRoomSetAsk" :
      mobileChangeRoomInfo(info, res);
      break;
    //消息查看请求
    case "nMsgAsk" :

      break;
    //推送通知应答
    case "nCmdAsk" :

      break;
    default:
      res.send(req.body);
  }


  return 0;
}
/**
 * Brief:
 * applicaiton protocol response router
 * encryp. and frame data
 * Application protocol:
 * NetCmd||USER_ID||EKEY【Information.toByteArray】
 *
 * EKEY:
 *
 */
export function resRouter(NetCmd, senderUser_ID, receiverUserID, resInformation, res) {

  let EKeyByteArray;
  //EkeyInformation = EKeyEncry(resInformation);


  switch (NetCmd) {
    //
    case 'nTempPwAnw' :
      res.send(NetCmd + "||" + senderUser_ID + "||" + EKeyInformation);
      break;

    case 'nEkeyAnw':

      break;

    case 'nRoomListAnw' :
      res.send(NetCmd + "||" + senderUser_ID + "||" + EKeyInformation);
      break;

    case 'nOpenRecAnw' :
      //res.send();
      break;

    case  'nLogAnw':
      resInformation.User_ID = senderUser_ID;
      let ByteArray = jsonToByteArray(JSON.stringify(resInformation));
///TODO Encrypt the ByteArray
      EKeyByteArray = ByteArray;

      console.log("nLogAnw successfully.");

      //res.send(NetCmd + "||" + senderUser_ID + "||" + JSON.stringify(EKeyInformation));
      res.send(NetCmd + "||" + senderUser_ID + "||" + EKeyByteArray);
      break;

    default :
      res.send("default response.");
  }
  return 0;

}


