# AuctioneerSignUp

If you need to share your current progress with FOH, do this:

```
ssh forge@clean-pond
# or ssh forge@clean-pond.sharpauctionengine.com

cd ~/clean-pond.sharpauctionengine.com

git pull
```

Then share this url

http://clean-pond.sharpauctionengine.com/


######$ ``sudo nano /etc/nginx/nginx.conf``

```
server {
    listen 80 ;
    
    server_name www.auctioneersignup.com  ;
   

    root /home/forge/www.auctioneersignup.com/public;
    
    index index.html;

    charset utf-8;

    
    location / {
        try_files $uri $uri/ /index.html?$query_string;
    }

    location /auctioneer-signup/submit {
            proxy_pass http://localhost:3002;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
    }

    location ~* \.(png|jpg|jpeg|gif|ico)$ {
        access_log off;
        log_not_found off;
        expires 1y;
    }

    ## Block download agents
    if ($http_user_agent ~* LWP::Simple|wget|libwww-perl) {
        return 403;
    }
    ## Block some nasty robots
    if ($http_user_agent ~ (msnbot|Purebot|Baiduspider|Lipperhey|Mail.Ru|scrapbot) ) {
        return 403;
    }
}
```

######$ ``sudo nano /etc/supervisor/conf.d/auctioneersignup.conf``

```
[program:auctioneersignup]
command = node app.js --production
directory = /home/forge/www.auctioneersignup.com
user = forge
autostart = true
autorestart = true
stdout_logfile = /var/log/supervisor/auctioneersignup.log
stderr_logfile = /var/log/supervisor/auctioneersignup_err.log
```

```
supervisorctl reread
supervisorctl update

supervisorctl start auctioneersignup
supervisorctl stop auctioneersignup
```
###### Copy the ``.envExample`` file to ``.env``

 * fill in the details
 * use a Mandrill API key that has only messages.send permission
 * make sure that ``config/config.json`` has the correct DB details for your environment

###### Run Database migration

$ ``sequelize db:migrate --env=production``


###### Test locally

$ ``curl -X POST localhost:3002/signup --data "email=myemail@email.com" -v && echo ''``
