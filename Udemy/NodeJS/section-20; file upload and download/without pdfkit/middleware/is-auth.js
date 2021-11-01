// route protection code
/* 
    ? how?
    this middleware will be put into the argument on every router.get()/post() argument
    because they can have more than one handler and they will be executed from left (second argument)
    to the next one in the right
*/
module.exports = (req,res,next) => {
    if(!req.session.isLoggedIn){
        return res.redirect('/login')
    }
    next();
}