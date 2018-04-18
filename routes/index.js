var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var moment = require('moment-timezone');
moment.tz.setDefault("Asia/Singapore");

router.get('/:busId', function (req, res, next) {
  getBusData(req.params.busId, function (data) {
    res.render('index', { data: data });
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

      let url = 'https://jtcbus.comfortdelgro.com.sg/EventService.svc/ShuttleService';
      let options = {
        url: url,
        method: 'POST',
        json: true,
        body: {
          busstopname: "Fusionopolis One"
        }
      }

      return rp(options);
     
    })
    .then(function (res2) {
      res2.ShuttleServiceResult.shuttles.forEach(elem => {
        let arrivalTime = elem.arrivalTime;
        arrivalTime = convertToHours(arrivalTime);
        
        let name = elem.name;
        
        let nextArrivalTime = elem.nextArrivalTime;
        nextArrivalTime = convertToHours(nextArrivalTime);
        // if (nextArrivalTime === '-') {
        //   nextArrivalTime = '-';
        // } else {
        //   nextArrivalTime = 'in ' + elem.nextArrivalTime + ' minutes';
        // }
        let service = 'JTC';

        let data = {
          'mOperator': service,
          'mServiceNo': name,
          'mNextBusTiming': arrivalTime,
          'mSubBusTiming': nextArrivalTime,
        }
        bus.push(data);
      })
      
      cb(bus);

    })
    .catch(function (err) {
      //err
    });
}

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

const convertToHours = (time) => {
  let m = moment().add(time,'m').format('hh:mm A');
  if (time === '-') {
    m = '-';
  }
  //console.log(m);
  return m;
}

module.exports = router;
