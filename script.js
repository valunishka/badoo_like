// ==UserScript==
// @name         Badoo liker
// @version      0.1
// @description  sup
// @author       Valunishka
// @match        http://badoo.com/ru/search/
// @grant        none
// ==/UserScript==

window.badooLiker = (function() {

	var xhrDataSettings = {};

	var loadScript = function( src, callback ) {
		var s,r,t;
		r = false;
		s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = src;
		s.onload = s.onreadystatechange = function() {
			if ( !r && (!this.readyState || this.readyState === 'complete') ) {
				r = true;
				callback();
			}
		};
		t = document.getElementsByTagName('script')[0];
		t.parentNode.insertBefore( s, t );
	};

	var initialize = function() {
		loadScript('https://code.jquery.com/jquery-2.1.3.min.js', function() {
			xhrDataSettings[ 'ws' ] = 1;
			xhrDataSettings[ 'rt' ] = $('.js-ovl-open').data('ovlUrl').match(/rt=([\w\d]+)&/)[1];

			makeMagic();
		});

	};

	var makeMagic = function() {
		var linksToProfiles = $('.b-link.c_name').map(function( index, element) {
			return element.href;
		});

		linksToProfiles.each(function( index, url ) {
			loadProfilePage( url )
				.done(likeThisUser);
		});
	};

	var loadProfilePage = function( url ) {
		return $.ajax({
			type: 'GET',
			url: url
		});
	};

	var likeThisUser = function( userPage ) {
		var euri = userPage.match(/data-choice="yes"\sdata-url="\/hidden\?euri=(.{192})/);

		if ( !euri ) return;

		$.ajax({
			url: '/hidden',
			data: {
				euri: euri[1],
				ws: xhrDataSettings[ 'ws' ],
				ts: xhrDataSettings[ 'ts' ]
			}
		});
	};

	return {
		initialize: initialize
	};
})();
