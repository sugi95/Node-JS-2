const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//user model

require('../models/users');
const Users = mongoose.model("users")

//routes
router.get('/login', (req,res)=>{
    res.render('../views/users/login')
})
//register Form
router.get('/register',(req,res)=>{
    res.render('../views/users/register')
})
//Login POST

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect : '/ideas/view',
        failureRedirect : '/users/login',
        failureFlash : true
    })(req,res,next);
})

//Register Post
router.post('/register',(req,res)=>{
    var errors = [];
    if(req.body.password != req.body.confirmPassword){
        errors.push({text : "Passwords do not Match"})
    }
    if(req.body.password.length < 4){
        errors.push({text : "Please enter password greater than 4 characters"})
    }
    if(errors.length>0){
        res.render('../views/users/register',{
            errors : errors,
            name : req.body.name,
            email : req.body.email,
        })

    }
    else{
        Users.findOne({email : req.body.email})
            .then(user=>{
                if(user){
                    req.flash('error_msg',"The entered email was already registered");
                    res.redirect('/users/register');
                }else{
                    const newUser = new Users ({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        })
        bcrypt.genSalt(10,(err,salt)=>{
            if(err){
                throw err;
            }
            else{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err){
                        throw err;
                    }else{
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg',"User Account Registered Successfully");
                                res.redirect('/users/login');
                            })
                            .catch(err=>{
                                console.log(err);
                                req.flash('error_msg',"Sorry Somthing went wrong Please try again")
                            })
                    }
                })
            }
        })
                }
            })
    }
})
// Logout
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg',"Logged Out Successfully");
    res.redirect('/users/login')
})
module.exports = router;