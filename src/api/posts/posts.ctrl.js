import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from 'joi';

// 포스트의 인스턴스를 만들 때는 new 키워드를 사용 그리고 생성자 함수의 파라미터에 정보를 지닌 객체를 넣는다.
// 데이터 저장 - save() 함수를 실생시켜야 DB에 저장된다.
// 데이터 조회 - 모델 인스턴스의 find() 함수를 사용 find() 함수를 호출한 후에는 exec()를 붙여 주어야 서버에 쿼리를 요청한다.
// 특정 데이터 조회 - findById() 함수를 사용
// remove() - 특정 조건을 만족하는 데이터를 모두 지운다.
// findByIdAndRemove(): id를 찾아서 지운₩₩다.
// findOneAndRemove(): 특정 조건을 만족하는 데이터 하나를 찾아서 제거
// findByIdAndUpdate(): 데이터를 업데이트. 첫 번째 파라미터는 id, 두 번째 파라미너틑 업데이트 내용, 세 번째 파라미터는 업데이트의 옵션
// find() 함수에 exec() 함수를 붙여주어야 서버에 쿼리를 요청한다.
// sort() 함수로 내림차순 정렬
// limit() 함수로 보이는 개 수 제한
// skip() 페이지 기능 구현

const { ObjectId } = mongoose.Types;

// 500 오류는 보통 서버에서 처리하지 않아 내부적으로 문제가 생겼을 때 발생한다.
// 잘못된 id를 전달했다면 클아이언트가 요청을 잘못 보낸 것이니 400 Bad Request 오류를 띄워 주는 것이 맞다.
// 그러려면 id 값이 올바른 ObjectId인지 확인해야 한다.
// 이를 검증하기 위한 미들웨어 함수 생성
export const checkObjectId = (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }
  return next();
};

/*
  POST /api/posts
  {
    title: '제목',
    body: '내용',
    tags: ['태그1', '태그2']
  }
*/
export const write = async (ctx) => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    title: Joi.string().required(), // required()가 있으면 필수 항목
    body: Joi.string().required(),
    tags: Joi.array() //
      .items(Joi.string())
      .required(), // 문자열로 이루어진 배열
  });

  // 검증 후 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body,
    tags,
  });
  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  GET /api/posts
*/
export const list = async (ctx) => {
  // query는 문자열이기 때문에 숫자로 변환해야 한다.
  // 값이 주어지지 않았다면 1을 기본으로 사용
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    // find() 함수에 exec() 함수를 붙여주어야 서버에 쿼리를 요청한다.
    // sort 함수로 내림차순 정렬
    // limit 함수로 보이는 개 수 제한
    const posts = await Post.find() //
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .exec();

    const postCount = await Post.countDocuments().exec();
    // 커스텀 HTTP 헤더
    ctx.set('Last-Page', Math.ceil(postCount / 10));

    ctx.body = posts //
      .map((post) => post.toJSON())
      .map((post) => ({
        ...post,
        body:
          post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
      }));
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  GET /api/posts/:id
*/
export const read = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await Post.findById(id).exec();
    if (!post) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  DELETE /api/posts/:id
*/
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  PATCH /api/posts/:id
  {
    title: '수정',
    body: '수정 내용',
    tags: ['수정', '태그']
  }
*/
export const update = async (ctx) => {
  const { id } = ctx.params;

  // write에서 사용한 schema와 비슷하지만 required()가 없다.
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  // 검증 후 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true, // 이 값을 설정하면 업데이트된 데이터를 반환한다.
      // false일 때는 업데이트되기 전의 데이터를 반환
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
