/**
 * 
 */

angular.module('Conciliador.TransactionSummary',[])
	.config(['$routeProvider','RestangularProvider' ,function ($routeProvider, RestangularProvider) {

}])

 function TransactionSummary(){
	 
	this.date; 
	this.quantity; 
	this.acquirer = {
		id: false,
		name: false
	};
	this.cardProduct;
	this.shop;
	this.conciliationStatus;
	this.amount;
	this.net;
	this.cancelledAmount;
	 
 }