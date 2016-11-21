var j = $.noConflict();

// exibicao campo filtros avançados
function toggle(){
	j('.hiddenContent').slideToggle();
	j('#advancedButton').toggleClass('active');
	j( ".botaoVerMais" ).toggleClass('minimizeButton');
	j('#filtrar').css({'margin':'0 auto'});
}
function toggleReport(){
	j('.hiddenContentReport').slideToggle();
	j('.advancedButton').toggleClass('active');
	j('#filtrar').css({'margin':'0 auto'});
}

// menu semi-fixo
function fixedMenu() {
	j(window).scroll(function () {
		var nav = j('nav');

		if(nav.size()){
			var ext = j('body > div:first-child');
			var body = j('body');

			var isLogin = window.location.hash.match('/login');

			if(!isLogin){
				if (j(this).scrollTop() >= 35) {
					nav.addClass("fixed");
					body.addClass("fixed-loader");
					ext.addClass("extended");

				} else {
					nav.removeClass("fixed");
					body.removeClass("fixed-loader");
					ext.removeClass("extended");
				}
			}
		}
	});
}

j('document').ready(function(j){
	fixedMenu();
});
