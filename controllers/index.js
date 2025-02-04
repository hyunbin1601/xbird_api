const {v4: uuidv4} = require('uuid');
const {User, Domain} = require('../models');

exports.renderLogin = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id:req.user?.id || null },
            include: { model: Domain },
        });
        res.render('login', {
            user,
            domains: user?.Domains,
        });
    }
    catch (error) {
        console.error(error);
        next(error); // 에러 처리 미들웨어로 넘김 -> app.js의 에러 처리 미들웨어로 넘어감
    }
}

exports.createDomain = async (req, res, next) => {
    try {
        await Domain.create({
            UserId: req.user.id,
            host: req.body.host,
            type: req.body.type,
            clientSecret: uuidv4(),
        })
        res.redirect('/');
    }
    catch (error) {
        console.error(error)
        next(error) // app.js의 에러처리 미들웨어로 넘김
    }
}