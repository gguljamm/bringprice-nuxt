import axios from 'axios';
// import VueCookies from 'vue-cookies';

require('es6-promise').polyfill();
require('formdata-polyfill');

let logServerProtocol = 'https';
let logServerHost = 'api.bringprice.com'; // https 인증서 문제있을시 교체요

if (process.env.isDev) {
  // test
  logServerProtocol = 'http';
  logServerHost = 'dev.air.bp.back.bringprice.com:8000';
}

function encodeQueryData(data) {
  const ret = [];
  Object.keys(data).forEach((key) => {
    ret.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
  });

  return ret.join('&');
}

function logInfomationSend(actionType, data, method) {
  const _method = method || 'POST';
  const logRootPath = 'liveprices';

  if (_method === 'POST') {
    return axios.post(
      `${logServerProtocol}://${logServerHost}/${logRootPath}/${actionType}`,
      data,
    );
  }

  const _data = typeof data !== 'string' ? data : encodeQueryData(data);

  return axios.get(
    `${logServerProtocol}://${logServerHost}/${logRootPath}/${actionType}?${_data}`,
  );
}

function saveBookingInfoToWeblogDB(bookingInfo) {
  const bodyFormData = new FormData();
  Object.keys(bookingInfo).forEach((key) => {
    bodyFormData.append(key, bookingInfo[key]);
  });
  axios.post(`${logServerProtocol}://${logServerHost}/log/book`, bodyFormData);
}

function saveBookingInfoSend(saveBookingInfo) {
  // console.log(saveBookingInfo);
  return logInfomationSend('save-booking-info', saveBookingInfo);
}

function saveSearchInfo(searchInfo) {
  // console.log(searchInfo);
  return logInfomationSend('save-search-info', searchInfo);
}

function saveSearchInfoDev(obj) {
  const logRootPath = 'api/BPSearchInfo/SaveSearchInfo';
  const bodyFormData = new FormData();
  Object.keys(obj).forEach((key) => {
    bodyFormData.append(key, obj[key]);
  });
  return axios.post(`${logServerProtocol}://${logServerHost}/${logRootPath}`, bodyFormData);
}

function sendSelectedSchedule(selectedScheduleInfo) {
  return axios.post(`${logServerProtocol}://${logServerHost}/log/select`, JSON.stringify(selectedScheduleInfo));
}

export default{
  saveBookingInfoSend,
  saveSearchInfo,
  logInfomationSend,
  saveBookingInfoToWeblogDB,
  sendSelectedSchedule,
  saveSearchInfoDev,
};
