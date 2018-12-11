var mongodb  = require('../db/db');
var markdown = require('markdown').markdown;

function Post(username, head, title, tags, post) {
  this.username        = username;
  this.head            = head;
  this.title           = title;
  this.tags            = tags;
  this.post            = post;
}

module.exports = Post;

//存储一篇文章及其相关信息
Post.prototype.save = function(callback) {
  var date = new Date();
  //存储各种时间格式，方便以后扩展
  var time = {
      date:    date,
      year :   date.getFullYear(),
      month :  date.getFullYear() + "-" + (date.getMonth() + 1),
      day :    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  }
  //要存入数据库的文档
  var post = {
      username:       this.username,
      head:           this.head,
      time:           time,
      title:          this.title,
      tags:           this.tags,
      post:           this.post,
      comment:        [],
      reprint_info:   {},
      pv:             0
  };

  //打开数据库
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    //读取posts集合
    db.collection('posts', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      //将文档插入posts集合
      collection.insert(post, {safe:true}, function(err){
        mongodb.close();
        if(err){
          return callback(err);    //失败！返回err
        }
        callback(null);           //返回err为null
      });
    });
  });
};

//读取全部文章及其相关信息
Post.getTen = function(username, page, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      if (username) {
        query.username = username;
      }
      //根据 query 对象查询文章
      collection.count(query, function(err, total){
          collection.find(query,{
            skip: ( page -1 ) * 3,
            limit: 3
          }).sort({
            time: -1
          }).toArray(function (err, docs) {
            mongodb.close();
            if (err) {
              return callback(err);                              //失败！返回 err
            }
            docs.forEach(function (doc) {
                if(doc.post){
                    doc.post = markdown.toHTML(doc.post);
                }
            });
            callback(null,docs,total);               //成功！以数组形式返回查询的结果
          });
      });

    });
  });
};

//获取一篇文章
Post.getOne = function(username, minute, title, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //根据用户名、发表日期及文章名进行查询
      collection.findOne({
        "username": decodeURIComponent(username),
        "time.minute": decodeURIComponent(minute),
        "title": decodeURIComponent(title)
      }, function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        //解析 markdown 为 html
        if(doc){
            collection.update({
                "username": decodeURIComponent(username),
                "time.minute": decodeURIComponent(minute),
                "title": decodeURIComponent(title)
            },{
                $inc: {"pv": 1}
            },function(err){
                mongodb.close();
                if(err){
                    return callback(err);
                }
            });
            doc.post = markdown.toHTML(doc.post);
            if(doc.comments){
                doc.comments.forEach(function(comment){
                    comment.content = markdown.toHTML(comment.content);
                });
            }
        }
        callback(null, doc);//返回查询的一篇文章
      });
    });
  });
};

//编辑
Post.edit = function(username, minute, title, callback){
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    db.collection('posts',function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      collection.findOne({
        "username": decodeURIComponent(username),
        "time.minute": decodeURIComponent(minute),
        "title": decodeURIComponent(title)
      },function(err, doc){
        mongodb.close();
        if(err){
          return callback(err);
        }
        callback(null, doc);
      });
    });
  });
}

//更新一篇文章
Post.update = function(username, minute, title, post, callback){
  mongodb.open(function(err,db){
    if(err){
      return callback(err);
    }
    db.collection('posts', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      collection.update({
        "username": decodeURIComponent(username),
        "time.minute": decodeURIComponent(minute),
        "title":    decodeURIComponent(title)
      },{
        $set: {post: post}
      }, function(err){
        mongodb.close();
        if(err){
          return callback(err);
        }
        callback(null);
      });
    });
  });
}

