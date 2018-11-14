$(document).ready(function() { 
  var busId = window.location.pathname;
  busId = busId.substring(1); //to remove / from /46479
  setInterval( function() { 
    loadnewdata(busId); 
  }, 5000 );
});

//to refresh bus data.
function loadnewdata(busId) {
	try {
    console.log(busId);
    $.ajax({
      type: 'GET',
      url: '/api/' + busId,						
      success: function(data) {
          console.log('success');
          $("#table").html(data);
      }
    })
	} catch(e) {
		alert(e);
	}
}	