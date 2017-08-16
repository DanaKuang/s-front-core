#### 页面开发笔记
    Create Date: 2017-08-16
    Author: 刘彬
    Description: 活动轨迹
#### 开发模块
    dayanalysis,pathdetial,realtime                            #### 模块名称 
    dayanalysisCtrl,pathdetialCtrl,realtimeCtrl                #### 控制器名称
    dayanalysisViewModel,pathdetailViewModel,realtimeViewModel #### 视图模版
    dayanalysis,pathdetial,realtime                            #### 页面文件
#### 后端接口说明
    待完善
#### 问题及解决办法
    偷个懒，将三个模块写入一个文件
    1）默认值问题：
        开发初期并没有考虑默认值问题，所以并没有预留默认值入口，导致后面默认值引入，增加工作量
    2）需求变更问题：
        页面选择框增减，增加需求变更，导致代码逻辑重复更改多次，可能存在潜在危险。
    3）echart使用
        echart最好给默认值，不然不会显示图。数据默认给[0,0,...]，如此不会在没有数据的情况图出不来。属性写全，尽量避免出现undefined。
#### MOERE
