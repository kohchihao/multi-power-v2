$(document).ready(function() { 
  setInterval(loadnewdata, 5000);
});
  
function loadnewdata() {
	try {
    //location.reload();
    $.ajax({
      type: 'GET',
      url: '/api/46479',						
      success: function(data) {
          console.log('success');
          $("#desc").html(data);
      }
    })
	} catch(e) {
		alert(e);
	}
}	