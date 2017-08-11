## 页面开发笔记
    Create Date: 2017-07-28
    Author: liubin
    Description: Multi模块描述
## 开发模块
    Multi                          ## 模块名称 
    MultiCtrl                      ## 控制器名称
    multiViewModel                 ## 视图模版
    Multi                          ## 页面文件
## 后端接口说明
    接口详情请看config.api.yml文件
## 问题及解决办法
    1：兄弟scope之间传值问题：
        1）定义消息，首先以冒泡的方式传递给父scope，然后父scope以广播的方式传递给子scope；
        2）在当前scope中，根据element找到兄弟scope；
    2：multiselect插件传值刷新问题
        1）没有仔细看api。关键词：dataprovider、refresh
## MOERE