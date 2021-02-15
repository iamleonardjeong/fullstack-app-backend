import mongoose from 'mongoose';

const { Schema } = mongoose;

// 스키마
const PostSchema = new Schema({
  title: String,
  body: String,
  tags: [String], // 문자열로 이루어진 배열
  publishedDate: {
    type: Date,
    default: Date.now, // 현재 날짜를 기본값으로 지정
  },
});

// 모델
// model() 함수를 기본적으로 두 개의 파라미터가 필요
// 첫 번째 파라미터는 스키마 이름, 두 번째 파라미터는 스키마 객체다.
// 데이터베이스는 스키마 이름을 정해 주면 그 이름의 복수 형태로 데이터베이스에 컬렉션 이름을 만든다.
// ex. Post -> posts / BookInfo -> bookinfos
// 이를 따르고 싶지 않다면 세 번째 파라미터에 원하는 이름을 입력하면 된다
// mongoose.model('Post', PostSchema, 'custom_book_collection');
// 이 경우 첫 번째 파라미터로 넣어 준 이름은 나중에 스키마에서 현재 스키마를 참조해야 하는 상황에서 사용
const Post = mongoose.model('Post', PostSchema);
export default Post;
