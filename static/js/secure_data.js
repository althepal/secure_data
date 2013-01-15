var secret_code_len = 15;
var last_secret_code = [];
var pass_confirmed = false;
text_changed = false;

function loadDataList()
{
	var dataList = "";
	for (t in stored_data)
	{
		dataList += "<div class='stored_row'>";
		var d = new Date(0);
		d.setUTCSeconds(stored_data[t].mod)
			var ford = $.format.date(d, "MMM d, yyyy HH:mm");
		dataList += "<div class='listTitle'><b>" + esc(t) + '</b><br>' + ford + "</div> "
			dataList += "<input type=button value='View' onclick='loadTitle(\"view\", \""+(t)+"\")'> "
			dataList += "<input type=button value='Edit' onclick='loadTitle(\"edit\", \""+(t)+"\")'> "
			dataList += "<input type=button value='Delete' onclick='loadTitle(\"del\", \""+(t)+"\")'><br>";
		dataList += "<div style='clear:both'></div></div>"
	}
	if (dataList == '')
	{
		dataList = '-- none --';
	}
	$('#theData').html(dataList);
}

function loadTitle(action, title)
{
	if (action == 'edit' && text_changed)
	{
		confirmClear(title)
			return;
	}
	var butt_name = action == 'del' ? "Submit" : "Decrypt";
	$.msgBox({
		type: "prompt",
		title: "Enter password for <b>" + esc(title) +"</b>:",
		inputs: [
	{ header: "Pass", type: "password", name: "Pass"}
	],
		buttons: [
	{ value: butt_name }, {value: "Cancel"}
	],
		success: function(result, values){
			if (result == butt_name)
	{
		var enc = stored_data[title].data;
		var pass = values[0].value;
		try
	{
		var plain_with_code = sjcl.decrypt(pass, enc);
		var len = plain_with_code.length;
		var plain = plain_with_code.substring(0, len - secret_code_len);
		var secret_code = plain_with_code.substring(len - secret_code_len);

		if (action == 'view')
			viewPlain(title, plain);
		else if (action == 'edit')
		{
			last_secret_code = [title, secret_code];
			loadPlain(title, plain);
		}
		else if (action == 'del')
		{
			sendDelTitle(title, secret_code);
		}
	}
	catch(e)
	{
		errorBar("bad password");
	}

	}
		},
	});
	$('input[name="Pass"]').focus().keypress(function(e){
		code = e.keyCode ? e.keyCode : e.which;
		if (code == 13) {
			$('input[name="'+butt_name+'"]').click();
		}
	});

}

