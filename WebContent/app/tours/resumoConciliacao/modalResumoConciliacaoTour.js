//Resumo Conciliacao Tour
var modalTourResumoConciliacao;
var userService;
var checkboxChecked = false;
var user;

function startModalResumoConciliacaoTour(){
	// Instance the tourIniciar
	modalTourResumoConciliacao = new Tour(
	{
		  steps: [
		    {
		        element: "#detalheVendasTour",
		        placement: "left",
		        title: "Detalhe das vendas<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Esse relatório é um dos preferidos daqueles que gostam de informação analítica. " +
		        		"<br/><br/>Aqui você tem informações venda a venda, com os detalhes de data, NSU (Número Sequencial Único) e autorização " +
		        		"– ambos dados gerados pela operadora –, TID (Transaction ID), Cartão do cliente, Plano/Parcelamento, Maquineta, Chave do ERP (se existir) " +
		        		"e o Valor Bruto da venda."
		        		+"<br/><br/><input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
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
		        element: "#ordenacaoVendasTour",
		        placement: "bottom",
		        title: "Ordenação de campos nas vendas<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Você pode ordenar as informações de acordo com a sua necessidade. " +
		        		"<br/><br/>Por exemplo, ordenar por sequência crescente ou decrescente os Valores Brutos de venda – geralmente a informação preferida do setor financeiro dos varejistas."+
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
		        element: "#checkboxVendasTour",
		        placement: "top",
		        title: "Conciliando vendas<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Você pode selecionar no ‘checkbox’ as vendas que você deseja conciliar e, em seguida, clicar no botão Conciliar vendas. " +
		        		"Essas vendas serão movidas da categoria de A conciliar para a categoria Conciliadas."+
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
		        element: "#cupomVendasTour",
		        placement: "top",
		        title: "Conciliando vendas<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Clique em uma venda desejada e abra um comprovante de venda emulado, com a possibilidade de impressão e arquivamento em controle manual, em caso de perda do papel original, por exemplo. "+
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
		        element: "#exportarArquivosModalTour",
		        placement: "top",
		        title: "Exportando vendas<button class='btn btn-default close-modal' data-role='end'>Fechar</button>",
		        content:"Você pode exibir 10, 20 ou 50 vendas por página, e ainda exportar o relatório de vendas analíticas para os formatos PDF, Excel e CSV (com delimitador). "+
		        		"<br/><br/><input type='checkbox' name='checkboxName' onclick='checkNoTips(this)'> Não desejo ver essas mensagens nos meus próximos acessos.",
		        template: "<div class='popover tour'>"
				    		+"<div class='arrow'></div>"
				    		+"<h3 class='popover-title'></h3>"
				    		+"<div class='popover-content'></div>"
				    		+"<div class='popover-navigation'>"
				    			+"<button class='btn btn-default' data-role='end'>Finalizar tour de vendas analíticas</button><br />"
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
	modalTourResumoConciliacao.init();
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

function restartModalResumoConcilicaoTour(userService, user){
	this.userService = userService;
	this.user = user;
	modalTourResumoConciliacao.restart();
}