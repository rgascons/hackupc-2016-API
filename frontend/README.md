Install
-------

-Install Nodejs
(In frontend/)
> npm install  
> npm -g install bower  
> bower install  
> npm -g install gulp  
(lists available tasks:)  
> gulp   

Use
---

Use 'gulp auto' for development: generates a development build in dist/ and listens for file changes. (Optional: install local-web-server and use 'ws' inside dist)  
Use 'gulp build' to create a production build (in frontend/dist).

Deploy
------

To deploy, update the API_URL (services.js) to the API's base URL and execute 'gulp build'
