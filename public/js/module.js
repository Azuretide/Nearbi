//Code for elements not tied to API's
// console.log(process.env.EVENTBRITE_API);

$(document).ready(function() {
	$(".search-submit").on('click', function() {
		console.log("query submitted!");
		console.log(moment());
		$(".searchBox").val("");
	});

});