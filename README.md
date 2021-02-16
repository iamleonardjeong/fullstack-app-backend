## <b>api 요청</b>

인증 - auth

```
회원가입
POST
/api/auth/register
{
  username: 'username',
  password: 'password'
}
```

```
로그인
POST
/api/auth/login
{
  username: 'username',
  password: 'password'
}
```

```
로그인 상태 확인
GET
/api/auth/check
```

```
로그아웃
POST
/api/auth/logout
```

포스트 - posts

```
포스트 작성
POST
/api/posts
{
  title: 'title',
  body: 'contents',
  tags: ['tag1', 'tag2']
}
```

```
포스트 리스트
GET
/api/posts?username=&tag=&page=
parameter is not required, your choice
```

```
포스트 읽기
GET
/api/posts/:id
```

```
포스트 삭제
DELETE
/api/posts/:id
```

```
포스트 수정
PATCH
/api/posts/:id
```
