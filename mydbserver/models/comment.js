var mongodb  = require('./db');

function Comment(username, day, title, comment) {
  this.username        = username;
  this.day             = day;
  this.title           = title;
  this.comment         = comment;
}

module.exports = Comment;

//存储一篇文章及其相关信息
Comment.prototype.save = function(callback) {
  var date = new Date();
  var time = {
      date:    date,
      year:    date.getFullYear(),
      month:   date.getFullYear() + "-" + (date.getMonth() + 1),
      day:     date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute:  date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
               date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  }

  var username    = this.username,
      day         = this.day,
      title       = this.title,
      comment     = this.comment;

  mongodb.open(function(err, db){
      if(err){
        return callback(err);
      }
      db.collection('posts', function(err, collection){
         if(err){
            mongodb.close();
            return callback(err);
         }
         collection.update({
            "username": username,
            "time.day": day,
            "title":    title
         },{
            $push: {"comments": comment}
         }, function(err){
            mongodb.close();
            if(err){
              return callback(err);
            }
            callback(null);
         });
      });
  });
};
