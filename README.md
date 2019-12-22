# 说明
本代码基于 https://github.com/luofei614/SocketLog 创建，部分功能做了相应调整，方便工作中使用。
SocketLog适合Ajax调试和API调试， 举一个常见的场景，用SocketLog来做微信调试， 我们在做微信API开发的时候，如果API有bug，微信只提示“改公众账号暂时无法提供服务，请稍候再试” ，我们根本不知道API出来什么问题。  有了SocketLog就不一样了， 我们可以知道微信给API传递了哪些参数， 程序有错误我们也能看见错误信息

## 安装

#### 1、安装Chrome浏览器插件
https://chrome.google.com/webstore/detail/socketlog/apkmbfpihjhongonfcgdagliaglghcod

>如果不能正常访问这个页面，你可以用下面手动安装的方法进行安装

#### 2、安装服务端

##### 2.1、 安装
```
npm install -g socketlog-server
```
##### 2.2、开启服务
###### 2.2.1、前台启动
```
socketlog-server
```
###### 2.2.2、后台启动
```
nohup /usr/local/bin/socketlog-server > /dev/null 2>&1 &
```
> 如果你的服务器有防火墙或者云服务的安全组，请开启1229和1116两个端口，这两个端口是socketlog要使用的。

#### 3、程序中安装类库
在自己的程序中发送日志
###### 3.1、直接引入类库
```
<?php
include './php/slog.function.php';
slog('hello world');
?>
```
用slog函数发送日志， 支持多种日志类型
```
slog('msg','log');  //一般日志
slog('msg','error'); //错误日志
slog('msg','info'); //信息日志
slog('msg','warn'); //警告日志
slog('msg','trace');// 输入日志同时会打出调用栈
slog('msg','alert');//将日志以alert方式弹出
slog('msg','log','color:red;font-size:20px;');//自定义日志的样式，第三个参数为css样式
```
slog函数支持三个参数
* 第一个参数是日志内容，日志内容不光能支持字符串哟，大家如果传递数组,对象等一样可以打印到console中
* 第二个参数是日志类型，可选，如果没有指定日志类型默认类型为log
* 第三个参数是自定样式，在这里写上你自定义css样式即可

###### 3.2、Composer引入 

使用composer安装命令 
```
composer require luofei614/socketlog
```
直接调用静态方法
```
<?php
require './vendor/autoload.php';
use think\org\Slog
//配置socketlog
Slog::config(array(
    'enable'=>true,//是否打印日志的开关
    'host'=>'localhost',//websocket服务器地址，默认localhost
    'optimize'=>false,//是否显示利于优化的参数，如果运行时间，消耗内存等，默认为false
    'show_included_files'=>false,//是否显示本次程序运行加载了哪些文件，默认为false
    'error_handler'=>false,//是否接管程序错误，将程序错误显示在console中，默认为false
    'force_client_id'=>'',//日志强制记录到配置的client_id,默认为空
    'allow_client_ids'=>array()////限制允许读取日志的client_id，默认为空,表示所有人都可以获得日志。
));
Slog::log('log');  //一般日志
Slog::error('msg'); //错误日志
Slog::info('msg'); //信息日志
Slog::warn('msg'); //警告日志
Slog::trace('msg');// 输入日志同时会打出调用栈
Slog::alert('msg');//将日志以alert方式弹出
Slog::log('msg','color:red;font-size:20px;');//自定义日志的样式，第三个参数为css样式
```

## 配置

#### 4.1、基本配置

