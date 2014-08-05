// http://blogs.agilefaqs.com/2013/07/17/fetching-cross-domain-xml-in-javascript-simple-solution/

/*ajaxlib = function (url) {

	this.url = url;

	this.init = function () {
		this.fetchJSON(this.url);
	};

	this.fetchJSON = function (url) {
		var root = 'https://query.yahooapis.com/v1/public/yql?q=';
		var yql = 'select * from xml where url="' + url + '"';
		var proxy_url = root + encodeURIComponent(yql) + '&format=json&diagnostics=false&callback=this.display';
		document.getElementsByTagName('body')[0].appendChild(this.jsTag(proxy_url));
	};

	this.jsTag = function (url) {
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', url);
		return script;
	};

	this.display = function (results) {
		results = results.error ? "Internal Server Error!" : results.query.results;
		// do the necessary stuff
		document.getElementById('demo').innerHTML = "Result = " + results;
		console.log(results);
		return results;
	};

	this.init();
};*/

/*function ajaxlib (url) {

	this.display = function (results) {
		results = results.error ? "Internal Server Error!" : results.query.results;
		// do the necessary stuff
		document.getElementById('demo').innerHTML = "Result = " + results;
		console.log(results.error ? "Internal Server Error!" : results.query.results);
		return results.error ? "Internal Server Error!" : results.query.results;
	};

	this.jsTag = function (url) {
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', url);
		return script;
	};

	var root = 'https://query.yahooapis.com/v1/public/yql?q=';
	var yql = 'select * from xml where url="' + url + '"';
	var proxy_url = root + encodeURIComponent(yql) + '&format=json&diagnostics=false&callback=this.display';
	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', url);
	document.getElementsByTagName('body')[0].appendChild(this.jsTag(proxy_url));

}

// YQL serves JSONP (with a callback) so all we have to do
// is create a script element with the right 'src':
function YQLQuery(query, callback) {
    this.query = query;
    this.callback = callback || function(){};
    this.fetch = function() {

        if (!this.query || !this.callback) {
            throw new Error('YQLQuery.fetch(): Parameters may be undefined');
        }

        var scriptEl = document.createElement('script'),
            uid = 'yql' + new Date(),
            encodedQuery = encodeURIComponent(this.query.toLowerCase()),
            instance = this;

        YQLQuery[uid] = function(json) {
            instance.callback(json);
            delete YQLQuery[uid];
            document.body.removeChild(scriptEl);
        };

        scriptEl.src = 'http://query.yahooapis.com/v1/public/yql?q=' +
        						encodedQuery + '&format=json&callback=YQLQuery.' + uid;
        document.body.appendChild(scriptEl);

    };
}*/

function about () {
	/*navigator.notification.alert(
		'You are the winner!',  // message
		function (argument) {
			// body...
		},         // callback
		'About',            // title
		'Done'                  // buttonName
	);*/
	alert('developed by davigmacode. source aplikasi bisa dilihat di http://github.com/davigmacode/prakiraan-cuaca-mobile');
}

function exitFromApp() {
	if (confirm("Keluar dari aplikasi?")) {
		navigator.app.exitApp();
	}
}

var myScroll;

function YQL(url, callback) {
	var root = 'https://query.yahooapis.com/v1/public/yql?q=';
	var query = 'select * from xml where url="' + url + '"';
	var encoded = root + encodeURIComponent(query) + '&format=json&diagnostics=false';
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', encoded, true);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if(xmlhttp.status == 200) {
				callback(JSON.parse(xmlhttp.responseText));
			}
		}
	};
	xmlhttp.send(null);
}

function refresh () {
	$('#spinner').show();
	YQL('http://data.bmkg.go.id/cuaca_indo_1.xml', function (json) {
		//console.log(json.error ? "Internal Server Error!" : json.query.results);
		if (json.error != 'undefined')
		{
			var isi = '';
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

			$('#scroller ul').html(isi);
			myScroll = new IScroll('#wrapper');
		}
		$('#spinner').hide();
	});
}

// Wait for device API libraries to load
/*document.addEventListener("deviceready", function (argument) {
	refresh();
}, false);*/

if (window.cordova) {
	document.addEventListener("deviceready", refresh, false);
} else {
	window.onload = refresh; //this is the browser
}