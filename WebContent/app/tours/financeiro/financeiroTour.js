//Financeiro Tour
var tourFinanceiro;
var userService;
var checkboxChecked = false;
var user;

function startFinanceiroTour(user){
	this.user= user;
	
	// Instance the tourIniciar
	tourFinanceiro = new Tour(
	{
		  steps: [
		    {
	          element: "#bemVindoFinanceiroTour",
	          placement: "bottom",
	          title: "Financeiro<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
	          content: "A tela do Financeiro possui o mesmo conceito do menu de Vendas, com algumas particularidades que vou mostrar no nosso tour guiado." +
	          		   "<br/><br/>Se você ainda não assistiu ao Tour de Vendas, sugerimos que você comece por lá, ok? "+
	          		   "<br/><br/><input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
	          template: "<div class='popover tour' style='height:295px'>"
							+"<div class='arrow'></div>"
							+"<h3 class='popover-title'></h3>"
							+"<div class='popover-content'></div>"
							+"<div class='popover-navigation-financas'>"
								+"&nbsp;<button class='btn btn-default' onclick='getTourVendas()'>Ir para tour de Vendas</button>"
								+"&nbsp;&nbsp"
								+"<button class='btn btn-default' data-role='next'>Continuar</button><br />"
							+"</div>"
						+"</nav>"
						+"</div>"
	        },
	        {
	          element: "#calendarioFinanceiroTour",
	          placement: "bottom",
	          title: "Calendário Financeiro<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
	          content: "Assim como no menu de vendas, você também terá acesso ao Calendário de Conciliação horizontal. Mas nesse caso, você só terá informações de recebimento."+
	          		   "<br/><br/><input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
	          template: "<div class='popover tour'>"
							+"<div class='arrow'></div>"
							+"<h3 class='popover-title'></h3>"
							+"<div class='popover-content'></div>"
							+"<div class='popover-navigation'>"
								+"<button class='btn btn-default' data-role='next'>Próxima dica sobre essa tela</button>"
							+"</div>"
						+"</nav>"
						+"</div>"
		    },
		    {
	          element: "#listagemFinanceiroTour",
	          placement: "top",
	          title: "Registros Financeiros<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
	          content: "Na tabela a seguir, nós exibimos três colunas principais por dia: Previsto, Pagamento da operadora e Banco. Explico melhor abaixo:" +
	          		   "<br/><br/><b>Previsto</b> – São todas as parcelas de vendas realizadas no passado (débito e crédito) que foram projetadas para recebimento no dia de hoje." +
	          		   "<br/><br/><b>Pgto Operadora</b> – São todas as parcelas de vendas que as operadoras informaram à Kaplen que serão pagas nas respectivas contas correntes." +
	          		   "<br/><br/><b>Banco</b> – São os valores efetivados em conta corrente – você pode adicionar os valores que foram depositados pelas operadoras nas telas internas da Kaplen. Explico melhor em seguida." +
	          		   "<br/><br/>Clique em um dos dias em que você recebeu recebeu depósitos das operadoras, e tenha acesso a informações mais detalhadas das parcelas pagas." +
	          		   "<br/><br/><input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
	          template: "<div class='popover tour'>"
							+"<div class='arrow'></div>"
							+"<h3 class='popover-title'></h3>"
							+"<div class='popover-content'></div>"
							+"<div class='popover-navigation'>"
								+"<button class='btn btn-default' data-role='end'>Finalizar o tour Financeiro</button><br />"
							+"</div>"
						+"</nav>"
						+"</div>"
			},
		    
		    ] // Fim steps
	}  // Fim tour
	); // Fim tour
		
	// Initialize the tour
	tourFinanceiro.init();
}

function getTourVendas(){
	financeiroService.getTourVendas();
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

function restartFinanceiroTour(userService){
	this.userService = userService;
	tourFinanceiro.restart();
}