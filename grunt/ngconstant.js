/*
Projeto: conciliation-webapp
Author/Empresa: Rede
Copyright (C) 2016 Redecard S.A.
*/

'use strict';

var API_URLS = {
	local: 'http://localhost:8080',
	dev: 'https://va4f0tsgxh.execute-api.us-east-1.amazonaws.com/dev',
	hml: 'https://kuavd29apk.execute-api.us-east-1.amazonaws.com/hml',
	prod: 'https://9ht8utfgo1.execute-api.us-east-1.amazonaws.com/PRD'
};

module.exports = {
	options: {
		dest: 'WebContent/app/config.js',
		space: ' ',
		wrap: '"use strict";\n\n {\%= __ngModule %}',
		name: 'Conciliador.appConfig'
	},
	local: {
		constants: {
			app: {
				endpoint: API_URLS.local,
				login: {
					endpoint: 'http://localhost:8030'
				}
			}
		}
	},
	development: {
		constants: {
			app: {

				endpoint: API_URLS.dev,
				login: {
					endpoint: API_URLS.dev
				}
			}
		}
	},
	homologation: {
		constants: {
			app: {
				endpoint: API_URLS.hml,
				login: {
					endpoint: API_URLS.hml
				}
			}
		}
	},
	production: {
		constants: {
			app: {
				endpoint: API_URLS.prod,
				login: {
					endpoint: API_URLS.prod
				}
			}
		}
	}
};
