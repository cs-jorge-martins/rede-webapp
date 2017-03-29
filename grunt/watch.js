/*
Projeto: conciliation-webapp
Author/Empresa: Rede
Copyright (C) 2016 Redecard S.A.
*/

'use strict';

module.exports = {
	sass: {
		files: ['WebContent/assets/sass/**/*.scss'],
		tasks: ["sass"]
	},
	js: {
		files: ['<%= concat.dist.src %>'],
		tasks: ["concat"]
	}
};
