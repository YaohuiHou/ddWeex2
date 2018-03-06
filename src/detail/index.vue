<template>
  <div class="view">
    <scroller class="view-box">
      <div class="detail" v-for="item in lists" v-if="item.value.length && (!item.visibleType || (item.visibleType && item.visibleType == 'ok') )">
        <div class="box" v-if="item.need" v-for="element in item.value">
          <text class="left-text">{{element.title}}</text>
          <div class="right">
            <text class="right-text" >{{element.value}}</text>
          </div>
        </div>
        <div class="box" v-if="!item.need">
          <text class="left-text">{{item.title}}</text>
          <div class="right">
            <text class="right-text" v-if="item.store === true" v-for="e in item.value">{{e}}</text>
            <text class="right-text" v-if="item.isok === true && item.value.length > 1">是</text>
            <text class="right-text" v-if="item.store === false">{{ item.value }}</text>
          </div>
        </div>
      </div>
    </scroller>
    <div class="submit" @click="submit" v-if="isGoTo">
        <text class="submit-text">修改</text>
      </div>
  </div>
</template>
<script>
  import {toast,setItem,getItem,removeItem,openLink,getVisibleDetail,closeLink} from '../lib/util.js';
  import dingtalk from 'dingtalk-javascript-sdk';
  export default {
    data(){
      return {
        lists:[
          /*
          * store 店铺 ； 
          *  name 展示子集 ； 
          *  isok 是否 ； 
          *  visibleType 不同拜访展示 ； 
          *  stage 拜访类型
          * need 数组，需要循环 ；
          *  need: 1 联系人集合 ； 2 培训相关 ； 3 活动相关
          * 
          * 新增其他拜访类型 otherSome
          */ 
          {otherSome:true,title:'经销商',type:'DealerName',value:'',store:false,activity:'err'},
          {otherSome:false,title:'拜访店铺',type:'DealerSubJsonList',value:[],store:true,name:'StoreName'},
          {otherSome:false,title:'经销商级别',type:'DealerLevel',value:'',store:false,activity:'err'},
          {otherSome:true,title:'拜访时间',type:'CreateDate',value:'',store:false,activity:'err'},
          {otherSome:true,title:'定位地址',type:'DetailPlace',value:'',store:false,activity:'err'},
          {otherSome:true,title:'拜访类别',type:'VisitTypeText',value:'',store:false,activity:'err'},
          {otherSome:false,title:'被访人级别',type:'ContactInfoList',value:[],need: '1'},
          {otherSome:false,title:'培训相关信息',type:'TrainingInfoModel',value:[],need: '2'},
          {otherSome:false,title:'活动相关信息',type:'ActivityInfoList',value:'',store:false,activity:'ok'},
          {otherSome:false,title:'客户意向类型',type:'IntentionType',value:'',store:false,activity:'err'},
          {otherSome:false,title:'拒绝原因',type:'IntentionType',value:'',store:false,activity:'err'},
          {otherSome:false,title:'是否知道卡车之家',type:'CommentContent',value:'',store:false,activity:'err',isok:true},
          {otherSome:false,title:'是否合作其他家',type:'OtherCooperation',value:'',store:false,activity:'err',isok:true},
          {otherSome:false,title:'客户年销量',type:'SalesVolume',value:'',store:false,activity:'err'},
          {otherSome:false,title:'拜访结果',type:'VisitContent',value:'',store:false,activity:'err',stage:'1',visibleType:'err'},
          {otherSome:true,title:'拜访内容',type:'VisitContent',value:'',store:false,activity:'err',stage:'2',visibleType:'err'},
          {otherSome:false,title:'购买原因',type:'VisitContent',value:'',store:false,activity:'err',stage:'3',visibleType:'err'},
          {otherSome:false,title:'活动内容',type:'VisitContent',value:'',store:false,activity:'err',stage:'4',visibleType:'err'},
          {otherSome:false,title:'是否已付款',type:'IsAlreadyPay',value:'',store:false,activity:'err'},
          {otherSome:false,title:'是否团签',type:'IsGroup',value:'',store:false,activity:'err'},
          {otherSome:false,title:'客户年销售额(台)',type:'SalesVolume',value:'',store:false,activity:'err'},
          {otherSome:false,title:'客户线索销售量',type:'LeadsSales',value:'',store:false,activity:'err'},
          {otherSome:false,title:'成交量比例',type:'VolumeRatio',value:'',store:false,activity:'err'},
          {otherSome:false,title:'客户建议',type:'CustomerSuggestion',value:'',store:false,activity:'err'},
          {otherSome:false,title:'成功分享',type:'SuccessShare',value:'',store:false,activity:'err'},
          {otherSome:false,title:'谈判计划',type:'NegotiationPlan',value:'',store:false,activity:'err'},
          {otherSome:true,title:'发现问题',type:'QuestionContent',value:'',store:false,activity:'err'},
        ],
        // 
        visibleData:{},
        CheckInRecord: null,
        // 判断第几次进来
        isGoTo:false
      }
    },
    mounted: function(){
      dingtalk.ready(function(){
        const dd = dingtalk.apis;
        // title
        dd.biz.navigation.setTitle({
            title: '拜访记录'
        });
        dd.device.notification.showPreloader({
            text: "使劲加载中..", //loading显示的字符，空表示不显示文字
            showIcon: true, //是否显示icon，默认true
            onSuccess : function(result) {
                /*{}*/
            },
            onFail : function(err) {}
        })
      })
    },
    created(){
      // 获取签到信息
      getItem('CheckInRecord',event=>{
        this.CheckInRecord = JSON.parse(event.data)
        if(this.CheckInRecord.CheckUserName){
          this.listFun(this.CheckInRecord)
        }else{
          // 客户拜访数据
          this.visibleDetail()
        }
        
      })
      // 判断是否为第一次进来
      getItem('submitok',event=>{
          if (event.data == 1) {
            this.isGoTo = false
            removeItem('submitok')
          }else{
            this.isGoTo = true
          }
        })
    },
    methods:{
      // 获取拜访详情数据
      visibleDetail(){
        // ajax
        getVisibleDetail(
          JSON.stringify({
              "Body": { 
                "CheckInRecordId": this.CheckInRecord.Id,
                "UserId": this.CheckInRecord.UserId
              }
            }) 
          ,res=>{
            
            var data = JSON.parse(res.data)
            var obj = data.Body
            if(obj.VisitTypeText == '其他商业配合拜访'){
              this.otherListFun(obj)
            }else{
              this.listFun(obj)
            }
          }
        )
      },
      // 新增其他 otherListFun
      otherListFun(obj){
        this.lists.forEach((element,index) => {
          if(element.otherSome){
            element.value = obj[element.type]
            if(element.visibleType == 'err' ){
              element.visibleType = 'ok'
            }
          }
        })

        // 关闭load
        dingtalk.ready(function(){
          dingtalk.apis.device.notification.hidePreloader()
        })
      },
      listFun(obj){
        // 循环插入数据
        this.lists.forEach((element,index) => {
          // 将数组拿出来
          if( element.need ){
            if (element.need === '1') {
              // 联系人
                obj[element.type].forEach((e,index) => {
                  let name = {title: e.Position ,type:'RealName',value: e.RealName }
                  element.value.push(name)
                  if(e.Telephone){
                    let tel =  {title: e.Position+'联系方式',type:'Telephone',value: e.Telephone }
                    element.value.push(tel)
                  }
                })

            }else if (element.need === '2'){
              // 培训
              var arr = ['培训内容','培训原因','被培训人姓名','被培训人职务']
              var typeArr = obj[element.type]
              var indexArr = 0
              for (const key in typeArr) {
                let name = {title: arr[indexArr] ,type: key,value: typeArr[key] }
                element.value.push(name)
                indexArr++
              }
            }
            

          }else if(element.store === true){
            // 拜访店铺
            obj[element.type].forEach((e,index) => {
              element.value.push(e.StoreName)
            })
          }
          if(element.activity === 'err'){
            // 其他
            if(element.type === 'DealerLevel'){
              element.value = obj[element.type] == 1 ? '一级' : '二级'
            }else{
              element.value = obj[element.type]
            }

            if(element.type == 'VisitContent'){
              switch (obj.VisitType) {
                case 1:
                case 2:
                case 3:
                  if(element.stage === '1'){
                    element.visibleType = 'ok'
                  }
                  break;
                case 6:
                  if(element.stage === '4'){
                    element.visibleType = 'ok'
                  }
                  break;
                case 8:
                  if(element.stage === '2'){
                    element.visibleType = 'ok'
                  }
                  break;
                case 4:
                case 5:
                case 9:
                case 10:
                  if(element.stage === '2'){
                    element.visibleType = 'ok'
                  }
                  break;
              }
            }
          }else if(element.activity === 'ok'){ // 活动
            let arr = obj[element.type]
            for (const key in arr) {
              element.value += arr[key].ActivityTypeText + " "
            }
          }
        });

        // 关闭load
        dingtalk.ready(function(){
          dingtalk.apis.device.notification.hidePreloader()
        })
      },
      submit(){
        if(this.SomeOpen) return;
        // 加载
        // dingtalk.ready(function(){
        //   dingtalk.apis.device.notification.showPreloader({
        //     text: "前去修改", //loading显示的字符，空表示不显示文字
        //     showIcon: true
        //   })
        // })
        this.SomeOpen = true
        openLink('visible/index',res=>{
          this.SomeOpen = false
        })
      }
    }
  }
</script>

<style scoped>
  .view{
    background-color: #fff;
  }
  .detail{
    padding-left: 16px;
  }
  .box{
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgba(23,24,26,0.08);
    padding-top: 12px;
    padding-bottom: 12px;
    line-height: 24px;
    flex-direction: row;
    justify-content: flex-start;
  }
  .left-text{
    font-size: 16px;
    color: #17181A;
    width: 88px;
    padding-right: 24px;
    text-align: right;
    line-height:24px;
  }
  .right{
    padding-top: 1px;
    padding-bottom: 1px;
  }
  .right-text{
    font-size: 14px;
    color: #5C6066;
    line-height: 22px;
    width: 280px;
  }
  .submit{
    width:400px;
    height: 50px;
    background-color: #1571E5;
    align-items: center;
    justify-content: center;
    line-height: 50px;
    text-align: center;
    position: fixed;
    bottom:0;
    left:0;
  }
  .submit-text{
    color: #fff;
    font-size: 18px;
  }
  .view-box{
    padding-bottom: 50px;
  }
</style>
