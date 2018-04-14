$(document).ready(function() { 
  setInterval(loadnewdata, 60000);
});

// $(document).ready(function() {
//   $.ajax({
//       url: 'http://192.168.1.103:8124/',
//       dataType: "jsonp",
//       jsonpCallback: "_testcb",
//       cache: false,
//       timeout: 5000,
//       success: function(data) {
//           $("#test").append(data);
//       },
//       error: function(jqXHR, textStatus, errorThrown) {
//           alert('error ' + textStatus + " " + errorThrown);
//       }
//   });
// });
  
function loadnewdata() {
	try {
      console.log("data111")
      location.reload();
			//$("#loadnewdataDiv").load("./loadnewdata.php?bcode=71131");
	} catch(e) {
		alert(e);
	}
}	