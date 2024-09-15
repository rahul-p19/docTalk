# Authentication
|methods|path|header|body| return |
|---|---|---|---|---|
|POST | /auth/signup||email,uname,password|
|POST | /auth/login||email,password| msg, jwtToken|
|GET | /auth/jwtChecking|authorization|| msg |



|methods|path|header|body| return |
|---|---|---|---|---|