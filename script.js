// ==UserScript==
// @name         Badoo liker
// @namespace    http://your.homepage/
// @version      0.1
// @description  sup
// @author       Valunishka
// @match        http://badoo.com/ru/search/
// @grant        none
// ==/UserScript==

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

};

var makeMagic = function() {

};

loadScript('https://code.jquery.com/jquery-2.1.3.min.js', function() {
	console.log("----- Script loaded ------");
	initialize();
	makeMagic();
});
