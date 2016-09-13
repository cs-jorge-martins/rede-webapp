//Resumo Conciliacao Tour
var tourResumoConciliacaoAnalitico;
var userService;
var checkboxChecked = false;
var user;

function startResumoConciliacaoAnaliticoTour(){
	// Instance the tourIniciar
	tourResumoConciliacaoAnalitico = new Tour(
	{
		  steps: [
		    {
		        element: "#botaoConciliacaoDiaTour",
		        placement: "top",
		        title: "Conciliação do dia<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Ok, então você quer ver os detalhes de um dia. " +
		        		"<br/><br/>Você percebeu que ao clicar em um dia específico, você entre no submenu de Conciliação do dia? Então vamos explicar exatamente o que você pode fazer nessa tela."+
		        		"<br/><br/><input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
		        template: "<div class='popover tour'>"
				    		+"<div class='arrow'></div>"
				    		+"<h3 class='popover-title'></h3>"
				    		+"<div class='popover-content'></div>"
				    		+"<div class='popover-navigation'>"
				    			+"<button class='btn btn-default' data-role='next'>Próxima dica sobre essa tela</button>"
				    		+"</div>"
				    	+"</nav>"
				    	+"</div>",
				onShown: function (tour) {
					isChecked();
				}
		    },
		    {
		        element: "#botoesStatusConciliacaoTour",
		        placement: "left",
		        title: "Status de Conciliação<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Temos três botões principais nessa página. <br/>São eles A conciliar, Conciliadas e Não processadas. " +
		        		"Clicando em cada um, você verá quais vendas estão em cada categoria. Se tiver alguma venda A conciliar no dia escolhido, automaticamente você entrará nessa categoria."+
		        		"<br/><br/><input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
		        template: "<div class='popover tour'>"
				    		+"<div class='arrow'></div>"
				    		+"<h3 class='popover-title'></h3>"
				    		+"<div class='popover-content'></div>"
				    		+"<div class='popover-navigation'>"
				    			+"<button class='btn btn-default' data-role='next'>Próxima dica sobre essa tela</button>"
				    		+"</div>"
				    	+"</nav>"
				    	+"</div>",
				onShown: function (tour) {
					isChecked();
				}
		    },
		    {
		        element: "#accordionVendasTour",
		        placement: "top",
		        title: "Detalhe das vendas<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Na tabela a seguir, você tem acesso a todas as vendas e faturamento, por operadora de cartão. " +
		        		"<br/><br/>Clique no ícone de + para detalhar as vendas em nível de bandeira e clique novamente no ícone de + para detalhar as vendas em nível de produto. " +
		        		"<br/>Esse conceito de detalhamento nós damos o nome de 'Drill Down' (em uma rápida tradução, podemos dar o nome de conceito de ‘escavação’). " +
		        		"<br/>Clicando novamente na linha dos produtos, você terá acesso a um relatório de todas as vendas da categoria. " +
		        		"Você pode conciliar as suas vendas selecionando o ‘checkbox’ das operadoras, bandeiras, produtos ou uma venda específica e clicando " +
		        		"no botão Conciliar vendas."+
		        		"<br/><br/><input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
		        template: "<div class='popover tour'>"
				    		+"<div class='arrow'></div>"
				    		+"<h3 class='popover-title'></h3>"
				    		+"<div class='popover-content'></div>"
				    		+"<div class='popover-navigation'>"
				    			+"<button class='btn btn-default' data-role='next'>Próxima dica sobre essa tela</button>"
				    		+"</div>"
				    	+"</nav>"
				    	+"</div>",
				onShown: function (tour) {
					isChecked();
				}
		    },
		    {
		        element: "#resumoMesDuvidas",
		        placement: "right",
		        title: "Dúvidas?<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Qualquer dúvida para utilizar essa tela, entre em contato com o nosso atendimento no e-mail suporte@kaplen.com.br. " +
		        		"<br/><br/>Se você entendeu como funciona, sugiro clicar na linha dos produtos para abrirmos um relatório venda a venda. " +
		        		"Você vai ver como é legal usar essa funcionalidade!"+
		        		"<br/><br/><input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
		        template: "<div class='popover tour'>"
				    		+"<div class='arrow'></div>"
				    		+"<h3 class='popover-title'></h3>"
				    		+"<div class='popover-content'></div>"
				    		+"<div class='popover-navigation'>"
				    			+"<button class='btn btn-default' data-role='end'>Finalizar tour de vendas</button><br />"
				    		+"</div>"
				    	+"</nav>"
				    	+"</div>",
				onShown: function (tour) {
					isChecked();
				}
		    }
		    
		    ] // Fim steps
	}  // Fim tour
	); // Fim tour
		
	// Initialize the tour
	tourResumoConciliacaoAnalitico.init();
}

function checkNoTips(checkbox){
	if(checkbox.checked){
		checkboxChecked = true;
		user.tour = true;
	}else{
		checkboxChecked = false;
		user.tour = false;
	}
	
	userService.editUser(user);
}

function isChecked(){
	var element = document.getElementsByName("checkboxName");
	
	if(checkboxChecked){
		element[0].checked = true;
	}
}

function restartResumoConciliacaoAnaliticoTour(userService, user){
	this.userService = userService;
	this.user = user;
	tourResumoConciliacaoAnalitico.restart();
}