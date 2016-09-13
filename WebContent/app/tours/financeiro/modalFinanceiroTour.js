//Financeiro Tour
var modalTourFinanceiro;
var userService;
var checkboxChecked = false;
var user;

function startModalFinanceiroTour(){
	// Instance the tourIniciar
	modalTourFinanceiro = new Tour(
	{
		  steps: [
		    {
		        element: "#detalheFinancasTour",
		        placement: "left",
		        title: "Detalhamento Financeiro<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Parece muita informação, mas não é! Vou te ajudar a entender como funciona essa tela e garanto que, após essa breve explicação, você vai ser um expert! " +
		        		"<br/><br/><input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
		        template: "<div class='popover tour'>"
				    		+"<div class='arrow'></div>"
				    		+"<h3 class='popover-title'></h3>"
				    		+"<div class='popover-content'></div>"
				    		+"<div class='popover-navigation'>"
				    			+"<button class='btn btn-default' data-role='next'>Iniciar treinamento</button>"
				    		+"</div>"
				    	+"</nav>"
				    	+"</div>",
				onShown: function (tour) {
					isChecked();
				}
		    },
		    {
		        element: "#movementsPrevistosTour",
		        placement: "bottom",
		        title: "Previstos<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"São as mesmas três colunas que venho mostrando: Previsto, Pagamento da Operadora e Banco." +
		        		"<br/><br/>Em previsto, você pode ver tudo que já foi pago, tudo que está em aberto e tudo que foi antecipado, antes do dia atual." +
		        		"Ou seja, se houver diferença entre o que está em Previsto e o que está em “Pgto Operadora”, pode ser porque algum valor já foi pago" +
		        		"no passado ou mesmo foi antecipado. " +
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
		        element: "#movementsPagosTour",
		        placement: "bottom",
		        title: "Pgto Operadora<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Na coluna “Pgto Operadora”, é ainda mais simples." +
		        		"<br/><br/>As operadoras estão informando à Kaplen que estão pagando as parcelas de vendas que foram feitas no passado (submenu Créditos), " +
		        		"que estão pagando parcelas de vendas que foram antecipadas (submenu Antecipado) e que estão fazendo débitos de aluguel de maquinetas, " +
		        		"cancelamentos, chargebacks ou afins (submenu Ajustes). " +
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
		        element: "#movementsBankTour",
		        placement: "bottom",
		        title: "Banco<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Na coluna “Banco”, são os valores que foram previamente cadastrados por você, na tela anterior de Financeiro. Você pode fazer esse cadastro ou não. Fica a seu critério! "+
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
		        element: "#submenusFinanceiroModalTour",
		        placement: "bottom",
		        title: "Submenus<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Clicando nos submenus das colunas de Previsto ou Pagamento Operadora, você pode ainda ver quais parcelas representam o pagamento daquele lote. " +
		        		"<br/><br/>Exemplo: Se você clicar no submenu ‘em aberto’ da coluna de “Previsto”, serão exibidas abaixo as parcelas que representam aquele valor em aberto. "+
		        		"<br/><br/><input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
		        template: "<div class='popover tour'>"
				    		+"<div class='arrow'></div>"
				    		+"<h3 class='popover-title'></h3>"
				    		+"<div class='popover-content'></div>"
				    		+"<div class='popover-navigation'>"
				    			+"<button class='btn btn-default' data-role='next'>Próxima dica sobre essa tela</button><br />"
				    		+"</div>"
				    	+"</nav>"
				    	+"</div>",
				onShown: function (tour) {
					isChecked();
				}
		    },
		    {
		        element: "#parcelasFinanceiroModalTour",
		        placement: "left",
		        title: "Parcelas<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Você pode ainda clicar em uma das parcelas que foram exibidas na tabela abaixo e ver um comprovante de venda emulado com " +
		        		"as informações de NSU (Número Sequencial Único), Autorização, TID (Transaction ID), Cartão do cliente, Parcela, Chave ERP (se houver), " +
		        		"Valor líquido a ser depositado e Valor Bruto da venda. " +
		        		"<br/><br/><input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
		        template: "<div class='popover tour'>"
				    		+"<div class='arrow'></div>"
				    		+"<h3 class='popover-title'></h3>"
				    		+"<div class='popover-content'></div>"
				    		+"<div class='popover-navigation'>"
				    			+"<button class='btn btn-default' data-role='next'>Próxima dica sobre essa tela</button><br />"
				    		+"</div>"
				    	+"</nav>"
				    	+"</div>",
				onShown: function (tour) {
					isChecked();
				}
		    },
		    {
		        element: "#exportarFinanceiroModalTour",
		        placement: "top",
		        title: "Exportar Relatórios<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Para concluirmos, assim como em todas as outras telas do sistema, você pode exportar os seus relatórios nos formatos PDF, Excel e CSV. " +
		        		"<br/><br/><input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
		        template: "<div class='popover tour'>"
				    		+"<div class='arrow'></div>"
				    		+"<h3 class='popover-title'></h3>"
				    		+"<div class='popover-content'></div>"
				    		+"<div class='popover-navigation'>"
				    			+"<button class='btn btn-default' data-role='end'>Finalizar o tour Financeiro</button><br />"
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
	modalTourFinanceiro.init();

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

function restartModalFinanceiroTour(userService, user){
	this.userService = userService;
	this.user = user;
	modalTourFinanceiro.restart();
}