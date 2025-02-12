HOW TO INSTALL MAILLOG

prerequisites : LAMP server with php7.4+ mysql mariadb10+ or mysql 5.7+

1. copy this folder into you web hosting and modify the mysql_credentials.php file inside lpslt/php/ for the needs of your mysql installation

2. give the writing rights to the following files and folders :

lpslt/load

lpslt/temp

lpslt/upload

lpslt/media/logo.png

// the three last are for the logo customization, and are not required if you don’t intend to put your logo to the app.

4. import the sql dump file, AFTER having modified the super admin password BEWARE OR ITS A SECURITY ISSUE IF YOU DON’T MODIFY IT.

5. do the following redirection rules under your server :

   NGINX :

   rewrite ^/([a-zA-Z0-9-]+)$ /?page=$1 last;

   APACHE :

   RewriteEngine On

   RewriteBase /

   RewriteCond "%{REQUEST_URI}" "\/[a-zA-Z0-9-]+$" 

   RewriteRule "(.*)" "/index.php?page=$1&%{QUERY_STRING}" [NE]

7. login with the credentials you have set into the sql file.
ENJOY monitoring your emails…
There will be improvements I hope, letting for example offer the choice of launching a distant script for some matches inside mails.
