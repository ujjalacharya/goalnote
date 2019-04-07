const router = require("express").Router();
const mongoose = require("mongoose");
const Idea = require("../../models/Idea");
const { ensureAuthentication } = require("../../helpers/auth");

router.get("/add", ensureAuthentication, (req, res) => {
  res.render("ideas/add");
});

router.post("/", ensureAuthentication, (req, res) => {
  const errors = [];
  if (!req.body.title) {
    errors.push({ text: "Please enter the title" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please enter the description" });
  }
  if (errors.length > 0) {
    res.render("ideas/add", {
      errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newDetails = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };
    new Idea(newDetails).save().then(data => {
      req.flash("success_msg", "Goal idea has been added");
      res.redirect("/ideas");
    });
  }
});

router.get("/", ensureAuthentication, (req, res) => {
  Idea.countDocuments({isCompleted: false}).then(ideasCount => {
    if (ideasCount < 1) {
      res.render("ideas", {
        Nogoals: "No goals listed!"
      });
    } else {
      const perPage = 5;
      const page = req.query.page || 1;
      Idea.find({ user: req.user.id, isCompleted: false })
        .sort({ date: "desc" })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .then(data => {
          data.map((datum, i) =>{
            data[i].check  = new Date(Date.parse(datum.date)).toLocaleDateString();            
          })
          console.log(data[1])
          res.render("ideas", {
            data,
            current: parseInt(page),
            pages: Math.ceil(ideasCount / perPage),
            showPagination: req.query.page ? true : data.length +1 > perPage //send Boolean value to check if pagination should be shown
          });
        })
        .catch(err => console.log(err));
    }
  });
});

router.get("/completed", ensureAuthentication, (req, res) => {
  Idea.countDocuments({isCompleted: true}).then(ideasCount => {
    if (ideasCount < 1) {
      res.render("ideas", {
        Nogoals: "No goals listed!"
      });
    } else {
      const perPage = 5;
      const page = req.query.page || 1;
      Idea.find({ user: req.user.id, isCompleted: true })
        .sort({ date: "desc" })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .then(data => {
            res.render("ideas", {
              data,
              current: parseInt(page),
              pages: Math.ceil(ideasCount / perPage),
              showPagination: req.query.page ? true : data.length +1 > perPage //send Boolean value to check if pagination should be shown
            });
          })
        .catch(err => console.log(err));
    }
  });
});

router.get("/edit/:id", ensureAuthentication, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(data => {
    if (data.user !== req.user.id) {
      req.flash("error_msg", "Not Authorized");
      res.redirect("/ideas");
    } else {
      res.render("ideas/edit", {
        data,
        isCompleted: data.isCompleted ? "checked" : null
      });
    }
  });
});

router.put("/:id", ensureAuthentication, (req, res) => {
  console.log(req.body);
  Idea.findOne({
    _id: req.params.id
  })
    .then(data => {
      (data.title = req.body.title), (data.details = req.body.details);
      data.isCompleted = req.body.isCompleted ? true : false;
      data.save();
    })
    .then(data => {
      req.flash("success_msg", "Video idea has been updated");
      res.redirect("/ideas");
    });
});

router.delete("/:id", ensureAuthentication, (req, res) => {
  Idea.findOneAndRemove({
    _id: req.params.id
  }).then(data => {
    req.flash("success_msg", "Video idea has been deleted");
    res.redirect("/ideas");
  });
});

module.exports = router;
