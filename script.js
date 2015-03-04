// ==UserScript==
// @name         Badoo liker
// @version      0.1
// @description  sup
// @author       Valunishka
// @match        http://badoo.com/*
// @grant        none
// ==/UserScript==

window.badooLiker = (function() {

	var xhrDataSettings = {},
		virtualDom,
		isInitialized = false,
		url;

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

	var init = function( callback ) {
		loadScript('https://code.jquery.com/jquery-2.1.3.min.js', function() {
			xhrDataSettings[ 'ws' ] = 1;
			xhrDataSettings[ 'rt' ] = $('.js-ovl-open').data('ovlUrl').match(/rt=([\w\d]+)&/)[1];

			isInitialized = true;

			if ( typeof(callback) === 'function' ) callback();

			// makeMagic();
		});

	};

	var makeMagic = function() {

		if ( !isInitialized ) return init(makeMagic);

		getUsersFromUrl('http://badoo.com/ru/search/').then(function( links ) {
			$(links).each(function(index, link){
				url = link.href;
				loadProfilePage( url ).done(likeThisUser);
			});
		});
	};

	var getUsersFromUrl = function( url ) {
		return new Promise (function( resolve, reject ) {
			$.ajax({	type: 'GET', url: url	})
				.done(function( payload ) {
					var virtualDom = createVirtualDom( payload ).querySelectorAll( '[rel="profile-view"]' );
					resolve( virtualDom );
				});
		});
	};

	var loadProfilePage = function( url ) {
		return $.ajax({
			type: 'GET',
			url: url
		});
	};

	var likeThisUser = function( userPage ) {
		var euri = createVirtualDom( userPage ).querySelector('[data-choice="yes"');

		if ( !euri ) return null;

		euri = euri.dataset[ 'url' ].match(/euri=(.{192})/)[1];

		$.ajax({
			url: '/hidden',
			data: {
				euri: euri,
				ws: xhrDataSettings[ 'ws' ],
				rt: xhrDataSettings[ 'rt' ]
			}
		});
	};

	var createVirtualDom = function( domString ) {
		virtualDom = document.createElement( 'div' );
		virtualDom.innerHTML = domString;
		return virtualDom;
	};

	return {
		init: init,
		getUsersFromUrl: getUsersFromUrl,
		makeMagic: makeMagic
	};
})();
