const textOfMonth = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

function zeros(n) {
  let zero = '';
  let newN = n;
  newN = n.toString();
  if (newN.length < 2) {
    for (let i = 0; i < 2 - newN.length; i += 1) {
      zero += '0';
    }
  }
  return zero + newN;
}
function getBetweenDay(sdate, edate) {
  const strStart = `${sdate.toString().substr(0, 4)}-${sdate.toString().substr(5, 2)}-${sdate.toString().substr(8, 2)}`;
  const strEnd = `${edate.toString().substr(0, 4)}-${edate.toString().substr(5, 2)}-${edate.toString().substr(8, 2)}`;
  function getDateObj(strDate) {
    const dateArray = strDate.split('-');
    return new Date(dateArray[0], Number(dateArray[1]) - 1, dateArray[2]);
  }
  return (getDateObj(strEnd).getTime() - getDateObj(strStart).getTime()) / 86400000;
}
function dateFormat(date) {
  const temp = date.indexOf('T') >= 0 ? date.split('T')[0] : date;
  const newDate = new Date(temp);
  return `${textOfMonth[newDate.getMonth()]}월 ${newDate.getDate()}일`;
}
function dateDotFormat(date) {
  const temp = date.indexOf('T') >= 0 ? date.split('T')[0] : date;
  const newDate = new Date(temp);
  return `${textOfMonth[newDate.getMonth()]}.${newDate.getDate()}`;
}
function dateYearFormat(date) {
  const arrDate = date.split('-');
  return `${arrDate[0].substr(2, 2)}.${arrDate[1]}.${arrDate[2]}`;
}
function getDayOfWeek(date) {
  const temp = date.indexOf('T') >= 0 ? date.split('T')[0] : date;
  const newDate = new Date(temp);
  return dayOfWeek[newDate.getDay()];
}
function getToday(value) {
  const today = value || new Date();
  return `${today.getFullYear()}-${zeros(today.getMonth() + 1)}-${zeros(today.getDate())}`;
}
function numberFormat(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function priceFormat(x) {
  return parseInt(x, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function priceReFormat(x) {
  return x.replace(/,/gi, '');
}
function flightCityInputFormat(data) {
  return {
    placeName: data.PlaceName,
    countryName: data.CountryName,
    placeCode: data.PlaceId,
    id: data.CityId || data.PlaceId,
  };
}
function getTimeString(targetDate, beforeDate) {
  let gapDate = 0;
  if (beforeDate) {
    gapDate = this.getBetweenDay(beforeDate, targetDate);
  }
  if (gapDate > 0) {
    return `${targetDate} <span>(+${gapDate})</span>`;
  }
  return targetDate;
}
function getDurationString(duration) {
  if (duration % 60 === 0) {
    return `${parseInt(duration / 60, 10)}시간`;
  } else if (parseInt(duration / 60, 10) === 0) {
    return `${duration % 60}분`;
  }
  return `${parseInt(duration / 60, 10)}시간 ${duration % 60}분`;
}
function getTimeFromDate(date) {
  const time = date.split('T')[1];
  // const hour = parseInt(time.split(':')[0], 10);
  // if (parseInt(time.split(':')[0], 10))
  return `${parseInt(time.split(':')[0], 10)}:${parseInt(time.split(':')[1], 10)}`;
}
function emailcheck(strValue) {
  const regExp = /[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/;
  let returnVal = true;
  if (strValue.length === 0) {
    returnVal = false;
  }
  if (!strValue.match(regExp)) {
    if (strValue === 'bringprice') {
      returnVal = true;
    }
    returnVal = false;
  }
  return returnVal;
}
function getDateGapInfo(departure, arrival) {
  let returnVal = 0;
  if (departure && arrival) {
    const tempDept = departure.split('T');
    const tempDateDept = new Date(tempDept[0]);
    tempDateDept.setHours(parseInt(tempDept[1].split(':')[0], 10), parseInt(tempDept[1].split(':')[1], 10));
    const tempArr = arrival.split('T');
    const tempDateArr = new Date(tempArr[0]);
    tempDateArr.setHours(parseInt(tempArr[1].split(':')[0], 10), parseInt(tempArr[1].split(':')[1], 10));
    const gap = tempDateArr - tempDateDept;
    returnVal = gap / 1000 / 60;
  } else {
    returnVal = 0;
  }
  return returnVal;
}
function getTime(time, arrivalDate) {
  const arrTime = time.split('T')[1].split(':');
  const hour = parseInt(arrTime[0], 10);
  let diff = '';
  if (arrivalDate && arrivalDate.split('T')[0] !== time.split('T')[0]) {
    diff = ` (+${this.format.getBetweenDay(arrivalDate, time)})`;
  }
  return `${hour < 12 ? '오전' : '오후'} ${hour > 12 ? hour - 12 : hour}:${arrTime[1]}${diff}`;
}
function ymdErrCheck(y, m, d) {
  const lastDay = d;
  const intCheck = /^[0-9]*$/;
  const dataVal = `${y}-${m}-${d}`;
  const dataVal2 = `${y}${m}${d}`;
  const dateCheck = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;
  const lastDayCheck = new Date(dataVal).getDate() === parseInt(lastDay, 10);
  let returnVal = '';
  if (!intCheck.test(dataVal2)) {
    returnVal = '숫자만 입력 가능합니다.';
  } else if (
    `${y}${m}${d}` && ((!dateCheck.test(dataVal)
    || !lastDayCheck
    || y > new Date().getFullYear()))) {
    // console.log(`${y}${m}${d}`);
    returnVal = '생년월일이 유효하지 않습니다.';
  }
  return returnVal;
}
function ratingText(rating) {
  if (rating >= 9) {
    return '최고';
  } else if (rating >= 8) {
    return '우수';
  } else if (rating >= 7) {
    return '좋음';
  }
  return '양호';
}
function hotelCategoryOverride(category) {
  let returnVal = '';
  switch (category) {
    case 'HOTEL' :
      returnVal = '호텔';
      break;
    case 'APARTMENT' :
      returnVal = '아파트';
      break;
    case 'HOSTEL' :
      returnVal = '호스텔';
      break;
    case 'GUESTHOUSE_BNB' :
      returnVal = '게스트 하우스';
      break;
    case 'MOTEL' :
      returnVal = '모텔';
      break;
    case 'PENSION' :
      returnVal = '펜션';
      break;
    case 'RESORT' :
      returnVal = '리조트';
      break;
    case 'CAMP' :
      returnVal = '캠프';
      break;
    case 'ETC' :
      returnVal = '기타';
      break;
    default :
      returnVal = '';
      break;
  }
  return returnVal;
}
// { code: 'INTERNET', info: '인터넷' },
// { code: 'BREAKFAST', info: '조식' },
// { code: 'PARKING', info: '주차' },
// { code: 'FRONT_DESK_24', info: '24시간 프론트' },
// { code: 'BARBECUE', info: '바베큐 시설' },
// { code: 'POOL', info: '수영장' },
// { code: 'ELEVATOR', info: '엘리베이터' },
// { code: 'LAUNDRY', info: '세탁 시설' },
// { code: 'KITCHEN', info: '주방' },
// { code: 'RESTAURANT', info: '레스토랑' },
// { code: 'ROOM_SERVICE', info: '룸서비스' },
// { code: 'SMOKE', info: '흡연 시설' },
// { code: 'TERRACE', info: '테라스' },
// { code: 'LIBRARY', info: '도서관' },
// { code: 'FITNESS_CENTER', info: '피트니스 센터' },
// { code: 'SPA_SAUNA', info: '스파 및 사우나' },
// { code: 'CASINO', info: '카지노' },

function hotelFacilitiesOverride(facilities) {
  let returnVal = '';
  switch (facilities) {
    case 'INTERNET' :
      returnVal = '인터넷';
      break;
    case 'BREAKFAST' :
      returnVal = '조식';
      break;
    case 'PARKING' :
      returnVal = '주차';
      break;
    case 'FRONT_DESK_24' :
      returnVal = '24시간 프론트';
      break;
    case 'BARBECUE' :
      returnVal = '바베큐 시설';
      break;
    case 'POOL' :
      returnVal = '수영장';
      break;
    case 'ELEVATOR' :
      returnVal = '엘리베이터';
      break;
    case 'LAUNDRY' :
      returnVal = '세탁 시설';
      break;
    case 'KITCHEN' :
      returnVal = '주방';
      break;
    case 'RESTAURANT' :
      returnVal = '레스토랑';
      break;
    case 'ROOM_SERVICE' :
      returnVal = '룸서비스';
      break;
    case 'SMOKE' :
      returnVal = '흡연 시설';
      break;
    case 'TERRACE' :
      returnVal = '테라스';
      break;
    case 'LIBRARY' :
      returnVal = '도서관';
      break;
    case 'FITNESS_CENTER' :
      returnVal = '피트니스 센터';
      break;
    case 'CASINO' :
      returnVal = '카지노';
      break;
    case 'SPA_SAUNA' :
      returnVal = '스파 및 사우나';
      break;
    default :
      returnVal = '';
      break;
  }
  return returnVal;
}
function nameRexp(val) {
  const regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi; // eslint-disable-line
  let returnVal = { type: true, msg: '' };
  // console.log(val.split(''));
  // console.log(val.split('')[0], val.split('')[val.length - 1]);
  switch (true) {
    case val.split('')[0] === ' ' || val.split('')[val.length - 1] === ' ' :
      returnVal = { type: false, msg: '이름을 올바르게 입력해주세요.' };
      break;
    case regExp.test(val) && val.trim() !== '' :
      returnVal = { type: false, msg: '특수문자를 포함 할 수 없으며 2 글자 이상이여야 합니다.' };
      break;
    case val.trim() !== '' && val.length <= 1:
      returnVal = { type: false, msg: '이름이 너무 짧습니다.' };
      break;
    default :
      break;
  }
  return returnVal;
}
function pwRexp(val) {
  // 영문 1 이상 특수문자 1 이상 숫자 1 이상 포함
  // const regExp = /(?=.*\d{1,50})(?=.*[~`!@#$%\^&*()-+=]{1,50})(?=.*[a-zA-Z]{2,50}).{8,50}$/; // eslint-disable-line
  // return regExp.test(val);
  let returnVal = { type: true, msg: '' };
  switch (true) {
    case val.trim() !== '' && val.length < 7 :
      returnVal = { type: false, msg: '7자리 이상 영문 대소문자, 숫자 조합으로 가능합니다.' };
      break;
    case val.indexOf(' ') >= 0 :
      returnVal = { type: false, msg: '공백은 포함할 수 없습니다.' };
      break;
    default :
      break;
  }
  if (val.trim() !== '' && val.length < 7 && val.indexOf(' ') >= 0) {
    returnVal = { type: false, msg: '7자리 이상 영문 대소문자, 숫자 조합으로 가능하며 공백은 포함할 수 없습니다.' };
  }
  return returnVal;
}
function makeMarkerSVG(data) {
  const moreLongText = data.price.length >= data.category.length ? data.price : data.category;
  const length = (data.price.length && data.category.length ? moreLongText.replace(/,/g, '').length * 10 : moreLongText.length > 7 ? moreLongText.replace(/,/g, '').length * 10 : 70) + 15; // eslint-disable-line
  const height = 47;
  const radius = 1;
  const m = `M5 2 h${length} a${radius},${radius} 0 0 1 ${radius},${radius} v${height - 10 - (radius * 2)} a${radius},${radius} 0 0 1 -${radius},${radius} h -${(length / 2) - 5} l -5 5 l -5 -5  h -${(length / 2) - 5} a${radius},${radius} 0 0 1 -${radius},-${radius} v-${height - 10 - (radius * 2)} a${radius},${radius} 0 0 1 ${radius},-${radius} z`;
  const backgroundColor = data.active ? '#537aff' : '#fff';
  const border = data.active ? '#305bf0' : '#cdcdcd';
  const PfontColor = data.active ? '#fff' : '#4a4a4a';
  const CfontColor = data.active ? '#fff' : '#868686';
  const code = `
        <svg style="filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.3));" xmlns="http://www.w3.org/2000/svg" width="${length + 10}" height="${height}">
          <path fill="${backgroundColor}" stroke="${border}" stroke-width="1" d="${m}"/>
          <text fill="${PfontColor}" style="font-family: Arial, sans-serif;" font-size="12px" font-weight="600">
            <tspan x="12" y="31">${data.price}${data.price ? '원' : 'Sold Out'}</tspan>
          </text>
          <text fill="${CfontColor}" style="font-family: Arial, sans-serif;" font-size="10px">
            <tspan x="12" y="17">${data.category}</tspan>
          </text>
        </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(code)}`;
}
export default{
  getBetweenDay,
  zeros,
  getDayOfWeek,
  dateFormat,
  dateYearFormat,
  numberFormat,
  priceReFormat,
  getToday,
  flightCityInputFormat,
  priceFormat,
  dateDotFormat,
  getTimeString,
  getDurationString,
  getTimeFromDate,
  emailcheck,
  getDateGapInfo,
  getTime,
  ymdErrCheck,
  ratingText,
  hotelCategoryOverride,
  nameRexp,
  pwRexp,
  makeMarkerSVG,
  hotelFacilitiesOverride,
};
