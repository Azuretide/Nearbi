// Code for settings page

$.ajax({
	url: '/getuser',
	data: {},
	type: 'GET',
	success: function(data) {
        //Pre-fill form with what user set last time
        if (data.search.filter === "yes") {
        	$("input[type=radio][value=yes]").prop("checked",true);
            for (i=0;i<data.search.category.length;i++) {
                $("input[type=checkbox][value=" + data.search.category[i] + "]").prop("checked",true);
            }
        } else {
        	$("input[type=radio][value=no]").prop("checked",true);
        }
        
    },
    error: function(xhr, status, error) {
        console.log("Uh oh there was an error: " + error);
    }
});