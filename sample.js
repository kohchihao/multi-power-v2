var rp = require('request-promise');
let url = 'https://jtcbus.comfortdelgro.com.sg/EventService.svc/ShuttleService';
let options = {
  url: url,
  method : 'POST',
  json: true,
  body : {
      busstopname :"Fusionopolis One"
  }
}

rp(options)
.then(function (data) {
  console.log("THIS IS THE DATA"+JSON.stringify(data));
  //cb(bus);
})