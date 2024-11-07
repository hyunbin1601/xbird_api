const passport = require('passport');
const localStrategy = require('passport-local').Strategy; // passport-local 모듈에서 stratge를 가져옴

const bcrypt = require('bcrypt'); 
const User = require('../models/user') // db의 model에서 user의 값을 가져온다

module.exports = () => {
    passport.use(new localStrategy({
        userNameField: 'email',
        passwordField: 'password',
        passReqToCallback: false, 
    }, async (email, password, done) => {
        try {
            const exUser = await User.findOne({where: {email}}); // 이메일 기준으로 기존 유저를 찾음
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password); // password 비교
                if (result) {
                    done(null, exUser); // done 함수의 두번째 인자로 사용자 정보인 exUser를 넣어보냄
                }
                else {
                    done(null, false, {message: 'password is not correct'});
                } // done 함수에서 첫번째 인자(우리가 넣은 null)를 사용하는 경우는 서버에서 에러(500번대 에러)가 발생했을 경우이다
                // 3번째 인자를 사용하는 경우는 클라이언트 단의 에러가 발생했을 경우이다!
            } else {
                done(null, false, {message: 'User cannot find'})
            } 
        } catch (err) {
            console.error(err)
            done(err); // done 함수가 의미하는게 뭐죵...?
        }
    }));
}; // done은 passport.authenticate의 콜백 함수
// 콜백 함수란? -> 전달 인자로서 다른 함수에 전달되는 함수를 의미한다, 즉 done은 passport.authenticate 함수에 전달되는 함수인 셈!