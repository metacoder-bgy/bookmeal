var card_row_count = 0,
	request_url = 'http://69.163.34.129/cgi-bin/bookmeal/request.cgi',
	cards = [],
	book_count = 0,
	card_table = '#card_table',
	notice_table = {
		not_login: {
			type: 'general_notice',
			message: '<p>Login is suggested.</p>',
			style: 'common',
			delay: 3000
		},
		cards_saved: {
			type: 'general_notice',
			message: '<p>Cards info saved!</p>',
			style: 'common',
			delay: 3000
		},
		unknown_error: {
			type: 'general_notice',
			message: '<p>Unknown Error Occured!</p>',
			style: 'error',
			delay: 3000
		},
		book_done: {
			type: 'individual_notice',
			message: '<p>Book meal completed!</p>',
			style: 'common',
			delay: 3000
		},
		no_password: {
			type: 'individual_notice',
			message: '<p>Please enter a password! OR login with the forum account.</p>',
			style: 'error',
			delay: 3000
		},
		no_such_forum_uid: {
			type: 'individual_notice',
			message: '<p>No such forum ID!</p>',
			style: 'error',
			delay: 3000
		},
		no_such_card: {
			type: 'individual_notice',
			message: '<p>No such card!</p>',
			style: 'error',
			delay: 3000
		},
		wrong_card_password: {
			type: 'individual_notice',
			message: '<p>Wrong password!</p>',
			style: 'error',
			delay: 3000
		},
		card_already_exist: {
			type: 'individual_notice',
			message: '<p>The card is already exist!</p>',
			style: 'error',
			delay: 3000
		},
		error: {
			type: 'individual_notice',
			message: '<p>Some problems occured on server!</p>',
			style: 'error',
			delay: 0
		},
		parsererror: {
			type: 'individual_notice',
			message: '<p>The data sent by server could not be parsed!</p>',
			style: 'problem',
			delay: 0
		},
		client_error: {
			type: 'individual_notice',
			message: '<p>Some problems occured on client!</p>',
			style: 'problem',
			delay: 0
		}
	};

// Start up ultility
$(document)
	.ready(function () {
	if(forum_uid > 0) {
		$.getJSON(request_url, {
			forum_uid: forum_uid,
			action: 'lscard'
		}, function (JSON) {
			if(JSON.status == 'ok') {
				$.each(JSON.card_list, function (key, val) {
					add_row(val);
				});
				add_row();
				return;
			}
			notice_handler(JSON.error_message);
		})
		.error(function (jqXHR, textStatus, errorThrown) {
			add_row();
			console.info(textStatus);
			notice_handler(textStatus);
		});
	} else {
		notice_handler('not_login');
		add_row();
	}
	
	$('.btn_help')
		.click(function () {
		if($(this)
			.html() == 'Show Help') {
			$('#ctrl_panel_help')
				.show('slow');
			$(this)
				.html('Hide Help');
		} else {
			$('#ctrl_panel_help')
				.hide('slow');
			$(this)
				.html('Show Help');
		}
	});

	$('.btn_remove_card')
		.live('click', function () {
		if(card_row_count <= 1) {
			return;
		} else {
			card_row_count--;
		}

		$(this)
			.closest('tr')
			.find('td > div')
			.slideUp(300, 'easeOutExpo', function () {
			$(this)
				.closest('tr')
				.remove();
			reindex();
		});
	});

	$('#card_table input')
		.live('focus', function () {
		if($(this)
			.closest('tr')
			.find('label.card_id')
			.html() == card_row_count) add_row();
	});

	$('.btn_save')
		.click(function () {
		save_cards();
	});

	$('.btn_book')
		.click(function () {
		book_meal_start();
	});

	$('input')
		.live('change', function () {
		update_cards();
	});

	$('div.notice')
		.live('click', function () {
		$(this)
			.hide('fast', function () {
			$(this)
				.closest('tr')
				.remove();
		});
	});

});

// Match with the notice table and handel the notice messages
function notice_handler(notice_key, target) {
	notice_key = (typeof notice_key == 'undefined') ? 'unknown_error' : notice_key;
	target = (typeof target == 'undefined') ? '' : target;
	if(target != '') {
		add_card_notice(target, notice_table[notice_key].message, notice_table[notice_key].style, notice_table[notice_key].delay);
	} else {
		add_general_notice(notice_table[notice_key].message, notice_table[notice_key].style, notice_table[notice_key].delay);
	}
}

// Add a single row to the bottom
function add_row(card_no) {
	card_no = (typeof card_no == 'undefined') ? '' : card_no;
	var table = $(card_table);
	var tr = $('<tr />', {
		class: 'card_info'
	});
	tr.append('<td><label class="card_id"></label></td>');
	tr.append('<td><input type="text" name="card_no" class="card_no" placeholder="Card Number" value="' + card_no + '"/></td>');
	tr.append('<td><input type="password" name="card_psw" class="card_psw" placeholder="Password"/></td>');
	tr.append('<td><a href="javascript:void(0)" name="card_btn" class="btn_remove_card">Delete</a></td>');

	table.append(tr);
	card_row_count++;
	update_cards();
	reindex();

	tr.find('td')
		.wrapInner('<div style="display: block;" />')
		.parent()
		.find('td > div')
		.hide()
		.slideDown(300, 'easeOutExpo', function () {
		reindex();
	});
}

