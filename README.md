# Application judging  

A little web for judging the applications using relative ratings.

Install  
-------
A install.sh script has been included now, in order to execute the script you need

    * python 2.7
    * pip globally installed

execute it using 
```
bash install.sh
```
on a fresh clone of the repository

Local testing  
-------------
You will have to launch two servers, the backend server and another one to serve the frontend. Since the frontend has to communicate with the backend (this means you'll be sending requests to a different domain) your browser could show security errors.  

In chrome you could avoid this by launching chrome with the following flags:  

    google-chrome --disable-web-security --user-data-dir="chromedata"  
  
once it is nginx that serves this it won't be necessary