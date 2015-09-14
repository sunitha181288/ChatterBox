var express = require('express'),
	app = express(),
	path =require('path'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	config = require('./config/config.js'),
	ConnectMongo = require('connect-mongo')(session),
	mongoose = require('mongoose').connect(config.dbURL),
	passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy
	
	
	app.set('views', path.join(__dirname, 'views'));
	app.engine('html', require('hogan-express'));
	app.set('view engine' , 'html');
	app.use(express.static(path.join(__dirname,'images')));
	app.use(cookieParser());
	//app.route('/').get(function(req,res,next){
	//	res.render('index', {title:'Welcome to ChatBox'});
	//})
	var env = process.env.NODE_ENV || 'development';
		if(env ==='development'){
			app.use(session({secret:config.sessionSecret}))

		}
		else
		{
					app.use(session({
					secret:config.sessionSecret,
					store:new ConnectMongo({
						url:config.dbURL,
						stringify:true
					})
					
					}))

		}
		
		var userSchema = mongoose.Schema({
			username:String,
			password:String,
			fullname:String
		})
		
		var Person = mongoose.model('users',userSchema);
		
		var Sunitha = new Person({
			username:'Sunitha',
			password:'sunitha_123',
			fullname:'Sunitha Anilkumar'
		})
		
		Sunitha.save(function(err){
			console.log('done');
		})
	app.use(passport.initialize());
app.use(passport.session());	
		
	require('./auth/passport.js')(passport,FacebookStrategy,config,mongoose);//since passport return fn , so we invoking here	
	require('./route/route.js')(express , app,passport);
	app.listen(3000,function(){
		console.log('ChatBox working on port 3000');
		console.log("Mode:" +env);
	})