/*new fb strategy with client secret ,callback url where facebook will complete authorisation and
 also we request fb to provide display name,picture , userid of the user login 
once succesfully complete , call back fn is used to check whether particular profile is already exist or not
if not we will create the user with that profile */

module.exports = function(passport,FacebookStrategy,config,mongoose){
 var chatUser = new mongoose.Schema({
	 profileID:String,
	 fullName:String,
	 profilePic:String
	 
 })
 //convert to model
 var userModel =mongoose.model('chatUser',chatUser);

// used to store reference of user, data is stored in session. user.id is stored ,user.id is not fb id its from mongolab

 passport.serializeUser(function(user,done){
	 done(null,user.id);
 });
 //deserialize to find the user by id  
  passport.deserializeUser(function(user,done){
	 userModel.findByID(id,function(err,user){
		 done(err,user);
	 })
 })

	passport.use(new FacebookStrategy({
		clientID: config.fb.appID,
		clientSecret: config.fb.appSecret,
		callbackURL: config.fb.callbackURL,
		profileFields: ['id','dsiplayName','photos']
	},function(accessToken,refreshToken,profile,done){
		/*check if the user exists in MongoDB
			if not,create user and return the profile
			if the user exists,simply return the profile
		*/
	//matching profile which passport returns with database
	userModel.findOne({'profileID':profile.id},function(err,result){
			if(result){
				done(null,result);
			}else{
				//create a new user in mongolab
				var newchatUser = new userModel)({
					profileID:profile.id;
					fullName:profile.displayName,
					profilePic:profile.photos[0].value || ''
				});
				
				newchatUser.save(function(err){
					done(null,newchatUser);
				})
			}
		}) 
	}))
}
