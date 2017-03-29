/*
Projeto: conciliation-webapp
Author/Empresa: Rede
Copyright (C) 2016 Redecard S.A.
*/

'use strict';

module.exports = {
	local: {
		root: './WebContent',
		port: 8100,
		host: "0.0.0.0",
		openBrowser: true,
		runInBackground: true,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "*",
			"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
		}
	}
};
