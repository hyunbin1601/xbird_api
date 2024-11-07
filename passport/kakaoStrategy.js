const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user'); // db의 model에서 user의 값을 가져온다
module.exports = () => {
    passport.use(new kakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/result',  // 인증 결과를 받아올 라우터
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile: ', profile);
        try {
            const exUser = await User.findOne({
                where: {snsId: profile.id, provider: 'kakao'}  // snsId와 provider가 일치하는 유저가 있는지 확인, 이건 어디서 나온거지? -> kakaoStrategy의 콜백함수의 두번째 인자로 넘어온 profile에서 나온거임
            });
            if (exUser) {
                done(null, exUser); // done 함수의 두번째 인자로 사용자 정보인 exUser를 넣어보냄, done 함수는 passport.authenticate의 콜백 함수로, passport.authenticate의 두번째 인자로 넘어온다
            } else {  // done 함수의 역할은 뭐지? -> passport.authenticate의 콜백 함수, 정확히는 passport.authenticate의 두번째 인자로 넘어가는 함수, done 함수의 첫번째 인자는 서버에서 에러가 발생했을 때, 두번째 인자는 사용자 정보를 넣어주는 역할
                const newUser = await User.create({
                    email: profile._json?.kakao_account?.email,  // 일단 옵셔널 체이닝 문법 사용, 잘 작동 안돼면? -> profile._json && profile._json.kakao_account_email
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao'
                });
                done(null, newUser);
            }
        } catch (err) {
            console.error(err);
            done(err);
        }
    }));
}