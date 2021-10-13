exports.getLogin = (req, res, next)=>{
    // const isLoggedIn = req.get('Cookie') // getting the cookie header
    // .split('=')[1]  === 'value' // spliting it and turning it into an array , getting the second index to get the value

    res.render('auth/login',{
        path: '/login',
        pageTitle: 'Login',
        isLoggedIn: req.session.isLoggedIn
    })
}

exports.postLogin = (req, res, next)=>{
    // req.isLoggedIn = true;
    // res.setHeader('Set-Cookie', 'loggedIn=true') // setting cookie
    
    // storing new session called loggedIn
    // the session object is added by the middleware in the app.js
    // this will store it to memory
    req.session.isLoggedIn = true;
    res.redirect('/');
}


exports.postLogout = (req, res, next) => {
    // clearing the session
    // destroy method is provided by the session package
    req.session.destroy(err => {
      // after the session destroyed
      console.log(err);
      res.redirect('/');
    });
  };