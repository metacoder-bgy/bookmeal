<?php
define('SITE_ROOT', substr(dirname(__FILE__), 0, -14));
include_once(SITE_ROOT.'source/class/class_core.php');
$discuz = & discuz_core::instance();
$discuz->init_cron = false;
$discuz->init_session = false;
$discuz->init();

//print_r($_G);

$forum_username = $_G['username'];

$forum_uid = $_G['uid'];

$forum_formhash = $_G['formhash'];

$forum_is_login = ( $forum_uid > 0 );

//var_dump($forum_uid, $forum_username, $forum_is_login);

function detect_ie(){
  if(isset($_SERVER['HTTP_USER_AGENT']) &&
     (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== false))
    return true;
  else
    return false;
}

if (detect_ie()){
?>

  <!DOCTYPE html>
  <html>
    <head>
      <title>Internet Explorer is not supported.</title>
    </head>
    <body>
    <h1>Choose browsers below for better experience.</h1>
    <hr />
    <p>
      <ul>
	<li><a href="http://www.google.com/chrome/">Google Chrome</a></li>
	<li><a href="http://www.mozilla.org/en-US/firefox/new/">Firefox</a></li>
      </ul>
    </p>
    <hr />
    <p>
      <a href="http://robertnyman.com/2009/09/09/fuck-ie-gently/">Why not IE?</a>
    </p>
    </body>
  </html>

<?php
  exit();
}
?>



<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh-CN" lang="zh-CN">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<meta name="Author" content="bgy.xxx" />
	<meta name="viewport" content="width=1024" />
	<link id="global-stylesheet" rel="stylesheet" href="css/style.css" type="text/css" />

	<title>Meal System - CGS Tools</title>
	<meta name="Keywords" content="订餐 碧桂园 学校 Meal System CSG BGY" />
	<meta name="Description" content="学生自助一键订餐系统，方便碧桂园学校学生集体订餐。" />
	<link rel="home" href="http://bgy.xxx/" />
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
	<script type="text/javascript" src="js/jquery.easing.1.3.js"></script>
	<script type="text/javascript" src="js/script.js" charset="utf-8"></script>
</head>
<body>
	<script type="text/javascript">
		forum_uid = <?php echo($forum_uid); ?>;
		forum_username = '<?php echo($forum_username); ?>';
	</script>
	<div id="wrap">
		<h1>Meal System - CGS Tools</h1>
			<?php if($forum_is_login){?>
			<div id="welcome_panel">
				<p>Welcome, <?php echo($forum_username);?>!</p>
			</div>
			<?php }else{ ?>
			<div id="login_panel">
				<form method="post" autocomplete="off" id="forum_login_form" action="/member.php?mod=logging&amp;action=login&amp;loginsubmit=yes&amp;infloat=yes&amp;lssubmit=yes">
					<input type="text" name="username" id="forum_username" placeholder="Forum ID"/>
					<input type="password" name="password" id="forum_password" placeholder="Password"/>
					<input type="submit" name="submit" id="forum_submit" value="Login"/>
				</form>
			</div>
			<?php };?>
			<div id="ctrl_panel">
				<div id="ctrl_panel_help" style="display:none;">
					<h2>How to use</h2>
					<p>We recommend to use this tool with your forum account, because only the forum users can store their cards info. So please login the forum if you can.</p>
					<p>Please enter card number and password. If you want to add more cards, please click on the latest input box.</p>
					<p>Click "Save" to store your cards info into your forum account. So that you can directly reuse them without typing them next time. Otherwise if you don't save them, you have to enter them every time and the cards info won't be saved in our server.</p>
					<p>Click "Book Meal" to start the booking process.</p>
					<p>If you want to delete a card, just click on the "Delete" button next to the card info.</p>
		  			<p style="font-style: italic;">Did you know? This tool is an <a href="https://github.com/shouya/bookmeal">open source project.</a></p>
		  			<p style="border-top: 1px dotted gray; padding-top: 5px;">
		  			  <small>Client by <a href="//rixtox.com/">RixTox</a> &bull;
					Server by <a href="//github.com/shouya">Shou Ya</a></small>
					</p>
					</div>

			        <ul>
					<!-- <li><a href="javascript:void(0)" class="btn_add_card">Add Card</a></li> -->
					<?php if($forum_is_login){?>
					<li><a href="javascript:void(0)" class="btn_save">Save</a></li>
					<?php };?>
					<li><a href="javascript:void(0);" class="btn_book">Book Meal</a></li>
					<?php if($forum_is_login){?>
					<li><a href="/member.php?mod=logging&action=logout&formhash=<?php echo($forum_formhash);?>" class="btn_logout">Logout</a></li>
					<?php };?>
					<li><a href="javascript:void(0);" class="btn_help">Show Help</a></li>
				</ul>
			</div>
			<table id="card_table">
				<tr>
					<th class="cln_id">##</th>
					<th class="cln_no">Card Number</th>
					<th class="cln_psw">Password</th>
					<th class="cln_ctrl"></th>
				</tr>
			</table>
	</div>
	<div id="footer">
		<p>Copyright &copy; 2012, Shou & Rix</p>
	</div>
</body>
</html>

