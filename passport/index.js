const passport = require('passport'); //  패스포트 모듈 호출
const local = require('./localStrategy'); // 로컬 로그인 전략 호출
const kakao = require('./kakaoStrategy'); // 카카오톡 로그인 전략 호출
const User = require('../models/user'); // 유저 모델 호출

module.exports = () => {
    passport.serializeUser((user, done) => {  // 로그인 시 실행, req.session 객체에 어떤 데이터를 저장할지 정하는 메소드, done은 함수, user는 매개변수
        done(null, user.id); // 세션에 user.id만 저장, 여기서 매개변수 user는 로그인 사용자 정보 객체
    }) // serializeUser는 user 객체에서 user.id만 req.session에 저장하도록 하고, deserializeUser는 user.id를 통해 user 객체를 불러오는 구조
    // 세션에 불필요한 정보 데이터 저장 방지

    passport.deserializeUser((id, done) => {  // 각 요청 시에만 실행됨, req.session 미들웨어가 해당 메소드 호출
        User.findOne({
             where: { id },
             include: [{
                 model: User,
                 attributes: ['id', 'nickname'],
                 as: 'Followers',
             }, {
                 model: User,
                 attributes: ['id', 'nickname'],
                 as: 'Followings',
             }], 
            })  // id는 user.id를 넘겨받음, user.id가 일치하는 user를 done을 통해 찾아서 user 객체를 끄집어냄
            .then(user => done(null, user))
            .catch(err => done(err));
    });
    // 미들웨어는 요청이 라우터에 도달하기 전에 가로채서 요청에 정보를 설정한 후 라우터에게 전달함
    local();
    kakao();
}


