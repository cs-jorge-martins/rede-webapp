var j = $.noConflict();

// formulario de login
function redefinirSenha (){
	j('#loginForm').hide();
	j('#redefinirSenha').show();
}
function retornarLogin() {
	j('#loginForm').show();
	j('#redefinirSenha').hide();
}

// consulta de vendas
function sidebar(){
	j('#menuLateral').toggleClass('ativo');
	j('body').css({'overflow':'hidden'});
}
function closeAside() {
	j('#menuLateral').removeClass('ativo');
	j('body').css({'overflow':'auto'});
}
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
j(document).ready(function(){
	//filtro avançado
	j('.advancedFilter input[type="submit"]').click(function(){
		j(this).parent('.advancedFilter').hide();
	});
	// abas
	j("article").hide();
	j("article:first").show();

	j("#conciliacao nav ul li, #detalhes nav ul li").click(function() {
		var activeTab = j(this).find("a").attr("href");
		j("#conciliacao nav ul li, #detalhes nav ul li").removeClass("active");
		j(this).addClass("active");
		j("article").hide();
		j(activeTab).fadeIn();
	});
});

// menu dropdown
j('document').ready(function(j){
	j('#menuTour .relatorioItem').on('mouseover', function(){
		j(this).find('.subnav').show();
	});
	j('#menuTour .relatorioItem').on('mouseleave', function(){
		j(this).find('.subnav').hide();
	});
});

// menu semi-fixo
j('document').ready(function(j){

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
		// nav.addClass("fixed");
	});

});
