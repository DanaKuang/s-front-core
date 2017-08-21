#!/bin/sh
ps -fe | grep node | grep -v grep
if [ $? -ne 0 ];then
echo "start node server process....."
nohup node main default >/dev/null 2>&1 &
else
echo "node server runing....."
fi
#####