在载入slog.function.php文件后，还可以对SocketLog进行一些配置。
例如：我们如果想将程序的报错信息页输出到console，可以配置
```
<?php
include './php/slog.function.php';
slog(array(
'error_handler'=>true
),'config');
echo notice;//制造一个notice报错
slog('这里是输出的一般日志');
?>
```
配置SocketLog也是用slog函数， 第一个参数传递配置项的数组，第二个参数设置为config
还支持其他配置项
```
<?php
include './php/slog.function.php';
slog(array(
'enable'=>true,//是否打印日志的开关
'host'=>'localhost',//websocket服务器地址，默认localhost
'optimize'=>false,//是否显示利于优化的参数，如果运行时间，消耗内存等，默认为false
'show_included_files'=>false,//是否显示本次程序运行加载了哪些文件，默认为false
'error_handler'=>false,//是否接管程序错误，将程序错误显示在console中，默认为false
'force_client_id'=>'',//日志强制记录到配置的client_id,默认为空
'allow_client_ids'=>array()////限制允许读取日志的client_id，默认为空,表示所有人都可以获得日志。
)
,'config');
?>
```
* optimize 参数如果设置为true， 可以在日志中看见利于优化参数，如：`[运行时间：0.081346035003662s][吞吐率：12.29req/s][内存消耗：346,910.45kb]` 
* show_included_files 设置为true，能显示出程序运行时加载了哪些文件，比如我们在分析开源程序时，如果不知道模板文件在那里， 往往看一下加载文件列表就知道模板文件在哪里了。
* error_handler 设置为true，能接管报错，将错误信息显示到浏览器console， 在开发程序时notice报错能让我们快速发现bug，但是有些notice报错是不可避免的，如果让他们显示在页面中会影响网页的正常布局，那么就设置error_handler,让它显示在浏览器console中吧。  另外此功能结合php taint也是极佳的。 taint能自动检测出xss，sql注入， 如果只用php taint， 它warning报错只告诉了变量输出的地方，并不知道变量在那里赋值、怎么传递。通过SocketLog， 能看到调用栈，轻松对有问题变量进行跟踪。 更多taint的信息：http://www.laruence.com/2012/02/14/2544.html 
* 设置client_id:  在chrome浏览器中，可以设置插件的Client_ID ，Client_ID是你任意指定的字符串。

设置client_id后能实现以下功能：
> 配置allow_client_ids 配置项，让指定的浏览器才能获得日志，这样就可以把调试代码带上线。  普通用户访问不会触发调试，不会发送日志。  开发人员访问就能看的调试日志， 这样利于找线上bug。 Client_ID 建议设置为姓名拼命加上随机字符串，这样如果有员工离职可以将其对应的client_id从配置项allow_client_ids中移除。 client_id除了姓名拼音，加上随机字符串的目的，以防别人根据你公司员工姓名猜测出client_id,获取线上的调试日志。设置allow_client_ids示例代码：
```
slog(array(
'allow_client_ids'=>array('luofei_zfH5NbLn','easy_DJq0z80H')
),'set_config')
```

> 设置force_client_id配置项，让后台脚本也能输出日志到chrome。 网站有可能用了队列，一些业务逻辑通过后台脚本处理， 如果后台脚本需要调试，你也可以将日志打印到浏览器的console中， 当然后台脚本不和浏览器接触，不知道当前触发程序的是哪个浏览器，所以我们需要强制将日志打印到指定client_id的浏览器上面。 我们在后台脚本中使用SocketLog时设置force_client_id 配置项指定要强制输出浏览器的client_id 即可。示例代码:
```
<?php
include './php/slog.function.php';
slog(array(
'force_client_id'=>'luofei_zfH5NbLn'
),'config');
slog('test');
```

#### 4.2、对数据库进行调试
* SocketLog还能对sql语句进行调试，自动对sql语句进行explain分析，显示出有性能问题的sql语句。 如下图所示。 
![enter image description here][2]
* 图中显示出了三条sql语句 ， 第一条sql语句字体较大，是因为它又性能问题， 在sql语句的后台已经标注Using filesort。 我们还可以点击某个sql语句看到sql执行的调用栈，清楚的知道sql语句是如何被执行的，方便我们分析程序、方便做开源程序的二次开发。图中第三条sql语句为被点开的状态。
* 用slog函数打印sql语句是，第二个参数传递为mysql或mysqli的对象即可。 示例代码：
```
$link=mysql_connect( 'localhost:3306' , 'root' , '123456' , true ) ;
mysql_select_db('kuaijianli',$link);
$sql="SELECT * FROM `user`";
slog($sql,$link);
```
通过上面的方法，socketlog还能自动为你检测没有where语句的sql操作，然后自动提示你。
* 注意，有时候在数据比较少的情况下，mysql查询不会使用索引，explain也会提示Using filesort等性能问题， 其实这时候并不是真正有性能问题， 你需要自行进行判断，或者增加更多的数据再测试。

