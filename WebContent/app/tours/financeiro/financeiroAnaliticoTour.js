//Financeiro analitico Tour
var tourFinanceiroAnalitico;
var userService;
var checkboxChecked = false;
var user;

function startFinanceiroAnaliticoTour(){
	// Instance the tourIniciar
	tourFinanceiroAnalitico = new Tour(
	{
		  steps: [
		    {
		        element: "#bemVindoFinanceiroAnaliticoTour",
		        placement: "top",
		        title: "Financeiro Analítico",
		        content:"Ótimo, você está avançando rápido nas telas da Kaplen. Tenho certeza que você está achando ‘moleza’ conciliar as suas vendas e recebimentos com a gente." +
		        		"<br/><br/>Vamos entender como conciliar os seus recebimentos? " +
		        		"<br/><br/><input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
		        template: "<div class='popover tour'>"
				    		+"<div class='arrow'></div>"
				    		+"<h3 class='popover-title'></h3>"
				    		+"<div class='popover-content'></div>"
				    		+"<div class='popover-navigation'>"
				    			+"<button class='btn btn-default' data-role='next'>Vamos lá!</button>"
				    		+"</div>"
				    	+"</nav>"
				    	+"</div>",
				onShown: function (tour) {
					isChecked();
				}
		    },
		    {
		        element: "#detalhamentoAnaliticoTour",
		        placement: "top",
		        title: "Detalhamento Sintético",
		        content:"Nesta tabela nós mostramos de forma sintética as mesmas informações de Previsto, Pagamento da Operadora e Banco, mas agora incluindo os dados bancários de recebimento." +
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
		        element: "#accordionFinanceiroAnaliticoTour",
		        placement: "top",
		        title: "Detalhamento Sintético",
		        content:"Ok, seguindo o mesmo conceito de Vendas, aqui nós usamos a lógica de Drill Down. " +
		        		"<br/>Ou seja, clicando no ícone de +, da conta desejada, abre-se os detalhes das operadoras que estão efetuando depósitos nessa conta corrente, em seguida as bandeiras e por fim os produtos." +
		        		"<br/><br/>Se preferir, você pode abrir um relatório analítico, parcela a parcela, de tudo que está sendo depositado em sua conta corrente, na visão de Pagamento da Operadora."+
		        		"<br/>Clique em uma das linhas dos produtos e veja como funciona esse relatório."+
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
		        element: "#bankFinanceiroAnaliticoTour",
		        placement: "top",
		        title: "Valor Bancário",
		        content:"Na coluna do banco, você pode clicar no botão que fica ao lado dos valores dos produtos " +
		        		"(é necessário abrir as informações até chegar ao nível de produto), e digitar os valores que de fato foram depositados em sua conta corrente, " +
		        		"para efetuar a conciliação. " +
		        		"<br/><br/><input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
		        template: "<div class='popover tour'>"
				    		+"<div class='arrow'></div>"
				    		+"<h3 class='popover-title'></h3>"
				    		+"<div class='popover-content'></div>"
				    		+"<div class='popover-navigation'>"
				    			+"<button class='btn btn-default' data-role='end'>Finalizar o tour Financeiro</button>"
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
	tourFinanceiroAnalitico.init();

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

function restartFinanceiroAnaliticoTour(userService, user){
	this.userService = userService;
	this.user = user;
	tourFinanceiroAnalitico.restart();
}