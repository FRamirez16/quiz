var models = require('../models/models.js');

exports.load = function(req, res, next, commentId) {
  models.Comment.find({
            where: {
                id: Number(commentId)
            }
        }).then(function(comment) {
      if (comment) {
        req.comment = comment;
        next();
      } else{next(new Error('No existe commentId=' + commentId))}
    }
  ).catch(function(error){next(error)});
};
// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
  res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
};

// POST /quizes/:quizId/comments
exports.create = function(req, res) {
  var comment = models.Comment.build(
      { texto: req.body.comment.texto,          
        QuizId: req.params.quizId
       });

  comment
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('comments/new.ejs', {comment: comment, quizid: req.params.quizId, errors: err.errors});
      } else {
        comment // save: guarda en DB campo texto de comment
        .save()
        .then( function(){ res.redirect('/quizes/'+req.params.quizId)}) 
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  ).catch(function(error){next(error)});
  
};
exports.publish = function(req, res) {
  req.comment.publicado = true;

  req.comment.save( {fields: ["publicado"]})
    .then( function(){ res.redirect('/quizes/'+req.params.quizId);} )
    .catch(function(error){next(error)});

  };

  exports.statistic = function(req,res){
 var AUX1=[];
 var AUX2;
 models.Quiz.count().then(function(quizes){
   models.Comment.findAll({where:{publicado: true}}).then(function(comments){
     AUX2=quizes;
     for(var i=0; i<comments.length;i++){
       if(AUX1[comments[i].QuizId]===undefined){
         AUX2--;
       }
       AUX1[comments[i].QuizId]=1;
     }
     res.render('quizes/statistic',
           {quizes: quizes,
            comments: comments.length,
            sin_comments:AUX2,
            con_comments:quizes-AUX2,
            media: comments.length/quizes,
            errors: []
     });
   });
 }).catch(function(error){next(error)});
;
};