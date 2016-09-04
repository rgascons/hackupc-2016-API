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

Nginx
-----
[How to serve flask with nginx](https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-uwsgi-and-nginx-on-ubuntu-16-04)

Local testing  
-------------
You will have to launch two servers, the backend server and another one to serve the frontend. Since the frontend has to communicate with the backend (this means you'll be sending requests to a different domain) your browser could show security errors.  

In chrome you could avoid this by launching chrome with the following flags:  

    google-chrome --disable-web-security --user-data-dir="chromedata"  
  
once it is nginx that serves this it won't be necessary

User Manager
------------
In backend/:  

    python useradd.py  
Add user:  

    add <username>
    <follow instructions>  
Delete user:  

    delete <username>

Admins can force states on applications.

# Algorithm usage
In algorithm/:

    python algorithm.py 
There is a initial set of judgements:

    jutges = [
    [{"app_id":"1", "score":"worse"},{"app_id":"2", "score":"better"},{"app_id":"3", "score":"better"},{"app_id":"4", "score":"better"},{"app_id":"5", "score":"better"}],
    [{"app_id":"5", "score":"worse"},{"app_id":"4", "score":"worse"},{"app_id":"3", "score":"worse"},{"app_id":"2", "score":"worse"},{"app_id":"1", "score":"worse"}]
    ]
Resulting on the following result (as expected):

    ['5', '4', '3', '2', '1']

The output is an array with the application ids ordered from better to worse. Remember that this is just a estimation, but in [MM ALGORITHMS FOR GENERALIZED
BRADLEY–TERRY MODELS](http://sites.stat.psu.edu/~dhunter/papers/bt.pdf) they state that there is a unique maximum likelihood estimator, so a higher number of iterations increases the precision of the result.
