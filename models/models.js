var path = require('path');

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name      = (url[6]||null);
var user         = (url[2]||null);
var pwd          = (url[3]||null);
var protocol     = (url[1]||null);
var dialect      = (url[1]||null);
var port         = (url[5]||null);
var host         = (url[4]||null);
var storage      = process.env.DATABASE_STORAGE;
//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQlite
var sequelize = new Sequelize(DB_name, user , pwd,
            {dialect: protocol,
             protocol: protocol,
             port: port,
             host: host,
             storage: storage,
             omitNull: true
            });
var quiz_path = path.join(__dirname, 'quiz');
var Quiz= sequelize.import(quiz_path);
exports.Quiz = Quiz; // exportar definición de tabla Quiz


sequelize.sync().then(function(){
  Quiz.count().then(function(count){
  if(count ===0 ){
  Quiz.create({pregunta: 'capital de Italia',
         repuesta: 'Roma'
        });
  Quiz.create({pregunta: 'capital de Portugal',
         repuesta: 'Lisboa'
        })
  .then(function(){console.log('Base de datos inicializada')});
  };
  });
});