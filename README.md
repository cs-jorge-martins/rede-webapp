# conciliation-webapp

Este projeto consiste na aplicação frontend do *ControlRede*.

## Estrutura

A aplicação é construída utilizando bibliotecas conhecidas de Javascript, como [AngularJS](https://angularjs.org/) e [JQuery](https://jquery.org), bem como componentes visuais presentes na biblioteca [BootstrapUI](https://angular-ui.github.io/bootstrap/).

## Para executar a aplicação localmente

- Instalar dependências:

```
$ npm install
```

- Instalar globalmente o [Grunt](http://gruntjs.com/):

```
$ npm install -g grunt
```

- Inicializar o servidor local:

```
$ grunt local
```

- Para inicializar um servidor _mockado_ de login:

```
$ grunt login:local
```

## Para executar a aplicação em outros ambientes

- Gerar o arquivo de configuração com as informações para o ambiente em questão

```
$ grunt build:<ambiente>
```

Onde *<ambiente>* pode ser _local_, _dev_, _hml_ e _prod_

- Executar a aplicação dependendo do ambiente

```
$ grunt <ambiente>
```

Onde *<ambiente>* pode ser _local_, _dev_, _hml_

*P.S.:* Não é necessário executar o segundo passo para produção, pois este passo apenas inicializa um servidor de testes.

## Testes

Para executar os testes unitários, basta utilizar o seguinte comando:

```
$ grunt test:unit
```
