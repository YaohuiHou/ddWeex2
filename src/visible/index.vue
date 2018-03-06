<template>
  <div class="visible">
    <scroller>
      <!-- 没有定位，去定位 -->
      <div class="goto-location" v-if="golocation && matchText !== '已匹配'">
        <text class="go-text">店铺地址待维护，需重新定位</text>
      </div>
      <!-- 拜访头 -->
      <headerView
        :CheckInRecord="CheckInRecord"
        :DealerName="DealerName"
        :matchText="matchText"
        :visibleData="visibleData"
        :golocation="golocation"
        @inputValue="inputValue"
        @mapValue="tomap"
      ></headerView>
      <!-- 类型 -->
      <otherView
        :IsCooperation="IsCooperation"
        :visibleType="visibleType"
        :visibleTimer="visibleTimer"
        :visibleLevel="visibleLevel"
        @timerFun="timerFun"
      ></otherView>
      <!-- 下一步 -->
      <div class="next" @click="nextBtn('register/index')">
        <text class="text">下一步</text>
      </div>
      <div class="other-btn" @click="gotolink('register/other')">
        <text class="other-text">其他商业配合型拜访</text>
        <div class="border"></div>
        <div class="border"></div>
      </div>
    </scroller>
  </div>
</template>
<script>
  import {toast,getItem,setItem,jsapifun,openLink,getCheckin,closeLink,setUdlocation} from '../lib/util.js';
  import dingtalk from 'dingtalk-javascript-sdk';
  import headerView from './head.vue';
  import otherView from './other.vue';
  export default {
    components:{
      headerView,
      otherView
    },
    data(){
      return {
        // 签到信息
        CheckInRecord:{},
        // 签到经纬度
        CheckLatitude:0,
        CheckLongitude:0,
        Latitude: -1, // 纬度
        Longitude: -1, // 经度
        list:{},
        // 是否需要定位
        golocation:false,
        DealerName:'请选择拜访客户',
        visibleType: '请选择拜访类别',
        visibleTimer: '请选择拜访时长',
        visibleLevel: '请选择被访人级别',
        // 存储所有拜访信息
        visibleData: {},
        // 是否匹配
        matchText: '未匹配',
        // 是否合作
        IsCooperation: null,
        timer:null,
        DingTalkUserId:null
      }
    },
    created(){
      // 获取签到信息
      var me = this
      getItem('CheckInRecord',event=>{
        // toast(event.data)
        
        this.$set(this,'CheckInRecord',JSON.parse(event.data))
        // 签到经纬度
        this.CheckLatitude = this.CheckInRecord.Latitude
        this.CheckLongitude = this.CheckInRecord.Longitude

        // 钉钉员工id
        this.DingTalkUserId = this.CheckInRecord.DingTalkUserId
        // 客户拜访存储数据
        this.visibleData = {
          //签到记录ID
          CheckinRecordId: this.CheckInRecord.Id,
          // 系统用户id
          UserId: this.CheckInRecord.UserId,
          // 用户全名
          UserName: this.CheckInRecord.UserName,
          // 访问等级
          DealerLevel: 1
        }
        setItem('visibleData',JSON.stringify(this.visibleData))
      })
      // 授权
      const dd = dingtalk.apis;
      jsapifun(weex.config.bundleUrl,(res) => {
        me.list = JSON.parse(res.data)
        dingtalk.config({
          agentId: me.list.Body.AgentId, // 必填，微应用ID
          corpId: me.list.Body.CorpId,//必填，企业ID
          timeStamp: me.list.Body.TimeStamp, // 必填，生成签名的时间戳
          nonceStr: me.list.Body.NonceStr, // 必填，生成签名的随机串
          signature: me.list.Body.Signature, // 必填，签名
          type:0,   //选填。0表示微应用的jsapi,1表示服务窗的jsapi。不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
          jsApiList : [ 
            "biz.map.locate",
            'device.geolocation.get'
          ] // 必填，需要使用的jsapi列表，注意：不要带dd。
        });
      })

      // 实时获取缓存数据
      this.realTime()

    },
    mounted: function(){
      var me = this
      dingtalk.ready(function(){
        const dd = dingtalk.apis;
        // title
        dd.biz.navigation.setTitle({
            title: '拜访记录'
        });
      })
    },
    watch:{
      Latitude(){
        getCheckin(
          JSON.stringify({
            "Body": {
              "CheckIn_Latitude": this.CheckInRecord.Latitude,
              "CheckIn_Longitude": this.CheckInRecord.Longitude,
              "Store_Latitude": this.Latitude,
              "Store_Longitude": this.Longitude
            }
          }) 
          ,res=>{
            var obj = JSON.parse(res.data) 
            this.golocation = true
            // this.golocation = !obj.Body
            this.visibleData.IsEffective = 0
            if(obj.Body){
              this.matchText = '已匹配'
              this.visibleData.IsEffective = 1
            }else{
              this.matchText = '未匹配'
              this.visibleData.IsEffective = 0
            }
          }
        )
      }
    },
    methods:{
      timerFun(){
        // 实时获取缓存数据
        this.realTime()
      },
      // 实时刷新数据
      realTime(){
        this.timer && clearInterval(this.timer)
        this.timer = setInterval(()=>{
          // 经销商信息
          getItem('DealerDetail',event=>{
            let data = JSON.parse(event.data)
            if (data !== undefined) {
              // 经销商编号
              this.visibleData.DealerId = data.DealerId
              // this.DealerName = data.DealerName
              setItem('visibleData',JSON.stringify(this.visibleData))
            }
          })
          // 获取店铺
          getItem('StoreInfo',event=>{
            let data = JSON.parse(event.data)
            if (data !== undefined) {
              this.DealerName = data[0].StoreName
              this.Longitude = data[0].Longitude
              this.Latitude = data[0].Latitude
              // 是否合作
              this.IsCooperation = data[0].IsCooperation
              // 选择的门店ID集合
              this.visibleData.StoreIdList = []
              data.forEach(ele=>{
                this.visibleData.StoreIdList.push(ele.StoreId)
              })
              setItem('visibleData',JSON.stringify(this.visibleData))
            }
          })
          // 拜访类型
          getItem('visibleType',event=>{
            let data = JSON.parse(event.data)
            if (data !== undefined) {
              this.visibleType = data.name

              // 传值
              this.visibleData.VisitTypeText = data.name
              this.visibleData.VisitType = data.value
              setItem('visibleData',JSON.stringify(this.visibleData))
            }
          })
          // 拜访时长
          getItem('visibleTimer',event=>{
            let data = JSON.parse(event.data)
            if (data !== undefined) {
              this.visibleTimer = data.name

              this.visibleData.VisitHoursText = data.name
              setItem('visibleData',JSON.stringify(this.visibleData))
            }
          })
          // 访问级别
          getItem('visibleLevel',event=>{
            let data = JSON.parse(event.data)
            if (data !== undefined) {
              this.visibleLevel = ''
              data.forEach(element => {
                if(element.selectedClass){
                  this.visibleLevel += element.name + ' '
                }
              });
            }
          })

        }, 300);
      },
      // 进入修改定位页
      tomap(){
        if(this.SomeOpen) return;
        this.SomeOpen = true
        setItem('setOkStore')
        openLink('visible/map',res=>{
          this.SomeOpen = false

          // 修改
          if (this.matchText == '已匹配') return;

          this.timers && clearInterval(this.timers)
          this.timers = setInterval(()=>{
            getItem('setOkStore',event=>{
              let data = JSON.parse(event.data)
              if (data !== undefined) {
                this.matchText = '已匹配'
                clearInterval(this.timers)

              }
            })
          },200)
        })
      },
      // 下一步 跳转判断
      nextBtn(type){
        if(this.DealerName == '请选择拜访客户'){
          toast('请选择拜访客户',5)
          return;
        }else if(this.visibleType == '请选择拜访类别'){
          toast('请选择拜访类别',5)
          return;
        }else if(this.visibleTimer == '请选择拜访时长'){
          toast('请选择拜访时长',5)
          return;
        }else if(this.visibleLevel == '请选择被访人级别'){
          toast('请选择被访人级别',5)
          return;
        }else if(this.visibleData.InvalidReason == ''){
          toast('请输入未匹配原因',5)
          return;
        }
        // 跳转
        // dingtalk.ready(function(){
        //   dingtalk.apis.device.notification.showPreloader({
        //     text: "马上打开下一步", //loading显示的字符，空表示不显示文字
        //     showIcon: true
        //   })
        // })
        this.gotolink(type)
      },
      // 无效地址原因输入
      inputValue(val){
        this.visibleData.InvalidReason = val

        this.timers && clearInterval(this.timers)
      },
      gotolink(type){
        
        this.timers && clearInterval(this.timers)
        // 页面跳转
        if(this.SomeOpen) return;
        this.SomeOpen = true
        this.timer && clearInterval(this.timer)
        openLink(type,res=>{
          this.SomeOpen = false
        })
      }
    }
  }
</script>

<style scoped>
  .visible{
    background-color: #F3F4F5;
  }
  .next{
    width: 368px;
    height: 44px;
    background-color: #1571E5;
    align-items: center;
    justify-content: center;
    line-height: 44px;
    text-align: center;
    border-left-style: 4px;
    border-top-style: 4px;
    border-right-style: 4px;
    border-bottom-style: 4px;
    margin-left: 16px;
  }
  .text{
    color: #fff;
    font-size: 16px;
  }
  .goto-location{
    flex-direction: row;
    height: 35px;
    background-color: #F7411C;
    padding-left: 16px;
    padding-right: 16px;
    align-items: center;
    justify-content: center;
  }
  .go-text{
    font-size: 16px;
    color: #fff;
    text-align: center;
  }
  .other-btn{
    margin-top: 16px;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    line-height: 20px;
  }
  .other-text{
    font-size: 14px;
    color: #1571E5;
    line-height: 20px;
  }
  .border{
    width: 8px;
    height: 8px;
    border-top-width: 1px;
    border-right-width: 1px;
    border-style: solid;
    border-color: #1571E5;
    transform: rotate(45deg)
  }
</style>
