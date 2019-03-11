let express=require('express')
let path=require('path');
let bodyParser=require('body-parser');
let mongo=require('mongoose');

let db=mongo.connect("mongodb://localhost:27017/CRUDwithAngular",{useNewUrlParser: true},function(error, response){
           if(error) return console.log(error);
           console.log("connected to " +db,'+', response);
});

let app=express();
app.use(bodyParser());
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({extended:true}));


app.use(function (req,res,next){
    res.setHeader('Access-Control-Allow-Origin','http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods','GET ,POST,OPTIONS,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials',true);
    next();
});

let Schema=mongo.Schema;
let UsersSchema=new Schema({
    name:{type:String},
    address:{type:String}
}, {verionKey:false});
let model=mongo.model('users',UsersSchema,'users');

app.post("/api/SaveUser",function(req,res){
    let mod=new model(req.body);
    mod.save(function(err,data){
        if(err) return res.send(err);
        res.send({data:"record has been inserted!"});
    });
});


app.post("/api/UpdateUser",function(req,res){
     model.findByIdAndUpdate(req.body._id,{name:req.body.name,address:req.body.address},function(err,data){
        if(err) return res.send(err);
        res.send({data:"record has been Updated!"});
    });
});



app.post("/api/deleteUser",function(req,res){
   
    model.deleteOne({_id:req.body.id},function(err){
        if(err) return res.send(err);
        res.send({data:"record has been Deleted!"});
    });
});


app.get("/api/getUser",function(re,res){
    model.find({},function(error,data){
        if(error) return res.send(error);
        res.send(data);
    })
});

app.listen(8080,function(){
    console.log("Server running on port no 8080");
})