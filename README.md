## <b>api 요청</b>

<hr />

인증 - auth

```js
회원가입
POST /api/auth/register
{
  username: 'username',
  password: 'password'
}
```

```js
로그인
POST /api/auth/login
{
  username: 'username',
  password: 'password'
}
```

```
로그인 상태 확인
GET /api/auth/check
```

```
로그아웃
POST /api/auth/logout
```
