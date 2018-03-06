<template>
  <div class="header">
    <div class="nav">
      <div class="time-icon-left" @click="monthFun(-1)">
        <image src="http://s.kcimg.cn/dingtalk/image/time.png" style="width:12px;height:6px;"></image>          
      </div>
      <div class="time" @click="ddTimeBox">
        <!-- {{date.split(' ')[0]}} -->
        <text class="time-text">{{ newTimer }}</text>
      </div>
      <div class="time-icon-right" @click="monthFun(1)">
        <image src="http://s.kcimg.cn/dingtalk/image/time.png" style="width:12px;height:6px;"></image>          
      </div>
    </div>
    <div class="sign">
      <div class="sign-text">
        <text class="text">本月签到{{ dayCount }}次</text>
        <text class="text">本日签到{{ monthCount }}次</text>
      </div>
      <div class="link" @click="gotoLink('dealer/index')">
        <text class="link-text">经销商拜访记录</text>
        <div class="link-icon"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import dingtalk from 'dingtalk-javascript-sdk';
  import {toast,openLink} from '../lib/util.js';
  export default {
    props:['newTimer','dayCount','monthCount'],
    data(){
      return {
        time:'2017-12-02'
      }
    },
    created(){
    },
    methods:{
      // 调取钉钉时间
      ddTimeBox(){
        dingtalk.ready(()=>{
          const dd = dingtalk.apis;
          dd.biz.util.datepicker({
            format: 'yyyy-MM-dd',
            value: this.newTimer, //默认显示日期
            onSuccess : (result)=> {
                this.newTimer = result.value
                
                // 传值
                this.$emit('ddTimeSet',{
                  time:this.newTimer,
                  page:1,
                  month:false
                })
            },
            onFail : (err)=> {}
          })
        })
      },
      // 页面跳转
      gotoLink(go){
        if(this.SomeOpen) return;
        this.SomeOpen = true
        openLink(go,res=>{
          this.SomeOpen = false
        })
      },
      // 筛选整月数据
      monthFun(n){
        // 当前时间
        let now = new Date()
        let monthNum = now.getMonth()+1
        let yearNum = now.getFullYear()

        // 搜索时间
        let sMonth = this.newTimer.substr(5,2)
        let sYear = this.newTimer.substr(0,4)
        sMonth = parseInt(sMonth) + n
        
        // 小于月份
        if(sMonth < 1){
          sMonth = 12
          sYear = sYear - 1
        }

        // 大于月份
        if(sMonth > 12){
          sMonth = 1
          sYear = parseInt(sYear) + 1
        }
        
        if(sMonth > monthNum && yearNum < sYear){
           return
        }
        sMonth = (sMonth<10?"0":"") + sMonth
        // 传值
        this.$emit('ddTimeSet',{
          time: sYear+'-'+sMonth+'-01',
          page:1,
          month: true
        })
      }
    }
  }
</script>

<style scoped>
  .header{
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: #D8D8D8;
    background-color: #fff;
    padding-bottom: 20px;
  }
  .nav{
    padding-top: 16px;
    padding-left: 16px;
    padding-bottom: 12px;
    padding-right: 12px;
    height: 60px;
    flex-direction: row;
    align-content: center;
    justify-content: center;
  }
  .time{
    padding-left: 14px;
    padding-right: 14px;
    height: 30px;
    line-height: 30px;
    align-content: center;
    align-items: center;
    justify-content:flex-start;
    flex-direction: row;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(23,24,26,0.12);
    border-bottom-left-radius :15px;
    border-bottom-right-radius :15px;
    border-top-left-radius :15px;
    border-top-right-radius :15px;
    margin-right: 15px;
    margin-left: 15px;
  }
  .time-text{
    line-height: 30px;
    color: #17181A;
    font-size: 16px;
  }
  .time-icon-left,.time-icon-right{
    width: 32px;
    height: 32px;
    padding-right: 14px;
    padding-left: 14px;
    align-items: center;
    line-height: 32px;
  }
  .time-icon-left{
    transform: rotate(90deg)
  }
  .time-icon-right{
    transform: rotate(-90deg)
  }
  .link{
    align-items: center;
    flex-direction: row;
  }
  .link-text{
    color: #1571E5;
    line-height: 30px;
    align-items: center;
    font-size: 14px;
  }
  .link-icon{
    margin-right: 3px;
    width: 8px;
    height: 8px;
    border-top-width: 1px;
    border-right-width: 1px;
    border-style: solid;
    border-color: #1571E5;
    transform: rotate(45deg)
  }
  .sign{
    flex-direction: row;
    justify-content: space-between;
    height: 14px;
    padding-left: 16px;
    padding-right: 12px;
  }
  .sign-text{
    flex-direction: row;
  }
  .text{
    font-size: 12px;
    color: #A1A9B3;
    line-height: 14px;
    margin-right: 20px;
  }
</style>
