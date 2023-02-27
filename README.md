# horrorRepository
  A ideia desse projeto era converter este [CSV do site kaggle](https://www.kaggle.com/datasets/evangower/horror-movies) em um banco de dados e criar uma api de consulta.
Só que são mais de 5 mil registros... E eu queria fazer de uma forma que fosse a mais fácil possível para alguém simplemente baixar meu repositório e testar o projeto.

Logo pensei em utilizar Docker, estou aprendendo e esse projetinho poderia ser uma atividade prática interessante.
Busquei alguns tutoriais e, dos poucos que eu encontrei, [esse](https://sherryhsu.medium.com/how-to-import-csv-into-docker-postgresql-database-22d56e2a1117) foi o melhor, mas não o mais elucidativo;

A execução do projeto se da da seguinte forma:
- O docker de Postgres é criado;
- O arquivo CSV é transformado em uma tabela SQL por meio de um script
- Sobe o container do banco de dados;
- Então, sobe o container node com express que irá fornecer a rota de consulta e exibição de registros do banco;
