$(document).ready(function() { 
  setInterval(loadnewdata, 60000);
});
  
function loadnewdata() {
	try {
      
      //location.reload();
			$.ajax({
        type: 'GET',
        //contentType: 'application/json',
        url: 'http://localhost:3000/46479',						
        success: function(data) {
            console.log('success');
            console.log(data);
            //console.log(JSON.stringify(data));
            $("#desc").html(data);
        }
      })
	} catch(e) {
		alert(e);
	}
}	