import axios from 'axios';
import axiosCancel from 'axios-cancel';

axiosCancel(axios);

require('es6-promise').polyfill();

// product
let hotelBaseUri = 'https://hotel.bp.back.bringprice.com/v1';
let flightBaseUri = 'https://api.bringprice.com'; // https 인증서 문제있을시 교체요

if (process.env.isDev) {
  // test
  hotelBaseUri = 'http://test.api.hotel.bringprice.com:18081/v1';
  flightBaseUri = 'http://dev.air.bp.back.bringprice.com:8000';
}

const CancelToken = axios.CancelToken;

const hotelHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  Authorization: 'ce038fb5-d6e6-4297-99c5-001bd8ece5d8:5siDGMgt',
};

let hotelAutoCompleteCancel;
function hotelAutoComplete(query) {
  if (hotelAutoCompleteCancel) {
    hotelAutoCompleteCancel('cancel');
  }
  return axios.get(
    `${hotelBaseUri}/autocomplete?text=${query}`, {
      cancelToken: new CancelToken((c) => {
        hotelAutoCompleteCancel = c;
      }),
      headers: hotelHeaders,
    },
  );
}

let hotelRemainingPercent;

function gethotelRemainingPercent(req) {
  const str = req;
  if (hotelRemainingPercent) {
    hotelRemainingPercent('cancel');
  }
  return axios.get(`${hotelBaseUri}/hotels/remainingPercent?${str}`, {
    cancelToken: new CancelToken((c) => {
      hotelRemainingPercent = c;
    }),
    headers: hotelHeaders,
  });
}

let hotelsCount;
function getHotelsCount(req) {
  const str = req;
  if (hotelsCount) {
    hotelsCount('cancel');
  }
  return axios.get(`${hotelBaseUri}/hotels/count?${str}`, {
    cancelToken: new CancelToken((c) => {
      hotelsCount = c;
    }),
    headers: hotelHeaders,
  });
}

let hotelListCancel;
function getHotelList(req, isSuggest) {
  // console.log(req);
  if (hotelListCancel) {
    hotelListCancel('cancel');
  }
  return axios.get(`${hotelBaseUri}/hotels${isSuggest ? '/suggestion' : ''}?${req}`, {
    cancelToken: new CancelToken((c) => {
      hotelListCancel = c;
    }),
    headers: hotelHeaders,
  });
}

let hotelDetailCancel;
function getHotelDetail(req, hotelId) {
  // console.log(req);
  if (hotelDetailCancel) {
    hotelDetailCancel('cancel');
  }
  return axios.get(`${hotelBaseUri}/hotels/${hotelId}?${req}`, {
    cancelToken: new CancelToken((c) => {
      hotelDetailCancel = c;
    }),
    headers: hotelHeaders,
  });
}

let flightAutoCompleteCancel;
function flightAutoComplete(query) {
  if (flightAutoCompleteCancel) {
    flightAutoCompleteCancel('cancel');
  }
  return axios.get(
    `${flightBaseUri}/api/BPCitySuggest/Autocomplete?Query=${query}`, {
      cancelToken: new CancelToken((c) => {
        flightAutoCompleteCancel = c;
      }),
    },
  );
}

function findCityName(code) {
  return axios.get(
    `${flightBaseUri}/api/BPCitySuggest/PlaceInformation?CityCode=${code}&Locale=ko-KR&Country=KR&Currency=KRW`,
  );
}

function arrFindCityName(arrCode) {
  const arr = [];
  for (let x = 0; x < arrCode.length; x += 1) {
    arr.push(this.findCityName(arrCode[x]));
  }
  return axios.all(
    arr,
  );
}

let recommendCityListCancel;
function recommendCityList(startCityCode, arrWish) {
  const arr = [];
  for (let x = 0; x < arrWish.length; x += 1) {
    arr.push(arrWish[x].PlaceId);
  }
  if (recommendCityListCancel) {
    recommendCityListCancel('cancel');
  }
  return axios.get(
    `${flightBaseUri}/api/BPLivepricing/cityCuration`,
    {
      params: {
        StartCity: arr.length === 0 ? startCityCode : '',
        WishCities: arr.join('|'),
        Locale: 'ko-KR',
      },
      cancelToken: new CancelToken((c) => {
        recommendCityListCancel = c;
      }),
    },
  );
}

function getOpenSearchList(obj, wishCode) {
  return axios.get(
    `${flightBaseUri}/opensearch/browse-routes/KR/KRW/ko-KR/${obj.startCity.PlaceId}/${wishCode}/${obj.startDate}/${obj.returnDate}`,
  );
}

