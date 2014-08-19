function about () {
	alert('developed by davigmacode. source aplikasi bisa dilihat di http://github.com/davigmacode/prakiraan-cuaca-mobile');
}

function exitFromApp() {
	if (confirm("Keluar dari aplikasi?")) {
		navigator.app.exitApp();
	}
}

var myScroll;

function yql(url) {
	return 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + url + '"') + '&format=json&diagnostics=false';
}

function refresh () {
	$('#wrapper').html('');
	$('#error').hide();
	$('#spinner').show();
	// fetch data untuk kalender hijriyah
	$.ajax({
		type: 'GET',
		url: yql('http://data.bmkg.go.id/cuaca_indo_1.xml'),
		// type of data we are expecting in return:
		dataType: 'json',
		timeout: 3000,
		success: function (data)
		{
			//console.log(data);
			if (typeof data.query.results !== 'undefined' && data.query.results !== null)
			{
				//console.log(data.query.results.Cuaca.Isi.Row);
				data.query.results.Cuaca.Isi.Row.sort(function (a, b) {
					if (a.Kota > b.Kota)
						return 1;
					if (a.Kota < b.Kota)
						return -1;
					// a must be equal to b
					return 0;
				});
				// cache data ajax
				window.localStorage.setItem('yql', JSON.stringify(data));
				// tampilkan data di layar
				display(data);
			}
			else
				$('#error').show();
		},
		error: function () {
			//console.log('fetch error');
			$('#error').show();
		},
		complete: function () {
			$('#spinner').hide();
		}
	});
}

function display (json) {
	//var localData = JSON.parse(window.localStorage.getItem('yql'));
	if (typeof json.query.results !== 'undefined' && json.query.results !== null)
	{
		var isi = '<div id="scroller"><ul>';
		json = json.query.results.Cuaca;

		$('#date').html('Tanggal '+json.Tanggal.Mulai+' - '+json.Tanggal.Sampai);

		var arr = json.Isi.Row;
		for (var i = 0, len = arr.length; i < len; i++) {
			isi += '<li>'+
				'<i class="icon-'+arr[i].Cuaca.replace(/\s+/g, '-').toLowerCase()+'"></i>'+
				'<div class="details">'+
					'<big>'+arr[i].Kota+'</big>'+
					'<small>'+arr[i].Cuaca+'</small>'+
					'<small>Kelembapan: '+arr[i].KelembapanMin+' - '+arr[i].KelembapanMax+' %</small>'+
					'<small>Suhu: '+arr[i].SuhuMin+' - '+arr[i].SuhuMax+' &deg;C</small>'+
				'<div class="clearfix"></div>'+
				'</div>'+
			'</li>';
		}
		isi += '</ul></div>';

		$('#wrapper').html(isi);
		myScroll = new IScroll('#wrapper');
	}
}

function fetch () {
	var localdata = JSON.parse(window.localStorage.getItem('yql'));

	if (typeof localdata !== 'undefined' && localdata !== null)
	{
		var cacheDate = new Date(localdata.query.created).toDateString();
		var todayDate = new Date().toDateString();
		/*console.log(cacheDate);
		console.log(todayDate);
		console.log(cacheDate === todayDate);*/

		if (cacheDate === todayDate) {
			display(localdata);
		} else {
			refresh();
		}
	}
	else
	{
		refresh();
	}
}

if (window.cordova) {
	document.addEventListener("deviceready", fetch, false);
} else {
	window.onload = fetch; //this is the browser
}