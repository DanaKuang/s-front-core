## README
    Create Date: 2017-06-21
    Author: liubin
    Description: Web容器

## 主要用于前端开发调试，反向代理
</br>
## 目前实现：
    API请求和非API请求
## 预期目标：
    把非API请求拆开成[png|view|file...]
## 逐步实现
## 安装依赖
    npm install
    bower install
## 启动服务
    cd Client                  ## 在Client目录下，不需要单步执行以上命令
    node main.js init          ## 已简化为一行指令安装所有依赖
## 常用指令
    node main.js help          ## 查看帮助文档
    node main.js default       ## 启动工程
    node main.js bulid         ## 打包工程
    node main.js init          ## 初始化项目
    node main.js commit [log]  ## 将代码提交到gitlab
    node main.js publish       ## 一键发布[可能有些不灵活]
    node main.js destroy       ## 你懂的？
## 功能新增
    废弃掉服务器性能监控，本地可以使用，需改配置文件。
    新加入文件监控功能，监控config文件变化，重启服务。
    此功能下一步会加入karma模块，实现前端测试。
    前景一片光芒。
## TIPS
    如需修改请联系相关开发人员评估
## 白话
    我知道接手项目的大神肯定会骂我，为什么这么写，是不是傻x！
    我也不好反驳，如果你有更好的改善方式，那更好了。
## END
