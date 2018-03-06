<template>
  <div class="location-view">
    <scroller class="view">
      <div class="box" v-for="item in lists">
        <text class="text">{{item}}</text>
        <div class="location-right">
          <image src="https://s.kcimg.cn/dingtalk/image/location-min.png" class="zone-img" style="width:10px;height:14px;"></image>
          <text class="go-text">去定位</text>
        </div>
      </div>
    </scroller>
  </div>
</template>
<script>
  import {toast} from '../lib/util.js';
  import dingtalk from 'dingtalk-javascript-sdk';
  export default {
    data(){
      return {
        lists:[
          
        ]
      }
    },
    mounted: function(){
      dingtalk.ready(function(){
        const dd = dingtalk.apis;
        // title
        dd.biz.navigation.setTitle({
            title: '定位店铺'
        });
        // });
      })
    },
    methods:{
      
    }
  }
</script>

<style scoped>
  .location-view{
    background-color: #F3F4F5;
    align-items: flex-start;
  }
  .view{
    padding-left: 16px;
    background-color: #fff;
  }
  .box{
    width: 384px;
    flex-direction: row;
    padding-top: 12px;
    padding-bottom: 12px;
    justify-content: space-between;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgba(23,24,26,0.08);
    align-items: center;
  }
  .text{
    font-size: 16px;
    line-height: 24px;
    color: #17181A;
    width: 288px;
  }
  .location-right{
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 80px;
  }
  .go-text{
    font-size: 16px;
    color: #F7411D;
  }
  .location{
    flex-direction: row;
    align-items: center;
  }
  .zone-img{
    margin-right: 4px;
  }
</style>
