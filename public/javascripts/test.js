$(document).ready(function() { 
  setInterval(loadnewdata, 60000);
});
  
function loadnewdata() {
	try {
    //location.reload();
    $.ajax({
      type: 'GET',
      url: '/18051',						
      success: function(data) {
          console.log('success');
          $("#desc").html(data);
      }
    })
	} catch(e) {
		alert(e);
	}
}	