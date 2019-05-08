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

module.exports = router;
