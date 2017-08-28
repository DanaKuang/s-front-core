## 页面开发流程
    Create Date: 2017-07-04
    Author: liubin
    Description: 开发流程及常见问题
## 入口文件
    main.js                      ## node main.js 
## 主要目录结构：
    ## app
        ## controllers           ## 控制层，控制模型层与视图层，页面渲染控制
        ## directives            ## 自定义Angular指令
        ## models                ## 模型，用于与本地或者后台交互返回数据模型
        ## services              ## 自定义服务，将每个需求抽象出来，作为一个服务
    ## assets                    ## 静态资源image和header、footer模版
    ## components                ## 模版文件，指令编写所需要的模版文件
    ## config                    ## 配置文件
    ## data                      ## 静态资源Json文件
    ## doc                       ## 笔记
    ## views                     ## 视图层，页面文件
## 单个重要文件
    * config/config.view.yml     ## 前端所有的视图请求需要在此注册配置
    * config/config.api.yml      ## 前端所有的API请求需要在此注册配置
    * app/app.js                 ## 根模块，加载其他模块js
    * assets/script/index.js     ## requirejs配置文件AMD规范，异步为阻塞加载
## 开发流程
    1）首先在views中添加需要编写的页面，如：kpi.html。并在页面中添加ng-controller控制器；
    2）在config/config.view.yml中注册页面路由及静态物理地址；
    3）在controller文件夹中创建控制器文件，如：kpi.controller.js；   **注意四个属性**
    4）在controller.min.js中引入添加的controller文件；
    5）在model文件夹中创建模型文件，如：kpi.model.js；               **注意三个属性**
    6）在model.min.js文件夹中引入添加的model文件；   
    7）api调用需在config/config.api.yml文件中注册。
## 常见问题
    1）view和api未在config中注册，controller和model未在*.min.js文件中引入；
    2）view中未添加ng-controller或者名称不对应；
    3）controller文件中的viewModelName与model中的ServiceName不对应。
## 环境搭建
    1. node环境搭建
        1）官网下载node安装包linux；
        2）解压安装包：`tar -xvf node-**.tar.gz`；
        3）创建软连接：`ln -s /usr/local/src/node**/bin/node /usr/local/bin/node`
                     `ln -s /usr/local/src/node**/bin/npm /usr/local/bin/npm`；
        4）测试：`node -v & npm -v`。
    2. bower环境搭建
        1）bower安装：`npm install bower -g`；
        2）测试：`bower -v`。
## 代码部署
    1）首先代码可以在本地环境跑起来，保证没有问题；
    2）修改config.yml文件，将gateway对象下host修改为：127.0.0.1，端口号为：8080；
    3）将代码打包成zip文件，指令：`node main build`；
    4）将代码上传到服务器命令：`scp ./**.zip root@000.00.00.000:/root`；
    5）在服务器上解压文件包，命令：`unzip -o ./sass-front.zip`；
    6）如果之前node已经跑起来，记得kill掉：`kill -9 [pid]`；
    7）cd到项目Client目录下执行命令：`nohup node main.js default >/dev/null 2>&1 &`，回车。
    8) ps aux | grep node   or    ps -ef | grep node
## TIPS
    如果对Angular不熟悉，可以不使用指令编写页面，先试用原生H5和jQuery编写，随后统一封装。
## 问题
    1）框架的本质是为了方便程序员开发。就目前来看，不但没有减轻工作量，反而增加了工作量。建议写指令做到可复用，减轻工作量。模版就是模版，变化的是模型，而衔接视图和模型的是控制器。
    2）一些jQuery插件问题，如果可以最好写成服务，方便打包引入。其实也可以在require中引入，但如果过多会产生问题。
## 漏洞
    1）改变config下的文件，需要重启node，因为服务一跑起来是读到内存里面去的。「这算漏洞吗」
    2）首次加载，模型和视图渲染完美，后面加载的数据，好像绑定不上去，嘿嘿。「那是你玩的不溜」
    3）所有的文件都是在已进入页面后全部加在完成，这样如果文件过多，项目后期过于复杂，会出现加载缓慢的问题，这是一个缺陷，我承认，不过不必担心，框架2.0版本我已经构思好了，所有文件按需加载，模块独立，能更友好的避免这一现象。敬请期待吧，如果你有更好的思路，还请一起分享。 
## 鸣谢
    感谢为本项目作出贡献的小伙伴，也希望此项目能够长久的跑下去。如果你有更好的架构思路，记得分享给我奥，小白在此先谢过了。一个人的前端并不能称得上前端，一个好的团队的战斗力是无穷的！
    喜欢研究，坚持笔记，乐于分享，一起加油！
## 更新
    【2017-08-16】上面提到的漏洞1）已完美解决；解决方案：
    gulp的watch，需要读到内存中的文件，监控文件变化，重启node服务。
    也就是说，你只需要重启一次node，就可以将其扔到一边去写页面了，所有Client目录下的文件变更都会即时响应。



