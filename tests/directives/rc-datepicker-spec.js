/*
 Projeto: conciliation
 Author/Empresa: Rede
 Copyright (C) 2016 Redecard S.A.
 */

describe('rc-datepicker directive', function(){

    var scope, template, strTemplateNode;

    beforeEach(module('Conciliador'));
    beforeEach(module('app/views/directives/rc-datepicker-v2.html'));
    beforeEach(module('app/views/directives/rc-datepicker-popup-v2.html'));

    describe('range datepicker', function () {

    	beforeEach(inject(function ($compile, $rootScope) {

			scope = $rootScope.$new();

			var rangeElement = angular.element(
				'<rc-datepicker-v2 range="true" date="objModelDate" show-next-dates-filter="true" is-open="bolIsOpen"></rc-datepicker-v2>'
			);

			template = $compile(rangeElement)(scope);

			var objInitialDate = new Date("february 21, 2017 00:00:00");
			var objFinalDate = new Date("february 23, 2017 00:00:00");
			scope.objModelDate = [objInitialDate, objFinalDate];
			scope.bolIsOpen = false;
			scope.$digest();

			strTemplateNode = template[0];

		}));

		it("place holder should be 21/02/2017 a 23/02/2017", function () {

			var strPlaceHolder = strTemplateNode.querySelector('a.placeholder').innerText;
			expect(strPlaceHolder).toEqual('21/02/2017 a 23/02/2017');

		});


		it("range has to contain 3 dates selected", function () {

			scope.isOpen = true;
			scope.$digest();
			var strPlaceHolder = strTemplateNode.querySelector('.uib-datepicker-popup');

			console.log("strPlaceHolder", strPlaceHolder);

			// expect(strPlaceHolder).toEqual('21/02/2017 a 23/02/2017');

		});

		// it("should add classes in range", function () {
		//
		// 	scope.isOpen = true;
		// 	scope.$digest();
		// 	console.log("strTemplateNode", strTemplateNode)
		//
		// });

	});

});
