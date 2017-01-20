//Code for main webpage
$(document).ready(function() {
	$(".search-submit").on('click', function() {
		console.log("query submitted!");
		$(".searchBox").val("");
	});

	// $(".add-submit").on('click', function() {
	// 	$.ajax({
	// 		url: '/adduser',
	// 		type: 'POST',
	// 		data: {
	// 			username: $(".username-add").val(),
	// 			userfruit: $(".userfruit-add").val(),
	// 		},
	// 		success: function (data) {
	// 			$(".add-output").text(data);
	// 		}
	// 	});
	// });
});