#### 4.3、对API进行调试
网站调用了API ，如何将API程序的调试信息也打印到浏览器的console中？ 前面我们讲了一个配置 force_client_id， 能将日志强制记录到指定的浏览器。 用这种方式也可以将API的调试信息打印到console中，但是force_client_id 只能指定一个client_id， 如果我们的开发环境是多人共用，这种方式就不方便了。
其实只要将浏览器传递给网站的User-Agent 再传递给API， API程序中不用配置force_client_id， 也能识别当前访问程序的浏览器， 将日志打印到当前访问程序的浏览器， 我们需要将SDK代码稍微做一下修改。 调用API的SDK，一般是用curl写的，增加下面代码可以将浏览器的User-Agent传递到API 。 
```
$headers=array();
if(isset($_SERVER['HTTP_USER_AGENT']))
{
    $headers[]='User-Agent: '.$_SERVER['HTTP_USER_AGENT'];
}
if(isset($_SERVER['HTTP_SOCKETLOG']))
{
    $headers[]='Socketlog: '.$_SERVER['HTTP_SOCKETLOG'];
}
curl_setopt($ch,CURLOPT_HTTPHEADER,$headers); 
```

#### 4.4、区分正式和开发环境

进入chrome浏览器的“工具”-->“扩展程序”  ，  点击SocketLog的“选项”进行设置。


#### 4.5、分析开源程序

有了SocketLog，我们能很方便的分析开源程序，下面以OneThink为例， 大家可以在 http://www.topthink.com/topic/2228.html 下载最新的OneThink程序。 安装好OneThink后，按下面步骤增加SocketLog程序。 

* 将SocketLog.class.php复制到OneThink的程序目录中，你如果没有想好将文件放到哪个子文件夹，暂且放到根目录吧。 
* 编辑入口文件index.php, 再代码的最前面加载slog.function.php ,并设置SocketLog
```
<?php
    include './slog.function.php';
    slog(array(
      'error_handler'=>true,
      'optimize'=>true,
      'show_included_files'=>true
    ),'config');
```
- 编辑ThinkPHP/Library/Think/Db/Driver.class.php 文件，在这个类中的execute 方法为一个执行sql语句的方法，增加代码：
```
slog($this->queryStr,$this->_linkID);
```
-  类中的query方法也是一个执行sql语句的地方， 同样需要增加上面的代码
-  然后浏览网站看看效果： 
 
 ![enter image description here][3]
 
通过console的日志，访问每一页我们都知道程序干了什么，是一件很爽的事情。

- 提示：另一种更简单的方法，因为OneThink每次执行完sql语句都会调用$this->debug， 所以我们可以把slog($this->queryStr,$this->_linkID); 直接写在 Db.class.php文件的debug方法中。 这样不管是mysqli还是mysql驱动都有效。

## 效果展示
我们在浏览网站的时候在浏览器console中就知道程序做了什么，这对于二次开发产品十分有用。 下面效果图在console中打印出浏览discuz程序时，执行了哪些sql语句， 以及执行sql语句的调用栈。程序的warning，notice等错误信息也可以打到console中。
![enter image description here][1]

## 依赖库
* SocketLog https://github.com/luofei614/SocketLog

[1]: https://github.com/xiaoyuit/SocketLogs/raw/master/screenshots/discuz.png
[2]: https://github.com/xiaoyuit/SocketLogs/raw/master/screenshots/sql.png
[3]: https://github.com/xiaoyuit/SocketLogs/raw/master/screenshots/onethink.png