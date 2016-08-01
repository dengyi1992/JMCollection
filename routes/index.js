var express = require('express');
var cheerio = require('cheerio');
var request = require("request");
var router = express.Router();
function doit(url,callback) {

  request(url,function (err, res, body) {
    if(err){
      callback(err);
    }
    var $ = cheerio.load(body);
    var jQuery = $(".size_option input").toArray();
    var label = $(".size_option label").toArray();
    var ids=[];
    for(var i=0;i<jQuery.length;i++){
      console.log(jQuery[i].attribs.value);
      ids.push("/*"+label[i].children["0"].data+":*/\""+jQuery[i].attribs.value+"\"");
    }
    callback(null,ids);
  });
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/getValue',function (req,res,next) {
  if( req.query.url==undefined){
   return res.render('urls', { title: '聚美优品获取id',allids:[] });
  }
  doit(req.query.url,function (err,ids) {
    if(err){
      /**
       *  h1= message
       h2= error.status
       pre #{error.stack}
       */
      res.render('error', { title: '聚美优品获取id',message:"获取失败，请检查url是否正确",error:err });

    }
    res.render('urls', { title: '聚美优品获取id',allids:ids });
  });

});
router.get('/getValueById',function (req,res,next) {
  if( req.query.id==undefined){
    return res.render('ids', { title: '聚美优品获取id',allids:[] });
  }
  var url = "http://h5.jumei.com/product/detail?item_id=" +req.query.id+
      "&type=jumei_pop";
  doit(url,function (err,ids) {
    if(err){
      /**
       *  h1= message
       h2= error.status
       pre #{error.stack}
       */
      res.render('error', { title: '聚美优品获取id',message:"获取失败，请检查url是否正确",error:err });

    }
    res.render('ids', { title: '聚美优品获取id',allids:ids });
  });

});

module.exports = router;
