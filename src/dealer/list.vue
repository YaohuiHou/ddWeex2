<template>
  <div class="man-list">
    <div class="item" v-for="(item,index) in DealerSubJsonList">
      <div class="vicible">
        <text class="name">{{item.CheckUserName}}</text>
        <text class="type">{{item.VisitTypeText}}</text>
      </div>
      <div class="right" @click="gotoLink('detail/index',index)">
        <text class="time">{{item.CreateDate}}</text>
        <div class="icon"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import dingtalk from 'dingtalk-javascript-sdk';
  import {openLink,setItem,toast} from '../lib/util.js';
  export default {
    props:['DealerSubJsonList'],
    data(){
      return {

      }
    },
    created(){
    },
    methods:{
      gotoLink(type,index){
        // 跳到搜索页
        if(this.SomeOpen) return;
        this.SomeOpen = true

        // 加载
        dingtalk.ready(function(){
          const dd = dingtalk.apis;
          dd.device.notification.showPreloader({
              text: "使劲加载中..", //loading显示的字符，空表示不显示文字
              showIcon: true, //是否显示icon，默认true
              onSuccess : function(result) {
                  /*{}*/
              },
              onFail : function(err) {}
          })
        })
        
       
        // 成功设置详情页是否有修改按钮
        setItem('submitok','1',res=>{
          setItem('CheckInRecord',JSON.stringify(this.DealerSubJsonList[index]),event=>{
            // 关闭load
            dingtalk.ready(function(){
              dingtalk.apis.device.notification.hidePreloader()
            })
            openLink(type,res=>{
              this.SomeOpen = false
            })
          })
        })
      }
    }
  }
</script>

<style scoped>
  .man-list{
    padding-top: 8px;
  }
  .item{
    height: 78px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 16px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgba(23,24,26,0.12);
    background-color: #fff;
  }
  .vicible{
    height: 58px;
  }
  .name{
    color: #17181A;
    font-size: 18px;
    line-height: 30px;
    font-weight: bold;
  }
  .type{
    font-size: 16px;
    color: #17181A;
    line-height: 28px;
  }
  .right{
    align-items: center;
    flex-direction: row;
  }
  .time{
    color: #17181A;
    font-size: 12px;
  }
  .icon{
    margin-right: 16px;
    margin-left: 8px;
    width: 8px;
    height: 8px;
    border-top-width: 1px;
    border-right-width: 1px;
    border-style: solid;
    border-color: #A1A9B3;
    transform: rotate(45deg)
  }
</style>

