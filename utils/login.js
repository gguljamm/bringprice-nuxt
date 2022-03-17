import base64 from 'base-64';

function afterLogin(data) {
  const COOKIEDATE = new Date();
  COOKIEDATE.setDate(COOKIEDATE.getDate() + 30);
  const cookieConditions = {
    expires: COOKIEDATE,
    path: '/',
  };
  if (window.location.hostname !== '127.0.0.1' && window.location.hostname !== 'localhost' && window.location.hostname !== 'dev.bp.front.bringprice.com') {
    cookieConditions.domain = '.bringprice.com';
  }
  const encodeData = JSON.parse(base64.decode(data.Token.split('.')[1], true));
  return {
    encodeData,
    token: data.Token,
    cookieConditions,
  };
  // if (encodeData.userName) {
  //   $.cookies('userName', encodeData.userName, cookieConditions);
  // }
  // if (encodeData.userEmail) {
  //   $.cookies('userEmail', encodeData.userEmail, cookieConditions);
  // }
}

export default {
  afterLogin,
};
