# Bigodinhos Carentes Bot
Bot do Twitter para trazer adotantes e doadores para a instituição Bigodinhos Carentes

## Objetivo
Trazer engajamento para a ONG iniciando conversas no twitter ao identificar mensagens relacionadas a adoção de gatos na região do Rio de Janeiro, onde fica a Bigodinhos Carentes

## Funcionamento
O código foi feito em Node.js e hospedado utilizando Heroku com o add-on Heroku Scheduler

A cada 10 minutos, o Heroku executa o código, levando às seguintes ações:

1. Utiliza os tokens da aplicação Twitter para criar um cliente do Twitter API
2. Determina uma janela de 9.9 minutos anteriores à execução do código, de forma a não responder a tweets repetidos
3. Pesquisa qual o tweet fixado de @BigodinhosRJ, caso haja, utiliza-o como mensagem nas replies, caso não, utiliza a mensagem padrão abaixo
>Olá! Somos a Bigodinhos Carentes. Quer adotar um gatinho? Fale com a gente pelo instagram https://www.instagram.com/bigodinhoscarentes/ ou pela DM aqui no Twitter. Temos vários gatos precisando de amor e cuidados em busca de adoção responsável (Rio de Janeiro/RJ).
4. Pesquisa nos tweets recentes pela query abaixo, considerando a janela de tempo e adicionando os campos de localização do tweet e do autor do tweet nos resultados
>"adotar+um+gato"
5. Analisa os resultados da busca, checando se a localização de algum tweet ou autor é do Rio de Janeiro (onde fica a ONG)
6. Caso encontre algum tweet que se encaixe nas condições acima, envia reply

## Observações

* Devido às limitações da API gratuita do Twitter, foi necessário limitar o funcionamento do bot a intervalos de 10 minutos
* Da forma que está implementado a expectativa é que o bot não precise de manutenção a curto e médio prazo
* A ideia é que a query seja melhorada de forma a incluir mais tweets e remover falsos positivos