function getMonthPrice(deptCode, wishCode, departureDate, returnDate) {
  let url = `${flightBaseUri}/opensearch/browse-date-grid/KR/KRW/ko-kr/${deptCode}/${wishCode}/${departureDate}`;
  if (returnDate) {
    url += `/${returnDate}`;
  }
  return axios.get(
    url,
  );
}

function getMultiSchedule(startCity, inputData, wishCities, min, max, orderFix) {
  let url = `${flightBaseUri}/api/BPLivepricing/setSchedule`;
  const arrCode = [];
  for (let x = 0; x < wishCities.length; x += 1) {
    arrCode.push(`"${wishCities[x]}-sky"`);
  }
  const params = {
    DepartureCityCode: `${startCity}-sky`,
    DepartureCityDate: inputData.startDate,
    ArrivalCityCode: `${startCity}-sky`,
    ArrivalCityDate: inputData.returnDate,
    StopCode: encodeURI(`[${arrCode.join(',')}]`),
    Min: encodeURI(JSON.stringify(min)),
    Max: encodeURI(JSON.stringify(max)),
  };
  if (orderFix) {
    params.OrderFix = 'true';
  }
  url = `${url}?${Object.keys(params).map(v => `${v}=${params[v]}`).join('&')}`;
  return axios.get(url);
}

// create session
// http://api.bringprice.com/liveprices/create-session/KR/KRW/ko-kr/SEL/BKK/2017-12-20/2017-12-30/Economy/1/0/0

function createSession(info, userInfo) {
  const createSessionPath = 'liveprices/create-session';
  let flightInformation;
  if (info.returnDate) {
    flightInformation = `KR/KRW/ko-KR/${info.startCode}/${info.wishCode}/${info.startDate}/${info.returnDate}/${info.cabinClass}/${info.adults}/${info.children}/${info.infants}`;
  } else {
    flightInformation = `KR/KRW/ko-KR/${info.startCode}/${info.wishCode}/${info.startDate}//${info.cabinClass}/${info.adults}/${info.children}/${info.infants}`;
  }
  const data = {
    SD: 1,
    UserName: userInfo ? userInfo.username || 'Anonymous' : 'Anonymous',
  };
  return axios.post(
    `${flightBaseUri}/${createSessionPath}/${flightInformation}`, data, {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    },
  );
}

// polling the session
// http://api.bringprice.com/liveprices/pool-results?Location=

function pollingResult() {
  // const pollingResultPath = 'liveprices/pool-results';
  // const requestLocationKey = 'Location';
  //
  // if (window.location.host === 'localhost:8000') {
  //   return axios.get(`/${pollingResultPath}?${requestLocationKey}=${location}`);
  // }
  // return axios.get(
  //   `${flightBaseUri}/${pollingResultPath}?${requestLocationKey}=${location}`,
  // );
  /* eslint-disable */
  return new Promise((resolve) => {
    resolve({
      data: {
        "SessionKey": "ab5b948d616e41fb954a4a2f6b8dde1a_ecilpojl_7CAAD17D0CFC34BFDE68DEBFDFD548C7",
        "Query": {
          "Country": "GB",
          "Currency": "GBP",
          "Locale": "en-gb",
          "Adults": 1,
          "Children": 0,
          "Infants": 0,
          "OriginPlace": "2343",
          "DestinationPlace": "13554",
          "OutboundDate": "2017-05-30",
          "InboundDate": "2017-06-02",
          "LocationSchema": "Default",
          "CabinClass": "Economy",
          "GroupPricing": false
        },
        "Status": "UpdatesComplete",
        "Itineraries": [
          {
            "OutboundLegId": "11235-1705301925--32480-0-13554-1705302055",
            "InboundLegId": "13554-1706020700--32480-0-11235-1706020820",
            "PricingOptions": [
              {
                "Agents": [
                  4499211
                ],
                "QuoteAgeInMinutes": 0,
                "Price": 83.41,
                "DeeplinkUrl": "http://partners.api.skyscanner.net/apiservices/deeplink/v2?_cje=jzj5DawL5zJyT%2bnfe1..."
              },
            ],
            "BookingDetailsLink": {
              "Uri": "/apiservices/pricing/v1.0/ab5b948d616e41fb954a4a2f6b8dde1a_ecilpojl_7CAAD17D0CFC34BFDE68DEBFDFD548C7/booking",
              "Body": "OutboundLegId=11235-1705301925--32480-0-13554-1705302055&InboundLegId=13554-1706020700--32480-0-11235-1706020820",
              "Method": "PUT"
            }
          },
        ],
        "Legs": [
          {
            "Id": "11235-1705300650--32302,-32480-1-13554-1705301100",
            "SegmentIds": [
              0,
              1
            ],
            "OriginStation": 11235,
            "DestinationStation": 13554,
            "Departure": "2017-05-30T06:50:00",
            "Arrival": "2017-05-30T11:00:00",
            "Duration": 250,
            "JourneyMode": "Flight",
            "Stops": [
              13880
            ],
            "Carriers": [
              885,
              881
            ],
            "OperatingCarriers": [
              885,
              881
            ],
            "Directionality": "Outbound",
            "FlightNumbers": [
              {
                "FlightNumber": "290",
                "CarrierId": 885
              },
              {
                "FlightNumber": "1389",
                "CarrierId": 881
              },
            ],
          },
        ],
        "Segments": [
          {
            "Id": 0,
            "OriginStation": 11235,
            "DestinationStation": 13880,
            "DepartureDateTime": "2017-05-30T06:50:00",
            "ArrivalDateTime": "2017-05-30T07:55:00",
            "Carrier": 885,
            "OperatingCarrier": 885,
            "Duration": 65,
            "FlightNumber": "290",
            "JourneyMode": "Flight",
            "Directionality": "Outbound"
          },
        ],
        "Carriers": [
          {
            "Id": 885,
            "Code": "BE",
            "Name": "Flybe",
            "ImageUrl": "http://s1.apideeplink.com/images/airlines/BE.png",
            "DisplayCode": "BE"
          },
        ],
        "Agents": [
          {
            "Id": 1963108,
            "Name": "Mytrip",
            "ImageUrl": "http://s1.apideeplink.com/images/websites/at24.png",
            "Status": "UpdatesComplete",
            "OptimisedForMobile": true,
            "BookingNumber": "+448447747881",
            "Type": "TravelAgent"
          },
        ],
        "Places": [
          {
            "Id": 11235,
            "ParentId": 2343,
            "Code": "EDI",
            "Type": "Airport",
            "Name": "Edinburgh"
          },
        ],
        "Currencies": [
          {
            "Code": "GBP",
            "Symbol": "£",
            "ThousandsSeparator": ",",
            "DecimalSeparator": ".",
            "SymbolOnLeft": true,
            "SpaceBetweenAmountAndSymbol": false,
            "RoundingCoefficient": 0,
            "DecimalDigits": 2
          },
        ],
      },
    });
  });
}

