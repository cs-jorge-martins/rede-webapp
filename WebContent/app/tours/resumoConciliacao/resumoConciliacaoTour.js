//Resumo Conciliacao Tour
var tourResumoConciliacao;
var userService;
var checkboxChecked = false;
var user;

function startResumoConciliacaoTour(user){
	this.user = user;
	
	// Instance the tourIniciar
	tourResumoConciliacao = new Tour(
	{
		  steps: [
		    {
	          element: "#bemVindoVendasTour",
	          placement: "bottom",
	          title: "Vendas<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
	          content: "Que legal, vamos começar a conciliar! <br/><br/> O controle de vendas que a Kaplen faz é muito simples. Vamos lá? "+
	          		   "<br/><br/>"+
				       "<input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
	          template: "<div class='popover tour'>"
							+"<div class='arrow'></div>"
							+"<h3 class='popover-title'></h3>"
							+"<div class='popover-content'></div>"
							+"<div class='popover-navigation'>"
								+"<button class='btn btn-default' data-role='next'>Iniciar Tour Guiado em Vendas</button>"
							+"</div>"
						+"</nav>"
						+"</div>",
	        },
	        {
		        element: "#calendarioVendasTour",
		        placement: "bottom",
		        title: "Calendário de Vendas<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Lembra do nosso calendário de conciliação que nós vimos no Dashboard?<br/>" +
		        		"Pois é, ele também está disponível aqui no menu vendas. " +
		        		"A diferença é que agora ele está em um formato horizontal, mas a funcionalidade é a mesma, assim como o conceito de semáforo: <br/><br/>" +
		        		"<ul><li>Vendas conciliadas</li><li>Vendas a conciliar</li><li>Vendas não processadas</li></ul>" +
		        		"<br/>Você pode clicar em dias específicos que você queira conciliar, ou mesmo clicar em um dos meses, e ver as informações abaixo."+
		        		"<br/><br/>"+
					    "<input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
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
		        element: "#abasVendasTour",
		        placement: "top",
		        title: "Submenus<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Temos aqui dois submenus: <br/><br/> (a) Resumo do mês<br/>(b) Conciliação do dia. " +
		        		"<br/><br/>Vamos começar pelo Resumo do dia e em seguida eu mostro a outra opção, ok?"+
		        		"<br/><br/>"+
					    "<input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
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
		        element: "#botaoResumoDiaVendasTour",
		        placement: "left",
		        title: "Resumo do Mês<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Este primeiro botão que já vem selecionado por default, é o botão de Resumo do mês."+
				        "<br/><br/>"+
					    "<input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
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
		        element: "#botaoComparativoVendasTour",
		        placement: "bottom",
		        title: "Comparativo de Vendas<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"O segundo botão é o comparativo entre o que a Kaplen tem e o que o seu Frente de Loja, TEF ou Gateway tem (caso você faça o upload dos seus arquivos de venda)."+
				        "<br/><br/>"+
					    "<input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
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
		        element: "#botaoUploadArquivosVendasTour",
		        placement: "bottom",
		        title: "Upload de arquivos<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"O terceiro botão, após clicado, permite que você faça o upload do seu arquivo de vendas em TXT, conforme integração com o seu Frente de Loja." +
		        		"<br/>Consulte o nosso suporte caso queira usar essa funcionalidade."+
		        		"<br/><br/>"+
					    "<input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
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
		        element: "#graficoOperadorasVendasTour",
		        placement: "top",
		        title: "Gráfico de operadoras<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Aqui você consegue visualizar o resumo do mês no formato gráfico. " +
		        		"Ou seja, consegue ver o percentual de vendas conciliadas (verde), a conciliar (amarelo) ou não processadas (vermelho), " +
		        		"assim como o percentual de vendas por operadora que a sua empresa trabalha."+
		        		"<br/><br/>"+
					    "<input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
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
		        element: "#listagemVendasTour",
		        placement: "left",
		        title: "Resumo de vendas<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Agora sim, o melhor dessa tela. Mostramos aqui o seu resumo de vendas do mês, de acordo com o conceito já explicado de semáforo: " +
		    			"<br/><br/><ul><li>Vendas conciliadas</li><li>Vendas a conciliar</li><li>Vendas não processadas</li></ul>" +
		        		"<br/>Caso queira ver o detalhe das vendas que estão em um dos status acima, basta clicar na linha desejada e ver essas informações separadas por adquirente (operadora), bandeiras e produtos."+
		        		"<br/><br/>"+
					    "<input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
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
		        element: "#botoesExportarTour",
		        placement: "top",
		        title: "Exportar Vendas<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Você pode exportar esse relatório em PDF ou Excel, clicando nos botões abaixo." +
		    			"<br/>Se você ficou com alguma dúvida sobre essa página, entre em contato com a nossa equipe de atendimento no e-mail suporte@kaplen.com.br. " +
		    			"<br/>Será um prazer ajudá-lo a tirar o melhor proveito da tela de conciliação de vendas."+
		    			"<br/><br/>"+
					    "<input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
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
	tourResumoConciliacao.init();
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

function restartResumoConciliacaoTour(userService){
	this.userService = userService;
	tourResumoConciliacao.restart();
}