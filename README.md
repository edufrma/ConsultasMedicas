# Sistema de Gerenciamento de Consultas Medicas

Trabalho de conclusão do curso "Pós-graduação em Desenvolvimento Full Stack e Cloud Computing", ministrado pela Gran Faculdade.

Para rodar o código disponível aqui, é necessário também criar um banco de dados PostgreSQL e criar o arquivo "./backend/.env", cujo conteúdo deve ser:

```
DB_USER=[Usuário do banco de dados]
DB_PASSWORD=[Senha do usuário]
DB_HOST=[URL de acesso ao banco de dados]
DB_PORT=[Porta do banco de dados]
DB_NAME=[Nome da database]
```

Por fim, ao rodar o código pela primeira vez, devem-se instalar os pacotes necessários do Node. Para isso, rode nos diretórios "./cons-med" e "./backend" o comando:

```
npm install
```

Feito isso, para rodar o sistema, devem ser inicializados tanto o *front-end* quanto o *back-end*. Para tanto, rode nos mesmos diretórios o comando:

```
npm start
```
