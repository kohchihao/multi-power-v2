var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var moment = require('moment-timezone');
moment.tz.setDefault("Asia/Singapore");

router.get('/', function (req, res, next) {
  res.send('Working fine 😎');
});


router.get('/:busId', function (req, res, next) {
  getBusData(req.params.busId, function (data) {
    res.render('index', { data: data });
  })
});

router.get('/api/:busId', function (req, res, next) {
  getBusData(req.params.busId, function (data) {
    res.render('table', { data: data });
  })
});

const getBusData = (busId, cb) => {

  let url = 'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=' + busId;
  let options = {
    url: url,
    headers: {
      'AccountKey': 'sc5MnGL2rNuA+V+XqKQnAQ==',
      'UniqueUserId': '2726a158-4685-42ad-bc3c-e517a9eb89ec',
      'accept': 'application/json',
    }
  }
  let bus = [];
  rp(options)
    .then(function (data) {
      
      let json = JSON.parse(data);
      json.Services.forEach(item => {

        let mServiceNo = item.ServiceNo
        let mOperator = item.Operator

        //arrival timing
        let nextBus = item.NextBus
        let mNextBusTiming = nextBus.EstimatedArrival
        mNextBusTiming = convertTo12Hour(mNextBusTiming);
        let mNextBusFeature = nextBus.Feature
        let mNextBusLoad = nextBus.Load
        let mNextBusType;
        if (nextBus.Type === 'SD') {
          mNextBusType = 'Single Deck';
        } else if (nextBus.Type === 'DD') {
          mNextBusType = 'Double Deck';
        } else {
          mNextBusType = 'Bendy';
        }
        
        //next arrival timing
        let subBus = item.NextBus2
        let mSubBusTiming = subBus.EstimatedArrival
        mSubBusTiming = convertTo12Hour(mSubBusTiming);
        let mSubBusFeature = subBus.Feature
        let mSubBusLoad = subBus.Load
        let mSubBusType;
        if (nextBus.Type === 'SD') {
          mSubBusType = 'Single Deck';
        } else if (nextBus.Type === 'DD') {
          mSubBusType = 'Double Deck';
        } else {
          mSubBusType = 'Bendy';
        }

        let data = {
          'mServiceNo': mServiceNo,
          'mOperator': mOperator,
          'mNextBusTiming': mNextBusTiming,
          'mNextBusFeature': mNextBusFeature,
          'mNextBusLoad': mNextBusLoad,
          'mNextBusType': mNextBusType,
          'mSubBusTiming': mSubBusTiming,
          'mSubBusFeature': mSubBusFeature,
          'mSubBusLoad': mSubBusLoad,
          'mSubBusType': mSubBusType
        }
        bus.push(data)
      });

      //cb(bus);

      let url = 'https://forecast.tongtar.com/jtc/forecast/377577';	
      let options = {	
        url: url,	
        method: 'GET',	
        json: true,
      }	

      return rp(options);
    })
    .then(function (res2) {
      finalData = parseApiEndPointv2(res2);
      finalData.forEach(busObj => {
        bus.push(busObj)
      })

      cb(bus);
    })
    .catch(function (err) {
      //err
    });
}

// Convert given date to how many mins the bus will be arriving.
const convertToMins = (date) => {
  //2018-04-15T00:16:28+08:00
  let m = moment(date).fromNow();
  if (m.indexOf('in a few second') != -1) {
    m = 'Arriving';
  }
  if (m.indexOf('a few seconds ago') != -1) {
    m = 'Arrived';
  }
  return m;
}

// Convert given date to 12 hour format.
const convertTo12Hour = (date) => {
  //2018-04-15T00:16:28+08:00
  let m = moment(date).format('hh:mm A');
  if (m.indexOf('in a few second') != -1) {
    m = 'Arriving';
  }
  if (m.indexOf('a few seconds ago') != -1) {
    m = 'Arrived';
  }
  return m;
}

// Get expected arrival time given forecast_time in seconds.
const getExpectedArrivalTime = (forecast_time) => {
  let expectedArrival = moment().add(forecast_time, 'seconds').format('hh:mm A')
  return expectedArrival
}

const getBusNameFromRoute = (route_name) => {
  if (route_name === "Route B") {
    return "JTC B";
  } else {
    return "JTC C";
  }
}

/* NOT IN USE SINCE 02/09/2019 */
const parseApiEndPoint = (data) => {
  let busB = [];
  let busC = [];
  let finalBusData = [];
  data.forecast.forEach(elem => {    
    let name = getBusNameFromRoute(elem.route.short_name);
    if (name === "JTC B") {
      busB.push(elem);
    } else if (name === "JTC C") {
      busC.push(elem);
    }
  })

  let busBData = {	
    'mOperator': "JTC",	
    'mServiceNo': "JTC B",	
    'mNextBusTiming': "-",	
    'mSubBusTiming': "-",	
  }
  busB.forEach((busB, index) => {
    if (index === 0) {
      busBData.mNextBusTiming = getExpectedArrivalTime(busB.forecast_seconds);
    } else if (index === 1) {
      busBData.mSubBusTiming = getExpectedArrivalTime(busB.forecast_seconds)
    }
  })

  finalBusData.push(busBData);
  
  let busCData = {	
    'mOperator': "JTC",	
    'mServiceNo': "JTC C",	
    'mNextBusTiming': "-",	
    'mSubBusTiming': "-",	
  }
  busC.forEach((busC,index) => {
    if (index === 0) {
      busCData.mNextBusTiming = getExpectedArrivalTime(busC.forecast_seconds);
    } else if (index === 1) {
      busCData.mSubBusTiming = getExpectedArrivalTime(busC.forecast_seconds)
    }
  })

  finalBusData.push(busCData);

  return finalBusData;
}



const parseApiEndPointv2 = (data) => {
  let finalBusData = [];
  const routes = data[0].routes;

  routes.forEach((bus, index) => {
    let busData = {	
      'mOperator': "JTC",	
      'mServiceNo': "",	
      'mNextBusTiming': "-",	
      'mSubBusTiming': "-",	
    }
    let name = getBusNameFromRoute(bus.routeName);
    busData.mServiceNo = name;
    busData.mNextBusTiming = getExpectedArrivalTime(bus.arrivalTime);
    busData.mSubBusTiming = getExpectedArrivalTime(bus.nextArrivalTime);
    finalBusData.push(busData);
  })

  return finalBusData;  
}
module.exports = router;
