const express = require('express');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { register, login, logout } = require('../controllers/auth');

const router = express.Router();

// 미들웨어는 클라이언트 요청과 라우터 중간에 위치하여 요청/응답을 중간에 가로채서 이를 이용해 다양한 작업을 수행하는 함수
// 라우터는 클라이언트 요청에 대한 적절한 응답을 보내주는 핸들러 ex> get, head, post, put, delete etc...

// 회원가입 라우터
router.post('/register', isNotLoggedIn, register);  // isNotLoggedIn 미들웨어를 거친 후(next()를 통해 res.render가 있는 미들웨어로 넘어가야함) register 컨트롤러 실행

// login router
router.post('/login', isNotLoggedIn, login); // isNotLoggedIn 미들웨어를 거친 후(next()를 통해 res.render가 있는 미들웨어로 넘어가야함) login 컨트롤러 실행

// logout router
router.get('/logout', isLoggedIn, logout); // isloggedin 미들웨어를 거친 후(next()를 통해 res.render가 있는 미들웨어로 넘어가야함) logout 컨트롤러 실행

// get -> /auth/kakao 라우터
router.get('/kakao', passport.authenticate('kakao')); // passport.authenticate('kakao')를 실행하는 라우터, kakaoStrategy를 실행

// get -> /auth/kakao/result 라우터
router.get('/kakao/result', passport.authenticate('kakao', {
    failureRedirect: '/?error=kakaoFailure',
}), (req, res) => {
    res.redirect('/'); // 카카오 로그인 성공 시 메인 페이지로 이동
});

module.exports = router; // router를 모듈로 내보냄