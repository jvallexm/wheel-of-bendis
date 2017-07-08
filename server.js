var express = require('express');
var app = express();
var path = require('path');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://itme:goodpassword@ds143132.mlab.com:43132/marvel-events'


app.use(express.static(__dirname));

app.route('/getall')
    .get(function(req, res) {
        MongoClient.connect(url,function(err,db){
            if(err)
            { 
              console.log(err);
              res.send("Error connecting to server.");
            }
            var characters = db.collection('characters');
		    var findOne = (db,err) =>
		    {
		      characters.find({},{})
		      .toArray((err,data) => {
		          if(err)
		            console.log(err);
		          else
		           res.send(data);
		      });
		    }
		    findOne(db,()=>{db.close();});
        });
});

app.route('/search/:searchTerms*')
   .get((req,res)=>{
   	 var name = req.params.searchTerms;
   	 var dis = req.params.dis;
     MongoClient.connect(url,function(err,db){
     	 if(err)
         { 
           res.send("Error connecting to server.");
           console.log(err);
         }
         var characters = db.collection('characters');
		 var findOne = (db,err) =>
		 {
		   characters.find({ $or: [{name: name}, {disambiguation: name}]},{})
		    .toArray((err,data) => {
		     if(err)
		       console.log(err);
		     else
		       res.send(data);
		   });
		 }
		 findOne(db,()=>{db.close();});
     });
});

app.route('/update/:id/:name/:disambiguation/:teams/:isHero/:list')
   .post((req,res)=>{
    var toon = 
    {
      "_id": req.params.id,
      "name": req.params.name,
      "disambiguation": req.params.disambiguation,
      "teams": req.params.teams,
      "isHero": req.params.isHero,
      "list": req.params.list
    }
    var dis = req.params.disambiguation;
    if(dis=="(none)")
      dis="";
    console.log(toon);
    MongoClient.connect(url,function(err,db){
       if(err)
       { 
         res.send("Error connecting to server.");
         console.log(err);
       }
       var characters = db.collection('characters');
       var findOne = (db,err) =>
       {
              characters.update({name: req.params.name},
              {$set: {
    			disambiguation: dis,
    			teams: req.params.teams,
    			isHero: req.params.isHero,
    			list: req.params.list
    		 }});
	   }
	   findOne(db,()=>{db.close();});
       
    });
    console.log("it is completed.");
});

app.route('/add/:id/:name/:disambiguation/:teams/:isHero/:list')
   .post((req,res)=>{
   	var dis = req.params.disambiguation;
    if(dis=="(none)")
      dis="";
      
   	var toon = 
    {
      "_id": req.params.id,
      "name": req.params.name,
      "disambiguation": dis,
      "teams": req.params.teams,
      "isHero": req.params.isHero,
      "list": req.params.list
    }

    console.log(toon);
    MongoClient.connect(url,function(err,db){
       if(err)
       { 
         res.send("Error connecting to server.");
         console.log(err);
       }
       var characters = db.collection('characters');
       var findOne = (db,err) =>
       {
           characters.insert(toon);
	   }
	   findOne(db,()=>{db.close();});
       
    });
    console.log("it is completed.");
});

app.listen(process.env.PORT, function() {
    console.log('Server listening');
});