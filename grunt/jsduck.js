/*
Projeto: conciliation-webapp
Author/Empresa: Rede
Copyright (C) 2016 Redecard S.A.
*/

'use strict';

module.exports = {
	main: {
		src: [
			'WebContent/app/directives/**/*.js'
			//'WebContent/app/factories/**/*.js',
			//'WebContent/app/filters/**/*.js',
			//'WebContent/app/service/**/*.js'
		],
		dest: 'docs',
		options: {
			'title': 'Conciliador Webapp',
			'builtin-classes': false,
			'warnings': ['-no_doc', '-dup_member', '-link_ambiguous'],
			'external': ['XMLHttpRequest']
		}
	}
};
