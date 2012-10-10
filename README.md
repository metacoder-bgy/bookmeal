# Introduction
Bookmeal is a project that helps students in Guangdong Contry Garden
School to book their monthly meal conveniently.

Demo: http://bgy.xxx/tools/bookmeal/

# Setting Up
_Note this project is just for fixed request format of CGS only._

Requirements:

* PHP server environment
* Ruby CGI page server env
* Discuz! forum system

Steps:

1. put the client directory into a php script executable
   directory.(below Discuz! root dir is recommended.)
2. put the the server into any cgi-bin dir.
3. Adjust the `DB_FILE` in `server/dbaccess.rb` to a filename below
   reead-writable dir.
4. Adjust the global variable `request_url` in `client/js/script.js`
   to the corresponding `request.cgi` of the server.
5. Hard code `SITE_ROOT` to the `client/js/index.php`.


# Usage
For normal user, there are kind of operations:

1. Login -> Fill the card numbers & passwords -> Save -> Book
2. Just fill the info -> Book


# License
[WTFPL](http://sam.zoy.org/wtfpl/)

# Copyright
Copyright (c) 2012, Shou & Rix.




