//Code for main webpage
$(document).ready(function() {
	$(".search-submit").on('click', function() {
		console.log("query submitted!");
		console.log(moment());
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