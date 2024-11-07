const bcrypt = require('bcryptjs');
const passport = require('passport');   

const User = require('../models/user');

exports.register = async (req, res, next) => {
    const { email, nickname, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            return res.redirect('/register?error=exist');  // 쿼리값으로 error => 프론트에서 조건문으로 처리
        }
        const hash = await bcrypt.hash(password, 12); // 비밀번호 암호화
        await User.create({
            email,
            nickname,
            password: hash,
        });
        return res.redirect('/');
    }
    catch (error) {
        console.error(error);
        return next(error);  // 에러 처리 미들웨어로 넘김(next)
    }
}

exports.login = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError); // 에러 처리 미들웨어로 넘김(next) -> 정확히 어디로 가냐??,,, -> app.js의 에러 처리 미들웨어로 넘어간다
            }
            return res.redirect('/');
        });
    }) (req, res, next);  // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙여줌 -> 왜냐하면 passport.authenticate는 미들웨어이기 때문
}

exports.logout = (req, res) => {
    req.logout();
    req.session.destroy(); // 세션 정보를 지움
    res.redirect('/'); // 메인 페이지로 리다이렉트
} 

// 나중에 app.js와 연결할 때 /auth 접두사를 붙일 것이므로, 라우터의 주소는 각각 /auth/register, /auth/login, /auth/logout이 됨