const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();

//load Helper
const {ensureAuthenticated} = require('../helpers/auth');

// mongoose load file

require('../models/Ideas');
const Idea = mongoose.model('ideas');

//Edit Idea
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    Idea.findOne({_id : req.params.id})
        .then(ideas=>{
            if(ideas.user != req.user.id){
                req.flash('error_msg',"You are Not authenticated");
                res.redirect('/ideas/view')
            }else{
            res.render('./ideas/edit',{
                ideas : ideas
             });
            }
        })
    
})

// add Idea
router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render('./ideas/add')
});


// View Idea
router.get('/view',ensureAuthenticated,(req,res)=>{
    Idea.find({user : req.user.id})
        .sort({date : 'desc'})
        .then(ideas => {
             res.render('./ideas/view',{
                 ideas : ideas
             })
        })
   
});

// handel Post

router.post('/',ensureAuthenticated,(req,res)=>{
    var errors = [];
    if(!req.body.title){
        errors.push({text : "please Enter a title"});
    }
    if(!req.body.description){
        errors.push({text : "please Enter a description"});
    }
    if(errors.length > 0){
        res.render('./ideas/add',{
            title : req.body.title,
            description : req.body.description,
            errors : errors
        })
    }
    else{
        const newPost = {
            title : req.body.title,
            description : req.body.description,
            user : req.user.id
        }
        new Idea(newPost).save()
            .then(idea =>{
                req.flash('success_msg',"Idea Successfully Added")
                res.redirect('/ideas/view')
            })
    }
})
// Edit Route
router.put('/:id',ensureAuthenticated,(req,res)=>{
    Idea.findOne({
        _id: req.params.id
    }).then(idea=>{
        req.flash('success_msg',"Idea Successfully Updated")
        idea.title = req.body.title;
        idea.description = req.body.description;

        idea.save().then(idea => {
            res.redirect('/ideas/view')
        });
    })
})

// Delete Route
router.delete('/:id',ensureAuthenticated,(req,res)=>{
   Idea.remove({
       _id : req.params.id
   }).then(()=>{
       req.flash('success_msg',"Idea Successfully Removed")
       res.redirect('/ideas/view')
   })
})


module.exports = router;