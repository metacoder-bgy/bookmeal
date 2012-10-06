

QUERY_LOGIN_URL = 'http://bgy.gd.cn/mis/info/list.asp';

$(document).ready(function(){
    $("#submit").click(function(){
	$.ajax( {
	    url: QUERY_LOGIN_URL,
	    type: 'post',
	    data: {
		tbarno: $("#card_no").val(),
		passwd: $("#passwd").val(),
		fd: '002',
		B1: '%C8%B7%B6%A8'
	    },
	    crossDomain: true,
	    dataType:'jsonp',
	    headers: {
		'Origin': 'http://bgy.gd.cn'
	    },
	    success: function (data) {
		console.info(data);
	    }
	});
    });
});