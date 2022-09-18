const { json } = require('body-parser');
const Question = require('../models/user');
const Answer = require('../models/answer');
const Login = require('../models/login');
const login = require('../models/login');
const bcrypt = require("bcrypt");

exports.mainPage = (req, res, next) => {
    // console.log(req.query.name);
    // console.log(req.session.user.email);
    if (req.session.isLoggedin) {
        const userID = req.session.user.email;
        Login.find({ email: userID }).then((result) => {
            // console.log(result[0].image);
            res.render("userView/main", {
                path: "/",
                pageTitle: "THE GURU",
                isAuthen: req.session.isLoggedin,
                data: result[0]
            })
        }).catch(err => console.log(err));
    }
    else {
        res.render("userView/main", {
            path: "/",
            pageTitle: "THE GURU",
            isAuthen: req.session.isLoggedin
        })
    }
};

exports.getsignup = (req, res, next) => {


    res.render('userView/signup.hbs', {
        path: "/signup",
        pageTitle: "Signup-Form",
        isAuthen: req.session.isLoggedin
    })

};
exports.postsignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const image = req.file;
    const pic = image.path;
    // console.log("image" , image);
    // console.log("image" , email);
    // console.log("image" , password);
    login.findOne({ email: email })
        .then(userdoc => {
            if (userdoc) {
                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12).then(hashPassword => {
                const user = new Login({ email: email, password: hashPassword, image: pic });
                return user.save();
            })
                .then(result => {
                    res.redirect('/login');
                });

        })

        .catch(err => console.log(err));


    // res.send(`<h1>${email}</h1>
    // <h1>${password}</h1>`)
};
exports.getdiscuss = (req, res, next) => {
    if (req.session.isLoggedin) {
        const userID = req.session.user.email;
        Login.find({ email: userID }).then((result) => {
            // console.log(result[0].image);
            res.render("userView/discuss", {
                path: "/discuss",
                pageTitle: "Discuss Mode",
                isAuthen: req.session.isLoggedin,
                data: result[0]
            })
        }).catch(err => console.log(err));
    }
    else {
        res.render("userView/discuss", {
            path: "/",
            pageTitle: "THE GURU",
            isAuthen: req.session.isLoggedin
        })
    }


};

exports.getLanguage = (req, res, next) => {
    const Lname = req.query.Lname;

    if (req.session.isLoggedin) {
        const userID = req.session.user.email;
        // const newuserID = userID.split('@');
        // console.log(newuserID);

        Login.find({ email: userID }).then((result1) => {
            const profile = result1[0].email.split('@');
            // console.log(profile[0]);
            Question.find({ language: Lname })
                .then(result => {
                    // console.log("question", result)
                    res.render("userView/thread", {
                        mainheading: Lname,
                        path: `/category?Lname=${Lname}`,
                        pageTitle: `${Lname} Question`,
                        ques: result.reverse(),
                        isLength: result.length > 0,
                        isAuthen: req.session.isLoggedin,
                        data: result1[0]

                    })
                }).catch(err => console.log(err));

        }).catch(err => console.log(err));
    }
    else {
        res.render("userView/discuss", {
            path: "/",
            pageTitle: "THE GURU",
            isAuthen: req.session.isLoggedin
        })
    }






};


exports.postLanguage = (req, res, next) => {
    const Lname = req.query.Lname;
    const ques = req.body.question;
    const userID = req.session.user.email;

    // console.log(req.query.Lname);
    // console.log(ques);
    const question = new Question({ question: ques, language: Lname, user: userID });

    question.save().then(result => {
        // console.log('question inserted');
        res.redirect(`/category?Lname=${Lname}`);
    })
        .catch(err => console.log(err));
    // console.log(question);

};

exports.getQuestion = (req, res, next) => {
    const qID = req.params.questionID;

    if (req.session.isLoggedin) {
        const userID = req.session.user.email;
        Login.find({ email: userID }).then((result1) => {

            Question.findById(qID).then(result => {

                Answer.find({ id: result._id.toString() }).then(result2 => {


                    res.render("userView/questions", {
                        pageTitle: "Question",
                        ques: result,
                        ans: result2,
                        isLength: result2.length > 0,
                        isAuthen: req.session.isLoggedin,
                        data: result1[0]
                    })
                })
                    .catch(err => console.log(err));

                // console.log(result);
            }).catch(err => console.log(err));

        }).catch(err => console.log(err));
    }
    else {
        res.render("userView/main", {
            path: "/",
            pageTitle: "THE GURU",
            isAuthen: req.session.isLoggedin
        })
    }



    // res.render('userView/questions');

};


exports.postANS = (req, res, next) => {
    const qID = req.params.questionID;
    const ans = req.body.answer;
    const answer = new Answer({ id: qID, answer: ans });
    answer.save().then(result => {
        // console.log('answer inserted');
        res.redirect(`/loadQuestion/${qID}`);
    })
        .catch(err => console.log(err));

};



exports.getlogin = (req, res, next) => {
    const isLoggedin = true;
    res.render('userView/login', {
        path: '/login',
        isAuthen: req.session.isLoggedin
    });

};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    Login.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(domMatch => {
                    if (domMatch) {
                        req.session.isLoggedin = true;
                        req.session.user = user;
                        return req.session.save((err => {
                            console.log(err);
                            res.redirect('/');
                        }))
                        res.redirect('/');
                    }
                    res.redirect('/login');
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));


};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    })
};

exports.getquestion = (req, res, next) => {

    if (req.session.isLoggedin) {
        const userID = req.session.user.email;
        Login.find({ email: userID }).then((result1) => {
            Question.find({ limit: 20 })
                .then(result => {

                    res.render('userView/allQ', {
                        pageTitle: "Trending Question",
                        path: "questions",
                        ques: result,
                        isLength: result.length > 0,
                        isAuthen: req.session.isLoggedin,
                        data: result1[0]

                    })
                })
                .catch(err => console.log(err));

        }).catch(err => console.log(err));
    }
    else {
        Question.find({ limit: 20 })
            .then(result => {

                res.render('userView/allQ', {
                    pageTitle: "Trending Question",
                    path: "questions",
                    ques: result,
                    isLength: result.length > 0,
                    isAuthen: req.session.isLoggedin

                })
            })
            .catch(err => console.log(err));
    }




}