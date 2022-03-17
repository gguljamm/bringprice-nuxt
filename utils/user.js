import axios from 'axios';

require('formdata-polyfill');

let loginPath = 'https://api.bringprice.com';

if (process.env.isDev) {
  loginPath = 'http://dev.air.bp.back.bringprice.com:8000';
}

function login(obj) {
  const body = new FormData();
  body.set('UserName', obj.UserName);
  body.set('Password', obj.Password);
  const queryUrl = `${loginPath}/BPUser/login`;
  return axios.post(queryUrl, body);
}

function signup(obj) {
  const body = new FormData();
  const queryUrl = `${loginPath}/BPUser/user-register?locale=ko-KR`;
  body.set('UserName', obj.UserName);
  body.set('Name', obj.Name);
  body.set('Password', obj.Password);
  body.set('Subscribe', obj.conduction);
  return axios.post(queryUrl, body);
}

function pwRequest(UserName) {
  const body = new FormData();
  const queryUrl = `${loginPath}/BPUser/resetPassword?locale=ko-KR`;
  body.set('UserName', UserName);
  return axios.post(queryUrl, body);
}

function getUserInfo(id, token) {
  const queryUrl = `${loginPath}/BPUser/${id}/userinfo/`;
  const header = `JWT ${token}`;
  return axios.get(queryUrl, { headers: { Authorization: header } });
}

function getMailingInfo(id) {
  const queryUrl = `${loginPath}/BPUser/mailing/${id}/list`;
  return axios.get(queryUrl);
}

function deleteMailing(id) {
  const queryUrl = `${loginPath}/BPUser/mailing/unfollowing?type=price&ids=${id}`;
  return axios.get(queryUrl);
}

function arrDeleteMailing(arrId) {
  const arr = [];
  for (let x = 0; x < arrId.length; x += 1) {
    arr.push(this.deleteMailing(arrId[x]));
  }
  return axios.all(
    arr,
  );
}

function putUserEmail(id, obj, token) {
  const body = new FormData();
  if (obj.Email) {
    body.set('Email', obj.Email);
  }
  if (obj.Subscribed === 1) {
    body.set('Subscribed', obj.Subscribed);
  } else {
    body.set('Subscribed', 0);
  }
  const queryUrl = `${loginPath}/BPUser/${id}/userinfo/`;
  const header = `JWT ${token}`;
  return axios.put(
    queryUrl,
    body,
    { headers: { Authorization: header } },
  );
}

function putUserInfo(id, obj, token) {
  const body = new FormData();
  if (obj.Email) {
    body.set('Email', obj.Email);
  }
  if (obj.Birthday || obj.Birthday === '') {
    body.set('Birthday', obj.Birthday);
  }
  if (obj.Subscribed === 1) {
    body.set('Subscribed', 1);
  } else if (obj.Subscribed === 0) {
    body.set('Subscribed', 0);
  }
  if (obj.Gender || obj.Gender === '') {
    body.set('Gender', obj.Gender);
  }
  if (obj.TourStyle) {
    for (let x = 0; x < obj.TourStyle.length; x += 1) {
      body.append('TourStyle[]', obj.TourStyle[x]);
    }
  } else {
    body.append('TourStyle[]', []);
  }
  if (obj.PreferenceAirline) {
    for (let x = 0; x < obj.PreferenceAirline.length; x += 1) {
      body.append('PreferenceAirline[]', obj.PreferenceAirline[x]);
    }
  } else {
    body.append('PreferenceAirline[]', []);
  }
  const queryUrl = `${loginPath}/BPUser/${id}/userinfo/`;
  const header = `JWT ${token}`;
  return axios.put(
    queryUrl,
    body,
    { headers: { Authorization: header } },
  );
}

function changePw(obj) {
  const body = new FormData();
  const queryUrl = `${loginPath}/BPUser/changePassword`;
  body.set('UserName', obj.UserName);
  body.set('Password', obj.Password);
  body.set('NewPassword', obj.NewPassword);
  return axios.post(queryUrl, body);
}

function socialLogin(obj) {
  const path = `${loginPath}/BPUser/social-login`;
  const body = new FormData();
  body.set('UserName', obj.UserName);
  body.set('Email', obj.Email);
  body.set('Name', obj.Name);
  body.set('Auth', obj.Auth);
  return axios.post(path, body);
}

export default {
  login,
  signup,
  pwRequest,
  getUserInfo,
  getMailingInfo,
  deleteMailing,
  putUserInfo,
  changePw,
  socialLogin,
  arrDeleteMailing,
  putUserEmail,
};
