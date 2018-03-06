<template>
  <div class="dealer">
    <scroller @loadmore="fetch" loadmoreoffset="10">
      <!-- 拜访地 -->
      <headerView
        :DealerId="DealerId"
        :StoreName="StoreName"
        @dealerFun="dealerFun"
      ></headerView>
      <!-- 拜访人 -->
      <listView v-if="!nothing" :DealerSubJsonList="DealerSubJsonList"></listView>
      <!-- 空 -->
      <div class="nothing" v-if="nothing">
        <image src="https://s.kcimg.cn/dingtalk/image/nothing.png" style="width:200px;height:150px;"></image>
        <text class="no-text">还没有人拜访~</text>
      </div>
    </scroller>
  </div>
</template>
<script>
  var globalEvent = weex.requireModule('globalEvent');
  import headerView from './head.vue';
  import listView from './list.vue';
  import dingtalk from 'dingtalk-javascript-sdk';
  import {openLink,getItem,toast,dealerVisitList,removeItem} from '../lib/util.js';
  export default {
    name: 'dealer',
    components:{
      headerView,
      listView
    },
    data(){
      return {
        nothing:false,
        CheckInRecord:{},
        DealerId:'请选择经销商',
        StoreName:'请选择店铺',
        // 定时器
        timer:null,
        // 页数
        page:1,
        PageCount:0,
        // 请求id
        dealerids:0,
        // 拜访数据
        DealerSubJsonList:[]
      }
    },
    created(){
      // 获取签到信息
      // getItem('CheckInRecord',event=>{
      //   this.CheckInRecord = event.data
      // })
      removeItem('DealerDetail')
      removeItem('submitok')
      removeItem('DealerSearch')
      
    },
    mounted: function(){
      dingtalk.ready(function(){
        const dd = dingtalk.apis;
        // title
        dd.biz.navigation.setTitle({
            title: '经销商拜访记录'
        });
      })
    },
    methods:{
      // 刷新数据
      dealerFun(){
        // 实时获取缓存数据
       this.timer = setInterval(()=>{
          // 获取经销商
          getItem('DealerDetail',event=>{
            let data = JSON.parse(event.data)
            if (data !== undefined || data !== '') {

              this.DealerId = data.DealerName
              this.dealerids = data.DealerId
              this.page = 1
              // 请求记录
              this.dealerVisitFun();
              clearInterval(this.timer)
            }
          })
        }, 200);
      },
      // 经销商拜访记录
      dealerVisitFun(){
        dealerVisitList(
          JSON.stringify({
                 "Body": { 
                   "DealerId": this.dealerids
                   },
                   "Paged": {
                      "PageIndex": this.page,
                      "PageSize": 20
                    }
                 }) 
            ,res=>{
              var obj = JSON.parse(res.data)
              // 没有数据
              if(obj.Body == null || obj.Body.length <= 0){
                this.nothing = true
                return;
              }else{
                this.nothing = false
              }
              // 总页数
              this.PageCount = obj.Paged.PageCount
              // 记录
              if(this.page == 1){
                this.DealerSubJsonList = obj.Body
              }else{
                let array = obj.Body
                for (let i = 0; i < array.length; i++) {
                  const element = array[i];
                  this.DealerSubJsonList.push(element)
                }
                this.DealerSubJsonList.concat(obj.Body);
              }
              

              this.page += 1;
            }
        )
      },
      // 滚动加载
      fetch(){
        if(this.PageCount >= this.page){
          // ajax
          this.dealerVisitFun()
        }
      }
    }
  }
</script>
<style scoped>
  .dealer{
    background-color: #f3f4f5;
  }
  .nothing{
    padding-top: 48px;
    justify-content: center;
    align-items: center;
  }
  .no-text{
    color: #A1A9B3;
    font-size: 12px;
    margin-top: 16px;
  }
</style>