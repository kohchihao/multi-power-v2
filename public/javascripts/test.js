$(document).ready(function() { 
  setInterval(loadnewdata, 60000);
});
  
function loadnewdata() {
	try {
      console.log("data111")
      location.reload();
			//$("#loadnewdataDiv").load("./loadnewdata.php?bcode=71131");
	} catch(e) {
		alert(e);
	}
}	