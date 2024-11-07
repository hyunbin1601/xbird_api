exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {  // 로그인 여부를 판단하는 메소드
        next();
    } 
    else {
        res.status(403).send('Please log in first');
    }
}; // 로그인한 사용자만 접근 가능한 라우터 설정 

// 로그인이 안되어 있을 경우
exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) { // false인 경우
        next(); // 로그인이 안되어 있을 경우 다음 미들웨어로 넘어감
    }
    else {
        const message = encodeURIComponent('You are already logged in');
        res.redirect(`/?error=${message}`);  // 로그인이 되어 있을 경우 메인 페이지로 리다이렉트, ?error는 에러 메시지를 뜻함, 어떻게 처리할지는 프론트에서 결정
    }
}

// 회원가입 라우터 설정 <- 로그인한 사용자는 접근해서는 안됨!