//删除一篇文章
Post.remove = function(username, minute, title, callback){
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    db.collection('posts', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      collection.findOne({
          "username": decodeURIComponent(username),
          "time.minute":decodeURIComponent(minute),
          "title":    decodeURIComponent(title)
      }, function(err, doc){
          if(err){
              mongodb.close();
              return callback(err);
          }
          var reprint_from = "";
          if(doc.reprint_info.reprint_from){
              reprint_from = doc.reprint_info.reprint_from;
          }
          if(reprint_from !=""){
              collection.update({
                  "username": decodeURIComponent(reprint_from.username),
                  "time.minute": decodeURIComponent(reprint_from.minute),
                  "title":    decodeURIComponent(reprint_from.title)
              },{
                  $pull: {
                      "reprint_info.reprint_to": {
                          "username": decodeURIComponent(username),
                          "minute":      decodeURIComponent(day),
                          "title":    decodeURIComponent(title)
                      }
                  }
              }, function(err){
                  if(err){
                      mongodb.close();
                      return callback(err);
                  }
              });
          }
      });
      collection.remove({
        "username": decodeURIComponent(username),
        "time.minute": decodeURIComponent(minute),
        "title":    decodeURIComponent(title)
      },{
        w: 1
      },function(err){
        mongodb.close();
        if(err){
          return callback(err);
        }
        callback(null);
      });
    });
  });
}
//返回所有文章存档信息
Post.getArchive = function(callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.find({}, {
                "username": 1,
                "title": 1,
                "time": 1
            }).sort({ time: -1 }).toArray(function(err, docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null, docs);
            });
        });
    });
}
//返回所有标签
Post.getTags = function(callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.distinct("tags", function (err, docs) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null, docs);
            });
        });
    });
}
//返回含有特定标签的所有文章
Post.getTag = function(tag, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.find({"tags": tag},
            {
                "username": 1,
                "time":     1,
                "title":    1
            }).sort({
                time: -1
            }).toArray(function(err, docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null, docs);
            });
        });
    });
}
//获取所有上传内容
Post.getVedios = function(callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.distinct("tags", function (err, docs) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null, docs);
            });
        });
    });
}
//返回通过标题关键字查询的所有文章信息
Post.search = function(keyword, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var pattern = new RegExp(keyword, "i");
            collection.find({
                "title": pattern
            },{
                "username": 1,
                "time":     1,
                "title":    1
            }).sort({
                time: -1
            }).toArray(function(err, docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null, docs);
            });
        });
    })
}
//转载一篇文章
Post.reprint = function(reprint_from, reprint_to, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //找到被转载的文章的原文档
      collection.findOne({
        "username": decodeURIComponent(reprint_from.username),
        "time.minute": decodeURIComponent(reprint_from.minute),
        "title": decodeURIComponent(reprint_from.title)
      }, function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }

        var date = new Date();
        var time = {
            date: date,
            year : date.getFullYear(),
            month : date.getFullYear() + "-" + (date.getMonth() + 1),
            day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
            minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
            date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
        }

        delete doc._id;

        doc.username = decodeURIComponent(reprint_to.username);
        doc.head = reprint_to.head;
        doc.time = time;
        doc.title = (doc.title.search(/[转载]/) > -1) ? decodeURIComponent(doc.title) : "[转载]" + decodeURIComponent(doc.title);
        doc.comments = [];
        doc.reprint_info = {"reprint_from": decodeURIComponent(reprint_from)};
        doc.pv = 0;

        //更新被转载的原文档的 reprint_info 内的 reprint_to
        collection.update({
          "username": decodeURIComponent(reprint_from.username),
          "time.minute": decodeURIComponent(reprint_from.minute),
          "title": decodeURIComponent(reprint_from.title)
        }, {
          $push: {
            "reprint_info.reprint_to": {
              "username": decodeURIComponent(doc.username),
              "minute": decodeURIComponent(time.minute),
              "title": decodeURIComponent(doc.title)
          }}
        }, function (err) {
          if (err) {
            mongodb.close();
            return callback(err);
          }
        });

        //将转载生成的副本修改后存入数据库，并返回存储后的文档
        collection.insert(doc, {
          safe: true
        }, function (err, post) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
          callback(err, post['ops'][0]);
        });
      });
    });
  });
};
