require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

import api from './api';
import jwtMiddleware from './lib/jwtMiddleware';
// fakedata 생성 함수
import createFakeData from './createFakeData';

const { PORT, MONGO_URI } = process.env;

// DB 연결
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log('Connected to MongoDB');
    // createFakeData();
  })
  .catch((e) => {
    console.error(e);
  });

// Koa의 미들웨어 함수는 두 개의 파라미터를 받는다.
// 첫 번째 파라미터는 ctx라는 값이고 두 번째 파라미터는 next다.
// ctx는 Context의 줄임말고 웹 요청과 응답에 관한 정보를 지닌다.
// next는 현재 처리 중인 미들웨어의 다음 미들웨어를 호출하는 함수 미들웨어를 등록하고 next 함수를 호출하지 않으면, 그 다음 미들웨어를 처리하지 않는다.

const app = new Koa();
const router = new Router();

// 라우터 설정
router.use('/api', api.routes()); // api 라우트 적용

// 라우터 적용 전에 bodyParser 적용
app.use(bodyParser());
app.use(jwtMiddleware);

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
