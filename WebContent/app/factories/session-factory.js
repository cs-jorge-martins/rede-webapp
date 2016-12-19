/*
	Projeto: conciliation
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */

(function(storage) {
	'use strict';

	angular
		.module('Conciliador.Session')
		.factory('Session', Session);

	function Session() {

		var SESSION_NAME = 'control-session';
		var COMPANIES_NAME = 'companies';

		var strSessionToken;
		var objCompanies;

		return {
			create: create,
			destroy: destroy,
			getToken: getToken,
			isAuthenticated: isAuthenticated,
			getCompanies: getCompanies
		};

		function create(strToken, companyDTOs) {
			if (strToken) {
				storage.setItem(SESSION_NAME, strToken);
				strSessionToken = strToken;

				if (companyDTOs) {
					storage.setItem(COMPANIES_NAME, JSON.stringify(companyDTOs));
					objCompanies = companyDTOs;
				}

				return true;
			}

			return false;
		}

		function destroy() {
			storage.removeItem(SESSION_NAME);
			storage.removeItem(COMPANIES_NAME);
			strSessionToken = null;
			objCompanies = null;
		}

		function getToken() {
			return strSessionToken || storage.getItem(SESSION_NAME);
		}

		function getCompanies() {
			return objCompanies || JSON.parse(storage.getItem(COMPANIES_NAME));
		}

		function isAuthenticated() {
			return !!getToken();
		}
	}

})(window.localStorage);
