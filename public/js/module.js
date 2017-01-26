//Code for elements not tied to API's
// console.log(process.env.EVENTBRITE_API);

// if (typeof(Storage) !== "undefined") {
//     console.log("session storage available!");
// } else {
//     console.log("Sorry! No Web Storage support");
// }

$(document).ready(function() {
	$(".search-submit").on('click', function() {
		console.log("query submitted!");
		console.log(moment());
		$(".searchBox").val("");
	});

});