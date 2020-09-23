# code-battle server

## API

### auth
/login/[POST]  
/logout/[POST]  
/registration/[POST]  

### task
/tasks/[GET]  
/task/{id}/[GET]  
/task/{id}/edit/[POST]  
/task/test/[POST]  
/task/check/[POST]  
/task/add/[POST]  
/task/submit/[POST]  

### user
/users/[GET]
/user/{login}/[GET, POST]  
/user/{login}/task/solved/[GET]  
/user/{login}/task/added/[GET]  

### solution
/solution/{id}/[GET]  
/solution/task/{id}/[GET]  
/solution/liked/:login/[GET]  
/solution/like/[POST]  

### upload
/upload/[POST]  

### version
/version/[GET]

### statistics
/system/ram/[GET]
/system/cpu/[GET]
/system/info/[GET]
/system/app/[GET]