import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';

const posts = new Router();

posts.get('/', postsCtrl.list);
posts.post('/', postsCtrl.write);
posts.get('/:id', postsCtrl.checkObjectId, postsCtrl.read);
posts.delete('/:id', postsCtrl.checkObjectId, postsCtrl.remove);
posts.patch('/:id', postsCtrl.checkObjectId, postsCtrl.update);

export default posts;

// 아래처럼 리팩토링 할 수 있다.
// import Router from 'koa-router';
// import * as postsCtrl from './posts.ctrl';

// const posts = new Router();

// posts.get('/', postsCtrl.list);
// posts.post('/', postsCtrl.write);

// const post = new Router(); // /api/posts/:id

// post.get('/', postsCtrl.read);
// post.delete('/', postsCtrl.remove);
// post.patch('/', postsCtrl.update);

// posts.use('/:id', postsCtrl.checkObjectId, post.routes());

// export default posts;
