/*
	Projeto: conciliation
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

(function(storage) {
	'use strict';

	angular
		.module('Conciliador.Session')
		.factory('SessionFactory', Session);

	function Session() {

		var STR_SESSION_NAME = 'control-session';
		var STR_COMPANIES_NAME = 'companies';

		var strSessionToken;
		var objCompanies;

		return {
			create: Create,
			destroy: Destroy,
			getToken: GetToken,
			isAuthenticated: IsAuthenticated,
			getCompanies: GetCompanies
		};

		function Create(strToken, companyDTOs) {
			if (strToken) {
				storage.setItem(STR_SESSION_NAME, strToken);
				strSessionToken = strToken;

				if (companyDTOs) {
					storage.setItem(STR_COMPANIES_NAME, JSON.stringify(companyDTOs));
					objCompanies = companyDTOs;
				}

				return true;
			}

			return false;
		}

		function Destroy() {
			storage.removeItem(STR_SESSION_NAME);
			storage.removeItem(STR_COMPANIES_NAME);
			strSessionToken = null;
			objCompanies = null;
		}

		function GetToken() {
			return strSessionToken || storage.getItem(STR_SESSION_NAME);
		}

		function GetCompanies() {
			return objCompanies || JSON.parse(storage.getItem(STR_COMPANIES_NAME));
		}

		function IsAuthenticated() {
			return !!GetToken();
		}
	}
})(window.localStorage);
