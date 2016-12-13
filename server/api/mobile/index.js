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

export function reqRouter (req, res)
{
  res.send("here you go");
  let reqData;
  let NetCmd;
  let User_ID;
  let EkeyInformation;
  let Information;
  reqData = req.body.split("||");
  NetCmd = reqData[0];
  User_ID = reqData[1];
  EkeyInformation = reqData[2];
  // information = EkeyDecry(EkeyInformation);
  Information = EkeyInformation;
  Information.senderUser_ID = User_ID;


  switch (NetCmd)
  {
    //APP用户注册申请验证码
    case "nChkNumAsk" :

      break;

    //APP用户手机注册申请
    case "nRegAsk" :


      break;

    //用户登录请求
    case "nLogAsk" :

      break;

    //用户重置密码请求
    case "nPwAsk" :

      break;

    //房间列表申请
    case "nRoomListAsk" :
        mobileRoomIndex(Information, res);
      break;

    //电子钥匙申请
    case "nEkeyLoadAsk" :
      generateLockKey(Information, res);
      break;

    //绑定门锁校验请求
    case "nBindChkAsk" :
      bindRoomLock(Information, res);
      break;

    //开锁记录
    case "nOpenDoor" :
      lockOpenRec(Information,res);

      break;

    //发送电子钥匙申请
    case "nEkeyAsk" :
      sendLockKey(Information, res);
      break;

    //发送密码申请
    case "nTempPwAsk" :
      getLockPassword(Information, res);

      break;

    //门锁用户列表查询申请
    case "nUserListAsk" :

      break;

    //用户状态修改申请
    case "nStaChgAsk" :

      break;

    //开锁记录查询
    case "nOpenRecAsk" :

      break;

    //房间信息修改申请
    case "nRoomSetAsk" :

      break;
    //消息查看请求
    case "nMsgAsk" :

      break;
    //推送通知应答
    case "nCmdAsk" :

      break;
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
export function resRouter (NetCmd, senderUserID, receiverUserID, resInformation, res)
{

  let EKeyInformation;
  //EkeyInformation = EKeyEncry(resInformation);
  EKeyInformation = resInformation;

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
  }

}