function esc(dirty)
{
	return dirty.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function viewPlain(title, msg)
{
	var html = "<h1>" + esc(title) + "</h1>" + esc(msg);
	$('#view_popup').html(html).bPopup();
}

function loadPlain(title, msg)
{
	$('#plain_title').val(title); 
	$('#plain_text').val(msg);
	$('#encrypt_pass').val("");
	$('#overwrite').prop('checked', true);
	text_changed = false;
}

function saveComplete(data)
{
	//		console.log(data)
	var code = data.code;
	if (code == 'OK')
	{
		if (!stored_data[data.title])
			stored_data[data.title] = {};
		stored_data[data.title].data = data.data;
		stored_data[data.title].mod = new Date().valueOf() / 1000;
		loadDataList();
		clearPlain(true);
		//			infoBox("Save complete");
		alertBar("Save Complete");

	}
	else
	{
		var reason = data.reason;
		errorBar("Save Failed: " + reason);

	}
}
var cnt = 0;
var mb;
function errorBar(msg)
{
	alertBar(msg, 'error');
}
function alertBar(msg, type)
{
	var addClass = type == 'error' ? 'alertError' : 'alertInfo';
	var html = "<div class='round alertMsg "+addClass+"'>" + msg + "</div>";
	var msg_bar = $(html);
	$('#alertBar').prepend(msg_bar);
	msg_bar.slideDown("slow", "swing");
	$(msg_bar).click(function(){
		msg_bar.slideUp("slow", "swing", function(){
			$(this).remove();
		});
	});
	window.setTimeout(function(){msg_bar.click();}, 2000);
}
function promptPass(match_pass)
{
	var promptTitle = "Confirm password";
	var goLabel = "Confirm";
	$.msgBox({
		type: "prompt",
		title: promptTitle,
		inputs: [
	{ header: "Pass", type: "password", name: "Pass"}
	],
		buttons: [
	{ value: goLabel }, {value: "Cancel"}
	],
		success: function(result, values){
			if (result == goLabel)
	{
		var pass = values[0].value;
		if (pass == match_pass)
		saveData(true);
		else
		errorBar("Passords do not match");
	}
		},
	});
	$('input[name="Pass"]').focus().keypress(function(e){
		code = e.keyCode ? e.keyCode : e.which;
		if (code == 13) {
			$('input[name='+goLabel+']').click();
		}
	});
}

function deleteComplete(data)
{
	if (data.code == 'OK')
	{
		title = data.title;
		delete stored_data[title];
		loadDataList();
	}
	else
	{
		var reason = data.reason;
		errorBar("DELETE FAILED: " + reason);
	}
}
function sendDelTitle(title, secret_code)
{
	$.ajax({
		type: "POST",
	url: "delByTitle",
	data: {title: title, secret_code: secret_code },
	}).done(function(data){
		deleteComplete(data);
		//		console.log(data);
	}).fail(function(faildata){
		var msg = "Sever error: " + failData.status + " " + failData.statusText;
		errorBar(msg);
	})
}
var defaults = { v:1, iter:1000, ks:256, ts:64, mode:"ccm", adata:"", cipher:"aes" };
function saveData(confirmed)
{
	var plain = $('#plain_text').val();
	var pass = $('#encrypt_pass').val();
	var title = $('#plain_title').val();

	if (title.length > max_title_len)
	{
		errorBar("Max title length is " + max_title_len + ". Your's is " + title.length);
		return;
	}


	if (!title)
	{
		errorBar('no title');
		return;
	}

	if (/['"]/.test(title))
	{
		errorBar('illegal character in title');
		return;
	}

	if (!plain)
	{
		errorBar('no data');
		return;
	}
	if (pass.length < 6)
	{
		errorBar("Invalid pass");
		return;
	}

	if (!confirmed)
	{
		promptPass(pass);
		return;
	}
	var secret_code = makeid();
	var plain_with_code = plain + secret_code;

	var params = jQuery.extend(true, {}, defaults);
	params.adata = title;

	rp = {};
	var enc = sjcl.encrypt(pass, plain_with_code, params, rp);

	var overwrite = $('#overwrite').is(":checked") ? 1 : 0;
	if (!enc)
	{
		errorBar("No data");
		return;
	}
	if (!title)
	{
		errorBar("Missing title");
		return;
	}
	var old_secret = "";
	if (overwrite && (last_secret_code[0] == title))
		old_secret = last_secret_code[1]

			$.ajax({
				type: "POST",
				url: 'saveSecure',
				data: { title: title, data: enc, overwrite: overwrite, secret_code: secret_code, old_secret: old_secret },
			}).done(function(data){
				saveComplete(data);
			}).fail(function(failData){
				var msg = "Server error: " + failData.status + " " + failData.statusText;
				errorBox(msg);
				errorBar(msg);
				console.log("FAIL: ", failData)
			});

}

function confirmClear(title)
{
	$.msgBox({
		type: "confirm",
	title: "Unsaved changes exist.",
	content: "Discard changes?",
	buttons: [{value: "Discard"}, { value: "Cancel"}],
	success: function (result) {
		if (result == "Discard")
	{
		clearPlain(true)
		if (title)
	{
		loadTitle("edit", title);
	}
	}
	}
	});
}
function clearPlain(force)
{
	if (!force && text_changed)
	{
		confirmClear();
		return;
	}
	$('#plain_text').val("");
	$('#encrypt_pass').val("");	
	$('#plain_title').val("");	
	$('#overwrite').prop('checked', false);
	last_secret_code = [];
	text_changed = false;
}
function infoBox(msg)
{   
	$.msgBox({
		title: "Message",
	content: msg,
	type: "info",
	opacity: 0.5,
	showButtons: false,
	});
}
function errorBox(msg)
{
	$.msgBox({
		title: "Ooops",
	content: msg,
	type: "error",
	opacity: 0.5,
	showButtons: false,
	});
}
function makeid()
{
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < secret_code_len; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

