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
/user/{login}/basic/[GET]  
/user/{login}/advanced/[GET]  
/user/{login}/task/solved/[GET]  
/user/{login}/task/added/[GET]  
/user/{login}/update/settings//[POST]  
/user/{login}/update/advanced/[POST]  

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