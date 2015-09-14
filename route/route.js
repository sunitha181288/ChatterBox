module.exports = function(express , app,passport){
	var router = express.Router();
	
	router.get('/', function(req,res,next){
		res.render('index', {title:'Welcome to ChatBox'});
	})
	
	//function to rediect to login page
	function securePage(req,res,next){
		if(req.isAuthenticated()){
			next();
		}
		else{
			res.redirect('/');
		}
	}
	//to redirect face bookpage and return to app via call back url
	router.get('/auth/facebook',passport.authenticate(facebook));
	router.get('auth/facebook/callback',passport.authenticate('facebook',{
		successRedirect:'/ChatBox',
		failureRedirect:'/'
	}))
	router.get('/chatbox', function(req,res,next){
		res.render('chatbox',{title:'ChatBox',user:req.user});
		
	})
	
	//logout button fn
	router.get('/logout',function(req,res,next){
		req.logout();
		res.redirect('/');
		
	})
	
	app.use('/', router);
}