<template>
  <div class="wrapper">
     <list @loadmore="fetch" loadmoreoffset="10">
      <header>
        <!-- 头 -->
        <headerView 
          :newTimer="newTimer" 
          :dayCount="DayCheckInCount" 
          :monthCount="MonthCheckInCount"
          @ddTimeSet="ddTimeSet"
        ></headerView>
        <!-- 空 -->
        <div class="nothing" v-if="nothing">
          <image src="https://s.kcimg.cn/dingtalk/image/nothing.png" style="width:200px;height:150px;"></image>
          <text class="no-text">还没有拜访记录哦~</text>
        </div>
      </header>

      <cell v-for="(item,index) in CheckInDateList" v-bind:key="item.Id">
          <!-- 签到列表 -->
          <visibleView 
            :list="item"
            :index="index"
            :month="month"
            :newTimer="newTimer"
          ></visibleView>
      </cell>
    </list>
  </div>
</template>
<script>
  var stream = weex.requireModule('stream');
  var modal = weex.requireModule('modal');

  import dingtalk from 'dingtalk-javascript-sdk';
  import {jsapifun,toast,getUserId,getVisitList,setItem,getCheckinList} from './lib/util.js';
  import headerView from './home/head.vue';
  import visibleView from './home/visible.vue';
  
  export default {
      name: 'home',
      components:{
        headerView,
        visibleView
      },
      data: function(){
          return {
              link: 'DingTalk',
              list: {},
              DingTalkUserIds: '',
              newTimer:'',
              visible:false,
              // 拜访为空
              nothing:true,
              // 页数
              page:1,
              // 是否展示全月
              month:true,
              MonthCheckInCount: 0,
              DayCheckInCount: 0,
              CheckInDateList: [],
              // 拜访列表
              visibleList:{
                "MonthCheckInCount": 0,
                "DayCheckInCount": 0,
                "CheckInDateList": [
                  // {
                  //   "Id": 1,// 签到编号ID
                  //   "CheckinTimestamp": 2,//签到时间(毫秒)
                  //   "CheckinTime": "2017-11-27",//签到时间
                  //   "DingTalkUserId": "sample string 4",//员工在企业内的UserID(钉钉)
                  //   "Place": "sample string 5",//签到地址
                  //   "DetailPlace": "sample string 6",//签到详细地址
                  //   "ImageList": [//签到照片url列表
                  //     "sample string 1",
                  //     "sample string 2"
                  //   ],
                  //   "Remark": "sample string 7",//签到备注
                  //   "VisitStatus": 8,//拜访状态（1：未拜访，2：未匹配，3：已完成）
                  //   "UserId": 9,//系统用户ID
                  //   "UserName": "sample string 10",//系统用户名称
                  //   "Latitude": 11.0,//签到位置纬度
                  //   "Longitude": 12.0//签到位置经度
                  // }
                ]
              },
              // 总页数
              PageCount:0
          }
      },
      created (){
        var me = this;
        // JsApi()
        // 获取cofig
        const dd = dingtalk.apis;
        jsapifun(weex.config.bundleUrl ,(res) => {
          me.list = JSON.parse(res.data)
          me.newTimer = me.list.Body.TimeStamp * 1000
          dingtalk.config({
            agentId: me.list.Body.AgentId, // 必填，微应用ID
            corpId: me.list.Body.CorpId,//必填，企业ID
            timeStamp: me.list.Body.TimeStamp, // 必填，生成签名的时间戳
            nonceStr: me.list.Body.NonceStr, // 必填，生成签名的随机串
            signature: me.list.Body.Signature, // 必填，签名
            type:0,   //选填。0表示微应用的jsapi,1表示服务窗的jsapi。不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
            jsApiList : [ 
              'runtime.permission.requestAuthCode',
              'device.notification.showPreloader',
              "device.notification.hidePreloader",
              "biz.navigation",
              "biz.map.search",
              "biz.util.openLink",
              "biz.util.open",
              "biz.map.locate",
              'device.geolocation.get',
            ] // 必填，需要使用的jsapi列表，注意：不要带dd。
          });
          // 获取requestAuthCode
          dingtalk.ready(function(){
            const dd = dingtalk.apis;
            // title
            dd.biz.navigation.setTitle({
                title: '拜访记录'
            });
            // 加载
            dd.device.notification.showPreloader({
                text: "使劲加载中..", //loading显示的字符，空表示不显示文字
                showIcon: true, //是否显示icon，默认true
                onSuccess : function(result) {
                    /*{}*/
                },
                onFail : function(err) {}
            })
            // 获取code
            dd.runtime.permission.requestAuthCode({
              corpId: me.list.Body.CorpId,
              onSuccess: function(result) {

                // 通过CODE换取用户身份
                getUserId( result.code, res=>{
                  var o = JSON.parse(res.data)  
                  me.DingTalkUserIds = o.Body.DingTalkUserId
                  
                  // 存储钉钉uid
                  setItem('DingTalkUserId',me.DingTalkUserIds)
                  // 获取数据
                  me.getlist(me.list.Head.RspTime)
                })
              },
              onFail : function(err) {
                // toast(err)
              }
            })
          })
        })
      },
      mounted: function(){
      },
      watch: {
        // 监测 Did 变化
        DingTalkUserIds(val,oldval){
          // toast(val)
          // this.getlist(val,this.list.Head.RspTime)
        },
        visibleList(val,oldval){
          
        }
      },
      methods: {
        // 获取拜访记录
          getlist (time,o){
            var month = o ? o.month : true
            var page = o ? o.page : 1
            var me = this;
            var now = new Date(time);
            var timeDate = this.newTimer = now.getFullYear()+"-"+((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+"-"+(now.getDate()<10?"0":"")+now.getDate();
            
            // ajax
            getCheckinList(
              JSON.stringify({
                 "Body": { 
                   "DingTalkUserId": this.DingTalkUserIds,
                   "SpecDate" : timeDate,
                   "IsGetMonth": this.month
                   },
                   "Paged": {
                      "PageIndex": page,
                      "PageSize": 20
                    }
                 }) 
            ,res=>{
              // 关闭load
              dingtalk.ready(function(){
                dingtalk.apis.device.notification.hidePreloader()
              })
              
              var obj = JSON.parse(res.data)
              
              // 合并数组
              if(this.page == 1){
                this.CheckInDateList = obj.Body.CheckInDateList
              }else{
                let array = obj.Body.CheckInDateList
                // 获取最后一个数组
                let lastArr = this.CheckInDateList[this.CheckInDateList.length-1]
                
                for (let i = 0; i < array.length; i++) {
                  const element = array[i];
                  if(lastArr.CheckInDate == element.CheckInDate){
                    element.CheckInRecordDataList.forEach(ele => {
                      lastArr.CheckInRecordDataList.push(ele)
                    });
                  }else{
                    this.CheckInDateList.push(element)
                  }
                  
                }
                this.CheckInDateList.concat(obj.Body.CheckInDateList);
              }

              if( !obj.Body.CheckInDateList || obj.Body.CheckInDateList.length<=0){
                this.nothing = true
                return;
              }else{
                this.nothing = false
              }

              // 总页数
              this.PageCount = obj.Paged.PageCount
              // this.$set(this,'visibleList',obj.Body)
              this.visibleList = obj.Body
              this.MonthCheckInCount = obj.Body.MonthCheckInCount
              this.DayCheckInCount = obj.Body.DayCheckInCount
              
               
              this.page += 1

            })
          },
          // 钉钉设置时间
          ddTimeSet(obj){
            this.page = obj.page
            this.month = obj.month
            let o = {
              month: this.month,
              page: this.page
            }
            this.getlist(obj.time,o)
            // 设置为当前时间
            this.newTimer = obj.time
          },
          // 滚动加载
          fetch: function(){
            if(this.PageCount >= this.page){
              // ajax
              let o = {
                month: this.month,
                page: this.page
              }
              this.getlist(this.newTimer,o)
            }
        }
      }
  }
</script>
<style scoped>
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
