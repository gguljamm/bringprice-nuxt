import Log from '~/utils/log'; // eslint-disable-line
import Api from '~/utils/api'; // eslint-disable-line
import Format from '~/utils/format'; // eslint-disable-line

function progress(book) {
  if (!book || !book.list) {
    return 10;
  }
  const progressNum = book.list.filter((key) => {
    if (Array.isArray(key) && key[0].status === 'Current') {
      return true;
    } else if (key.status === 'Current') {
      return true;
    }
    return false;
  }).length / book.list.length;
  return (progressNum < 0.1 ? 0.1 : progressNum) * 100;
}

function bookingInit(vue, sessions, legs, multiInfo, roundInfo, bookList, bookInfo, passenger, error, logFlag) {
  const localBookList = bookList;
  const localBookInfo = bookInfo;
  const isRound = sessions.length === 1 && legs.length === 2;
  function pollingBookingDetails(index, location) {
    Api.pollingBookingDetails(location, passenger).then((resp) => {
      // bookList[index].data = resp.data;
      // bookList[index].state += 1;
      let flightInfo = roundInfo;
      if (!flightInfo) {
        const schedule = multiInfo.scheduleList[multiInfo.selectedIndex];
        const key = `${schedule.FlightInfo[`Flight${index}`].OriginPlace}|${schedule.FlightInfo[`Flight${index}`].DestinationPlace}|${schedule.FlightInfo[`Flight${index}`].OutboundDate}`;
        flightInfo = multiInfo.liveList[key].data;
      }
      localBookInfo[index].data = resp.data;
      const list = resp.data.BookingOptions;
      localBookList[index].list = [];
      for (let x = 0; x < list.length; x += 1) {
        localBookList[index].list.push(list[x].BookingItems.map((z) => { // eslint-disable-line
          return {
            agentName: flightInfo.Agents[z.AgentID].Name,
            agentType: flightInfo.Agents[z.AgentID].Type,
            deeplink: z.Deeplink,
            price: z.Price,
            status: z.Status,
          };
        }));
      }
      vue.$store.commit('setBookCache', {
        key: roundInfo ? `${sessions[index]}${legs.join('')}` : `${sessions[index]}${legs[index]}`,
        value: {
          list: localBookList[index],
          info: localBookInfo[index],
        },
      });
      localBookList[index].requestNum += 1;
      if (resp.data.BookingOptions.some(
        bookingOption => bookingOption.BookingItems.some(
          bookingItem => (bookingItem.Status !== 'Current' && bookingItem.Status !== 'current'),
        ),
      )
      ) {
        window.setTimeout(pollingBookingDetails, 3000, index, location, passenger);
      } else if (logFlag) {
        sendLog(index, 0, 0, localBookInfo, multiInfo, roundInfo, legs, vue.$cookies.get('userName'), vue.$store.state.isMobile ? 'mobile' : 'desktop'); // eslint-disable-line
        // bookIndex, optionIndex, itemIndex, bookInfo, multiInfo, roundInfo, legs, userName, Device
      }
    }).catch(() => {
      error();
    });
  }
  function callBookingDetailHeader(index, session, outboundLeg, inboundLeg) {
    Api.getBookingDetail({
      Uri: `/apiservices/pricing/v1.0/${session}/booking`,
      Method: 'PUT',
      Body: `OutboundLegId=${outboundLeg}&InboundLegId=${inboundLeg}`,
    }, passenger).then((resp) => {
      localBookInfo[index].location = resp.headers.location;
      window.setTimeout(pollingBookingDetails, 1000, index, resp.headers.location, passenger);
    }).catch(() => {
      error();
    });
  }
  for (let z = 0; z < (isRound ? 1 : legs.length); z += 1) {
    let data = roundInfo;
    if (!isRound) {
      const schedule = multiInfo.scheduleList[multiInfo.selectedIndex];
      const key = `${schedule.FlightInfo[`Flight${z}`].OriginPlace}|${schedule.FlightInfo[`Flight${z}`].DestinationPlace}|${schedule.FlightInfo[`Flight${z}`].OutboundDate}`;
      data = multiInfo.liveList[key].data;
    }
    const key = isRound ? `${sessions[z]}${legs[0]}${legs[1]}` : `${sessions[z]}${legs[z]}`;
    if (!vue.$store.state.bookCache[key]) {
      const arr = {
        max: 6,
        list: [],
        requestNum: 0,
      };
      for (let x = 0; x < data.Itineraries.length; x += 1) {
        if ((isRound && data.Itineraries[x].OutboundLegId === legs[0] && data.Itineraries[x].InboundLegId === legs[1])
          || (!isRound && data.Itineraries[x].OutboundLegId === legs[z])) {
          const list = data.Itineraries[x].PricingOptions;
          for (let y = 0; y < list.length; y += 1) {
            arr.list.push([{
              agentName: data.Agents[list[y].Agents[0]].Name,
              agentType: data.Agents[list[y].Agents[0]].Type,
              deeplink: [list[y].DeeplinkUrl],
              price: parseInt(list[y].Price, 10),
              status: 'Pending',
            }]);
          }
          break;
        }
      }
      localBookList.push(arr);
      if (!logFlag || (logFlag && logFlag.index === z)) {
        vue.$store.commit('setBookCache', {
          key,
          value: {
            list: arr,
            info: null,
          },
        });
        callBookingDetailHeader(z, sessions[z], legs[z], isRound ? legs[1] : '', passenger);
      }
    } else {
      localBookList.push(vue.$store.state.bookCache[key].list);
      localBookInfo[z] = vue.$store.state.bookCache[key].info;
      if (progress(vue.$store.state.bookCache[key].list) !== 100) {
        const a = setInterval(() => {
          localBookList[z] = vue.$store.state.bookCache[key].list;
          localBookInfo[z] = vue.$store.state.bookCache[key].info;
          localBookList[z].requestNum += 1;
          if (progress(vue.$store.state.bookCache[key].list) === 100) {
            clearInterval(a);
            if (logFlag && logFlag.index === z) {
              sendLog(z, 0, 0, localBookInfo, multiInfo, roundInfo, legs, vue.$cookies.get('userName'), vue.$store.state.isMobile ? 'mobile' : 'desktop'); // eslint-disable-line
            }
          }
        }, 3000);
      } else if (logFlag && logFlag.index === z) {
        sendLog(z, 0, 0, localBookInfo, multiInfo, roundInfo, legs, vue.$cookies.get('userName'), vue.$store.state.isMobile ? 'mobile' : 'desktop'); // eslint-disable-line
      }
    }
  }
}

