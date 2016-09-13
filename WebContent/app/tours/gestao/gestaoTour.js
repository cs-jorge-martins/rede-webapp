var tourGestao;
var userService;
var checkboxChecked = false;
var user;

function startGestaoTour(user){
	this.user = user;
	
	// Instance the tourIniciar
	tourGestao = new Tour(
	{
		  steps: [
		    {
	          element: "#gestaoTuor",
	          placement: "bottom",
	          title: "<b>Gestão</b><button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
	          content: "Em Gestão, basicamente temos as informações de Cancelamentos e " +
	          			"Chargebacks. Antes de começarmos, darei um breve resumo " +
	          			"sobre os conceitos de cada um: " +
	          		   "<br/><br/>" +
	          		   "<b>Cancelamentos</b> – São as vendas canceladas pelo estabelecimento, " +
	          		   "operadora de cartão ou cliente, após a meia-noite em que a venda ocorreu. " +
	          		   "Os estornos (vendas canceladas ainda no caixa, por um erro ou desistência do cliente) " +
	          		   "não são exibidos no relatório de Cancelamentos da Kaplen."+
	          		   "<br/><br/>" +
	          		   "<b>Chargebacks</b> – Esse é um assunto bastante discutido, e seria assunto para diversas páginas, " +
	          		   "mas tentaremos resumir ao máximo. O processo de Chargeback acontece quando o portador do " +
	          		   "cartão de crédito solicita ao banco emissor do cartão o cancelamento de uma determinada venda, " +
	          		   "por diversos motivos, como por exemplo: fraude, não reconhecimento de compra, produto com defeito, " +
	          		   "demora na entrega do produto ou até por devolução do produto. Com isso a adquirente debita " +
	          		   "o valor da venda como chargeback dos seus recebimentos."+
	          		   "<br/><br/>" +
	          		   "<input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
	          template: "<div class='popover tour'>"
							+"<div class='arrow'></div>"
							+"<h3 class='popover-title'></h3>"
							+"<div class='popover-content'></div>"
							+"<div class='popover-navigation'>"
								+"<button class='btn btn-default' data-role='next'>Iniciar Tour de Gestão</button>"
							+"</div>"
						+"</nav>"
						+"</div>"
	        },
	        {
		        element: "#gestaoCalendarTour",
		        placement: "bottom",
		        title: "<b>Calendário de Conciliação</b><button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Assim como nos menus de Vendas e Financeiro, o menu de Gestão também dispõe do " +
		        		"“Calendário de Conciliação” horizontal, para acesso rápido a resumos de meses " +
		        		"ou mesmo informações específicas de um dia." +
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
		        element: "#graficoGestaoTour",
		        placement: "top",
		        title: "<b>Gráfico dia a dia</b><button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content: "Também mostramos um gráfico com os valores de cancelamentos e chargebacks, " +
		        		"dia a dia, período escolhido. Essa informação pode ser estratégica para saber " +
		        		"quais dias estão com mais problemas de gestão" +
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
		        element: "#tabelaGestaoTuor",
		        placement: "top",
		        title: "<b>Tabela de Gestão</b><button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content: "Na tabela de Gestão, teremos duas colunas principais: " +
		        		"“Cancelamentos” e “Chargebacks”. Simples como deve ser, " +
		        		"nós mostramos quantas vendas foram canceladas por dia e o " +
		        		"quanto isso representa em Reais. Na coluna seguinte, as mesmas informações para os Chargebacks." +		        		 
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
		        element: "#diaGestaoTour",
		        placement: "left",
		        title: "<b>Relatório Analítico</b><button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content: "Clique em um dia com vendas Canceladas ou Chargebacks e tenha acesso " +
		        		"a um relatório analítico com essas informações."+
		        		"<br/><br/>" +
		          		"<input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
		        template: "<div class='popover tour'>"
				    		+"<div class='arrow'></div>"
				    		+"<h3 class='popover-title'></h3>"
				    		+"<div class='popover-content'></div>"
				    		+"<div class='popover-navigation'>"
			    				+"<button class='btn btn-default' data-role='end'>Finalizar o tour de Gestão</button><br />"
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
	tourGestao.init();

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

function restartGestaoTour(userService){
	this.userService = userService;
	tourGestao.restart();
}