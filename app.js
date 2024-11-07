const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const morgan = require('morgan')    
const session = require('express-session')
const nunjucks = require('nunjucks')  // nunjucks는 템플릿 엔진, HTML을 렌더링할 때 사용
const dotenv = require('dotenv') 

dotenv.config() // dotenv를 사용해 환경변수를 로딩

const authRouter = require('./routes/auth')
const indexRouter = require('./routes/index') // indexRouter는 메인 페이지 라우터, 인덱스 페이지를 렌더링
const { sequelize } = require('./models')  // 시퀄라이즈 연결 객체를 가져옴
const passportConfig = require('./passport') // 패스포트 설정을 가져옴

const app = express()
passportConfig()
app.set('port', process.env.PORT || 8003);
app.set('view engine', 'html'); // 템플릿 엔진을 html로 설정, 이 의미는 렌더링할 파일이 html로 끝나는 파일이라는 뜻
nunjucks.configure('views', {
  express: app,
  watch: true,
}); // nunjucks 설정, views 폴더를 템플릿 파일들이 있는 폴더로 설정, 여기에 있는 HTML 파일들을 렌더링
sequelize.sync({ force: false }) // force: false로 설정해 서버 실행 시 테이블을 재생성하지 않도록 설정
  .then(() => {
    console.log('connect');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev')) // 개발 시 morgan을 사용해 요청과 응답을 기록
// morgan은 로그를 기록하는 미들웨어, dev 모드로 설정해 개발 시 기록을 자세히 남김
app.use(express.static(path.join(__dirname, 'public')));
// 정적 파일을 제공하는 미들웨어, app.use('요청 경로', express.static('실제 경로'))로 사용
app.use(express.json)  // JSON 형식의 데이터를 받을 때 사용
app.use(express.urlencoded({ extended: false })); // form 형식의 데이터를 받을 때 사용, extended: false는 urlencoded 모듈 사용 시 querystring 모듈을 사용 -> 무슨 의미임? -> urlencoded 모듈을 사용해 쿼리스트링을 해석
app.use(cookieParser(process.env.COOKIE_SECRET)); // 요청에 동봉된 쿠키를 해석
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
})); // 세션 관리용 미들웨어, req.session 객체를 사용할 수 있게 함
// secret의 process.env.COOKIE_SECRET은 쿠키를 임의로 변조하는 것을 막기 위한 값, 쿠키를 서명하는 데 사용, 비밀키, 어디에 쓰이는 값? 어떻게 쓰임? 
app.use(passport.initialize()); // req 객체에 passport 설정 -> login, logout 라우터에서 passport.authenticate 메서드를 호출하면 여기서 로그인 전략을 수행
app.use(passport.session()); // req.session 객체에 passport 정보 저장, req.session 객체는 express-session에서 생성

app.use('/', indexRouter) // 라우터를 연결하는 부분, app.use('요청 경로', 라우터)로 연결
app.use('/auth', authRouter)

app.use((req, res, next) => {
    const error = new Error(
        `${req.method} ${req.url} no router`,
    )
    error.status = 404; // 404 상태 코드로 응답, 에러 처리 미들웨어는 에러가 발생한 경우 next에 인수를 넣어 호출
    next(error); 
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
})

app.listen(app.get('port'), () => {
    console.log(app.get('port'))
})