function sendLog(bookIndex, optionIndex, itemIndex, bookInfo, multiInfo, roundInfo, legs, userName, Device) {
  function getDateForLog(date, startDate) {
    const arrTime = date.split('T')[1].split(':');
    let flag = 'am';
    let time = parseInt(arrTime[0], 10);
    if (time >= 12) {
      flag = 'pm';
    }
    if (time > 12) {
      time -= 12;
    }
    if (!startDate || date.split('T')[0] === startDate.split('T')[0]) {
      return `${Format.zeros(time)}:${arrTime[1]} ${flag}`;
    }
    const gapDate = Format.getBetweenDay(startDate.split('T')[0], date.split('T')[0]);
    return `${Format.zeros(time)}:${arrTime[1]} ${flag} <span>(+${gapDate})</span>`;
  }

  function getLegObj(legId) {
    const leg = roundInfo.Legs[legId];
    // 01:55 pm <span>(+1)</span>
    return {
      arrivalTime: getDateForLog(leg.Arrival, leg.Departure),
      carrierImages: leg.Carriers.map(x => roundInfo.Carriers[x].ImageUrl),
      carriers: leg.Carriers.map(x => roundInfo.Carriers[x].Name),
      departureTime: getDateForLog(leg.Departure),
      destinationPlace: roundInfo.Places[leg.DestinationStation].Code,
      duration: `${Format.zeros(parseInt(leg.Duration / 60, 10))}h ${Format.zeros(leg.Duration % 60)}m`,
      originPlace: roundInfo.Places[leg.OriginStation].Code,
      stops: leg.Stops.map(x => roundInfo.Places[x].Code),
    };
  }
  const newBookInfo = Object.assign({}, bookInfo[bookIndex].data);
  let flightInfo = roundInfo;
  if (!flightInfo) {
    const schedule = multiInfo.scheduleList[multiInfo.selectedIndex];
    const key = `${schedule.FlightInfo[`Flight${bookIndex}`].OriginPlace}|${schedule.FlightInfo[`Flight${bookIndex}`].DestinationPlace}|${schedule.FlightInfo[`Flight${bookIndex}`].OutboundDate}`;
    flightInfo = multiInfo.liveList[key].data;
  }
  newBookInfo.Agents = flightInfo.Agents;
  Log.saveBookingInfoToWeblogDB({
    Book: JSON.stringify(newBookInfo),
    FlightNumber: bookIndex,
    OptionNumber: optionIndex,
    ItemNumber: itemIndex,
    UserName: userName,
    SelectedScheduleId: multiInfo && multiInfo.scheduleId ? multiInfo.scheduleId : '',
    Device,
  });
  if (roundInfo) {
    const bookInfoForLog = Object.assign({}, bookInfo[bookIndex].data);
    if (bookInfoForLog.BookingOptions) {
      bookInfoForLog.BookingOptions = bookInfoForLog.BookingOptions[bookInfoForLog.BookingOptions[optionIndex] ? optionIndex : 0];
    }
    Log.saveBookingInfoSend({
      agents: newBookInfo.Agents,
      bookingDetails: bookInfoForLog,
      places: roundInfo.Places,
      pollingSessionnpHeader: bookInfo[bookIndex].location,
      query: roundInfo.Query,
      selectedFlight: {
        outbound: getLegObj(legs[0]),
        inbound: getLegObj(legs[1]),
      },
      username: userName,
    });
  }
}

export default {
  bookingInit,
  progress,
  sendLog,
};