// Add notic below the card row as independent notice
function add_card_notice(card_no, notice_content, notice_style, hide_delay) {
	hide_delay = (typeof hide_delay == 'undefined') ? 0 : hide_delay;
	var table = $(card_table);

	var div_notice = $('<div />', {
		title: 'Click to close',
		name: 'card_notice_' + card_no,
		'class': 'individual notice ' + notice_style
	})
		.append(notice_content)
		.hide();

	var tr_notice = $('<tr />')
		.append($('<td />'))
		.append($('<td />', {
		colspan: '2'
	})
		.append(
	div_notice));

	card_e(card_no, 'tr')
		.after(tr_notice);

	update_input_style(card_no, notice_style);

	div_notice.show(300, 'easeOutExpo', function () {
		if(hide_delay) {
			$(this)
				.delay(hide_delay)
				.hide('fast', function () {
				$(this)
					.closest('tr')
					.remove();
			});
		}
	});
}

// Add notice to the top of the page as general notice
function add_general_notice(notice_content, notice_style, hide_delay) {
	hide_delay = (typeof hide_delay == 'undefined') ? 0 : hide_delay;
	var target = $('#ctrl_panel_help');
	var div_notice = $('<div />', {
		name: 'general_notice',
		'class': 'general notice ' + notice_style
	});
	div_notice.append(notice_content)
		.hide();

	target.after(div_notice);

	div_notice.show(300, 'easeOutExpo', function () {
		if(hide_delay) {
			$(this)
				.delay(hide_delay)
				.hide('fast', function () {
				$(this)
					.remove();
			});
		}
	});
}

// Change input box styles by card_no
function update_input_style(card_no, new_style) {
	new_style = (typeof new_style == 'undefined') ? '' : new_style;
	var table = $(card_table);
	card_e(card_no, 'tr')
		.attr('class', new_style);
}

// Automatically index the row labels
function reindex() {
	var table = $(card_table);
	table.find('label.card_id')
		.each(function (i, e) {
		$(e)
			.html(i + 1);
		$(e)
			.closest('tr')
			.attr('name', 'card_row_' + (i + 1));
	});
}

// Update the values stored in the "cards" variable
function update_cards() {
	var table = $(card_table);
	cards = [];
	table.find('label.card_id')
		.each(function (i, e) {
		var card_no = $(e)
			.closest('tr')
			.find('input.card_no')
			.val(),
			card_psw = $(e)
				.closest('tr')
				.find('input.card_psw')
				.val();
		if(card_no != '') cards.push({
			index: i,
			card_no: card_no,
			card_psw: card_psw
		});
	});
}

// Save the cards
function save_cards() {
	update_cards();
	var post_data = {}
	
	post_data.forum_uid = forum_uid;
	post_data.action = 'savecard';
	post_data.card_count = cards.length;
	for(var i = 1; i <= cards.length; i++){
		post_data['card' + i + '_no'] = cards[i-1].card_no;
		post_data['card' + i + '_psw'] = cards[i-1].card_psw;
	}
	$.getJSON(request_url,
		post_data,
		function (JSON) {
		if(JSON.status == 'ok') {
			notice_handler("cards_saved");
		} else {
			notice_handler(JSON.error_message);
		}
	})
		.error(function (jqXHR, textStatus, errorThrown) {
		notice_handler(textStatus);
	});
}

// Start to book meal by all the cards
function book_meal_start() {
	update_cards();
	for(i in cards) {
		var card_no = cards[i].card_no,
			card_psw = cards[i].card_psw,
			index = cards[i].index,
			post_data = {};

		update_input_style(card_no)

		if(forum_uid < 1) {
			post_data = {
				action: 'bookmeal_bytmp',
				card_no: card_no,
				card_psw: card_psw
			}
		} else {
			post_data = {
				forum_uid: forum_uid,
				action: 'bookmeal_bydb',
				card_no: card_no,
				card_psw: card_psw
			}
		}

		if((forum_uid < 1) && (typeof card_psw == 'undefined' && card_psw != '' && card_psw != null)) {
			notice_handler('no_password', card_no);
		} else {
			card_e(card_no, 'btn')
				.html('<img height=20 width=20 src="img/waiting.gif"/>')
				.attr('class', 'btn_none');

			$.getJSON(request_url, post_data, (function (this_card_no) {
				return function (JSON) {
					if(JSON.status == 'ok') {
						notice_handler('book_done', this_card_no);
					} else {
						notice_handler(JSON.error_message, this_card_no);
					}
				};
			}(card_no))
			)
				.error((function (this_card_no) {
				return function (jqXHR, textStatus, errorThrown) {
					notice_handler(textStatus, this_card_no);
				};
			}(card_no)))
				.complete((function (this_card_no) {
				return function (jqXHR, textStatus, errorThrown) {
					card_e(this_card_no, 'btn')
						.html('Delete')
						.attr('class', 'btn_remove_card');
				};
			}(card_no)));
		}
	}
}

// Return element assosiate with card_no:
// default - card number input box
// tr - the table row containing the card info
// index - the index label of the row
// psw - the input element of the card password
// btn - the control button of the card row
function card_e(card_no, target) {
	var table = $(card_table);
	target = (typeof target == 'undefined') ? '' : target;
	e_card_no_input = table.find('input[value="' + card_no + '"]:first');
	switch(target) {
	case 'tr':
		return e_card_no_input.closest('tr');
		break;
	case 'index':
		return e_card_no_input.closest('tr')
			.find('label.card_id:first');
		break;
	case 'psw':
		return e_card_no_input.closest('tr')
			.find('input.card_psw:first');
		break;
	case 'btn':
		return e_card_no_input.closest('tr')
			.find('a[name="card_btn"]:first');
		break;
	}
	return e_card_no_input;
}