function getBookingDetail(bookingDetailsLink, passengerRoot) {
  const option = `adults=${passengerRoot.adults}&children=${passengerRoot.children}&infants=${passengerRoot.infants}`;
  const getBookingDetailPath = 'liveprices/get-booking-details';

  return axios.put(
    `${flightBaseUri}/${getBookingDetailPath}?${option}`,
    bookingDetailsLink,
  );
}

function pollingBookingDetails(location, passengerRoot) {
  const option = `adults=${passengerRoot.adults}&children=${passengerRoot.children}&infants=${passengerRoot.infants}`;
  const pollingBookingDetailsPath = 'liveprices/pool-booking-details';
  const requestLocationKey = 'Location';

  return axios.get(
    `${flightBaseUri}/${pollingBookingDetailsPath}?${requestLocationKey}=${location}&${option}`,
  );
}

function setPriceAlert(obj) {
  return axios.post(
    `${flightBaseUri}/mailing/`, obj,
  );
}

function pricePrediction(obj) {
  return axios.get(
    `https://price.bringprice.com/price-prediction/${obj.startCity.PlaceId}/${obj.wishCities[0].PlaceId}/${obj.startDate}/${obj.returnDate}/`,
  );
}

function pricePredictionMulti(obj, schedule, leng) {
  let text = '';
  for (let x = 0; x < leng; x += 1) {
    text += `${schedule[`Flight${x}`].DestinationPlace}(${schedule[`Flight${x}`].OutboundDate});`;
  }
  text = text.slice(0, -1);
  return axios.get(
    `https://price.bringprice.com/price-prediction/${obj.startCity.PlaceId}/${text}/`,
  );
}

function abortLivePrice() {
  axios.cancelAll();
}

function isAxiosCancel(thrown) {
  return axios.isCancel(thrown);
}

function covid(path) {
  return axios.get(`https://api.covid19api.com/${path}`);
}

export default {
  hotelAutoComplete,
  flightAutoComplete,
  findCityName,
  arrFindCityName,
  recommendCityList,
  getOpenSearchList,
  getMonthPrice,
  getMultiSchedule,
  createSession,
  pollingResult,
  getBookingDetail,
  pollingBookingDetails,
  getHotelList,
  getHotelsCount,
  setPriceAlert,
  pricePrediction,
  pricePredictionMulti,
  getHotelDetail,
  abortLivePrice,
  isAxiosCancel,
  gethotelRemainingPercent,
  covid,
};
