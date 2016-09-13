//Dashboard Tour
var tourDashboard;
var userService;
var checkboxChecked = false;
var user;

function startDashboardTour(user){
	this.user = user;
	
	// Instance the tourIniciar
	tourDashboard = new Tour(
	{
		  steps: [
		    {
	          element: "#bemVindoTour",
	          placement: "bottom",
	          title: "Boas vindas<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
	          content: "Bem vindo a sua plataforma de conciliação de cartões de crédito e débito. " +
	          		   "<br/><br/>"+
	          		   "Faremos um breve tour guiado pelo produto. Sempre que tiver dúvidas sobre uma página que você está navegando, " +
	          		   "clique no botão ? ao lado direito do portal." +
	          		   "<br/><br/>" +
	          		   "<input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
	          template: "<div class='popover tour'>"
							+"<div class='arrow'></div>"
							+"<h3 class='popover-title'></h3>"
							+"<div class='popover-content'></div>"
							+"<div class='popover-navigation'>"
								+"<button class='btn btn-default' data-role='next'>Iniciar Tour Guiado</button>"
							+"</div>"
						+"</nav>"
						+"</div>"
	        },
	        {
		        element: "#dashboardTour",
		        placement: "bottom",
		        title: "Dashboard<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content: "Essa é a sua página principal. <br/><br/>" +
		        		" Gostamos de chamar essa tela de Dashboard, que nada mais é do que um breve resumo das suas vendas e recebimentos de cartão." +
		        		"<br/><br/>" +
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
		        element: "#configuracoesTour",
		        placement: "bottom",
		        title: "Painel de Controle<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content: "Nesse botão, é possível mudar a sua senha, incluir novas lojas, incluir novos usuários para acessar o sistema e até mesmo sair do produto." +
		        		 "<br/>" +
		        		 "Nós chamamos esse botão de Painel de Controle."+
		        		 "<br/><br/>" +
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
		        element: "#menuTour",
		        placement: "bottom",
		        title: "Menu Kaplen<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content: "Aqui fica o menu da Kaplen, onde você poderá acessar as suas vendas, financeiro, gestão e relatórios gráficos." +
		        		 "<br/>" +
		        		 "Explicaremos com melhores detalhes cada página, assim que você acessá-las, ok?"+
		        		 "<br/><br/>" +
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
		        element: "#valuesTour",
		        placement: "bottom",
		        title: "Indicadores<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content: "Esses quatro indicadores mostram como está a saúde da sua empresa." +
		        		 "<br/>" +
		        		 "Faremos comparações das suas vendas com cartão, média de vendas e ticket médio, sempre comparando o período atual com o mesmo período do mês anterior."+
		        		 "<br/><br/>" +
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
		        element: "#graficoVendasTour",
		        placement: "top",
		        title: "Gráfico de Vendas<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content: "Assim como na dica anterior, esse gráfico indica como estão as suas vendas no período do mês atual, em comparação ao mesmo período do mês anterior." +
		        		 "<br/>" +
		        		 "Com isso, você pode ver rapidamente como estão as suas vendas com cartão."+
		        		 "<br/><br/>" +
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
		        element: "#calendarioTour",
		        placement: "left",
		        title: "Calendário de conciliação<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content: "Esse é o seu principal controle. Nós gostamos de chama-lo de Calendário de conciliação, mas você pode chamar como quiser. ;)" +
		        		 "<br/><br/>" +
		        		 "Essa área serve como um resumo da sua conciliação de cartões. " +
		        		 "Quando o seu dia estiver verde, isso é um ótimo sinal de que todas as vendas que você fez, estão conciliadas pelas operadoras. " +
		        		 "Se está amarelo, você possui vendas a conciliar, e que você precisa conciliá-las. " +
		        		 "E se estiver vermelho, significa que você tem vendas que não foram processadas pelas operadoras de cartão. " +
		        		 "Explicaremos melhor quando você acessar o menu Vendas." +
		        		 "<br/><br/>" +
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
		        element: "#cancelamentos",
		        placement: "right",
		        title: "Gráfico de Cancelamentos e Chargebacks<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content: "Esse gráfico mostra um breve resumo da quantidade de cancelamentos e chargebacks (vendas canceladas por fraude ou outros motivos que você não possui gerência das informações)." +
		        		 "<br/>" +
		        		 "Sem dúvida, são informações que você precisa checar com frequência, pois causa grandes prejuízos a lojistas em todo o Brasil e no mundo."+
		        		 "<br/><br/>" +
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
		        element: "#taxas",
		        placement: "left",
		        title: "Painéis de Taxas<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content: "Esses três painéis resumem o quanto está sendo cobrado de taxa de administração pelas operadoras, vendas duplicadas e, " +
		        		"por fim, as taxas cobradas no mês atual com aluguel de máquinas/taxa de conectividade."+
		        		"<br/><br/>" +
		          		"<input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
		        template: "<div class='popover tour'>"
				    		+"<div class='arrow'></div>"
				    		+"<h3 class='popover-title'></h3>"
				    		+"<div class='popover-content'></div>"
				    		+"<div class='popover-navigation'>"
			    				+"<button class='btn btn-default' data-role='end'>Finalizar o tour</button><br />"
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
	tourDashboard.init();
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

function restartDashboardTour(userService){
	this.userService = userService;
	tourDashboard.restart();
}