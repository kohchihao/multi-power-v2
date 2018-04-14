var express = require('express');
var router = express.Router();
var rp = require('request-promise');
//var moment = require('moment');
var moment = require('moment-timezone');
moment().tz("Asia/Singapore").format();
/* GET home page. */
router.get('/:busId', function(req, res, next) {
  
  getBusData(req.params.busId,function(data) {
    res.render('index', { data: data });
  })
  
});

getBusData = (busId,cb) => {
  
  let url = 'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode='+busId;
  let options = {
    url: url,
    headers: {
      'AccountKey': 'sc5MnGL2rNuA+V+XqKQnAQ==',
      'UniqueUserId' : '2726a158-4685-42ad-bc3c-e517a9eb89ec',
      'accept': 'application/json',
    }
  }

  rp(options)
    .then(function (data) {
      let bus = [];
      //console.log(data);
      let json = JSON.parse(data);
      json.Services.forEach(item => {
            
            var mServiceNo = item.ServiceNo 
            var mOperator = item.Operator

            var nextBus = item.NextBus 
            
            var mNextBusTiming = nextBus.EstimatedArrival.substring(11,16)
            mNextBusTiming =  convertToMins(mNextBusTiming);
        		var mNextBusFeature = nextBus.Feature 
            var mNextBusLoad = nextBus.Load 
            var mNextBusType ;
            if (nextBus.Type == 'SD') {
              mNextBusType = 'Single Deck';
            } else if (nextBus.Type == 'DD') {
              mNextBusType = 'Double Deck';
            } else {
              mNextBusType = 'Bendy';
            }

        		var subBus = item.NextBus2 
            var mSubBusTiming = subBus.EstimatedArrival.substring(11,16)
            mSubBusTiming = convertToMins(mSubBusTiming);
        		var mSubBusFeature = subBus.Feature 
        		var mSubBusLoad = subBus.Load 
            var mSubBusType ;
            if (nextBus.Type == 'SD') {
              mSubBusType = 'Single Deck';
            } else if (nextBus.Type == 'DD') {
              mSubBusType = 'Double Deck';
            } else {
              mSubBusType = 'Bendy';
            }


        		var subBus3 = item.NextBus3
            var mSubBus3Timing = subBus3.EstimatedArrival.substring(11,16)
            mSubBus3Timing = convertToMins(mSubBus3Timing);
        		var mSubBus3Feature = subBus3.Feature
            var mSubBus3Load = subBus3.Load
            var data = {
              'mServiceNo' : mServiceNo,
              'mOperator' : mOperator,
              'mNextBusTiming' : mNextBusTiming, 
              'mNextBusFeature' : mNextBusFeature,
              'mNextBusLoad' : mNextBusLoad,
              'mNextBusType' : mNextBusType,
              'mSubBusTiming': mSubBusTiming,
              'mSubBusFeature' : mSubBusFeature,
              'mSubBusLoad' : mSubBusLoad,
              'mSubBusType' : mSubBusType,
              'mSubBus3Timing' : mSubBus3Timing,
              'mSubBus3Feature' : mSubBus3Feature,
              'mSubBus3Load' : mSubBus3Load
  
            }
        bus.push(data)
      });
      console.log(bus)
      cb(bus);
        // Process html like you would with jQuery...
    })
    .catch(function (err) {
        // Crawling failed or Cheerio choked...
    });
}

convertToMins = (date) => {
  let m = moment(date, "HH:mm").fromNow();
  if (m.indexOf('in a few second') != -1) {
    m = 'Arriving';
  }
  return m;
}

module.exports = router;
