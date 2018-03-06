<template>
  <div class="header">
    <scroller>
      <!-- 输入 -->
      <div class="item" v-for="item in lists">
        <div class="left">
          <text class="left-text">{{ item.name }}</text>
          <text class="must" v-if="item.must">*</text>
        </div>
        <div class="right">
          <text class="right-text" v-if="item.value.length > 0">{{ item.value }}</text>
          <input :type="item.inoputType" v-else class="input" maxlength="11" @input="inputFun($event,item.index,item.type,item.name)" :value="item.value" :placeholder="item.placeholder" />
        </div>
      </div>

      <!-- 线索销量 -->
      <div class="item" v-if="visibleTypeChange == 8 || (visibleTypeChange == 2 && IsCooperation)">
        <div class="left">
          <text class="left-text">线索销量(条)</text>
          <text class="must">*</text>
        </div>
        <div class="right">
          <input type="tel" class="input" @input="inputFun($event,-1,'LeadsSales')" placeholder="从合作开始到回访时间内的销量" />
        </div>
      </div>
      <!-- 成交比例 -->
      <div class="item" v-if="visibleTypeChange == 8 || (visibleTypeChange == 2 && IsCooperation)">
        <div class="left">
          <text class="left-text">成交比例(%)</text>
          <text class="must">*</text>
        </div>
        <div class="right">
          <input type="tel" class="input" @input="inputFun($event,-1,'VolumeRatio')" placeholder="请输入百分比" />
        </div>
      </div>

      <!-- 客户意向 -->
      <div class="item" v-if="visibleTypeChange == 1">
        <div class="left">
          <text class="left-text">客户意向类型</text>
          <text class="must">*</text>
        </div>
        <div class="right change-box" @click="gotolink('register/type')">
          <text :class="[ intentionType != '请选择' ? 'right-text' : 'right-change' ]">{{intentionType}}</text>
          <div class="icon"></div>
        </div>
      </div>
      <!-- 活动类型 -->
      <div class="item" v-if="visibleTypeChange == 6">
        <div class="left">
          <text class="left-text">活动类型</text>
          <text class="must">*</text>
        </div>
        <div class="right change-box" @click="gotolink('register/activity')">
          <text :class="[ activityType != '请选择' ? 'right-text' : 'right-change' ]">{{activityType}}</text>
          <div class="icon"></div>
        </div>
      </div>
      <!-- 培训 -->
      <div class="item" v-if="visibleTypeChange == 7">
        <div class="left">
          <text class="left-text">培训内容</text>
          <text class="must">*</text>
        </div>
        <div class="right change-box" @click="gotolink('register/content')">
          <text :class="[ contentType != '请选择' ? 'right-text' : 'right-change' ]">{{contentType}}</text>
          <div class="icon"></div>
        </div>
      </div>
      <div class="item" v-if="visibleTypeChange == 7">
        <div class="left">
          <text class="left-text">培训原因</text>
          <text class="must">*</text>
        </div>
        <div class="right change-box" @click="gotolink('register/reason')">
          <text :class="[ reasonType != '请选择' ? 'right-text' : 'right-change' ]">{{reasonType}}</text>
          <div class="icon"></div>
        </div>
      </div>
      <!-- 培训输入 -->
      <div class="item" v-if="visibleTypeChange == 7">
        <div class="left">
          <text class="left-text">被培训人姓名</text>
          <text class="must">*</text>
        </div>
        <div class="right">
          <input type="text" class="input" @input="inputFun($event,-1,'ByTrainingName','TrainingInfoModel')" placeholder="多人填写多人培训" />
        </div>
      </div>
      <div class="item" v-if="visibleTypeChange == 7">
        <div class="left">
          <text class="left-text">被培训人职务</text>
          <text class="must">*</text>
        </div>
        <div class="right">
          <input type="text" class="input" @input="inputFun($event,-1,'ByTrainingPosition','TrainingInfoModel')" placeholder="请输入职务" />
        </div>
      </div>
      <!-- 拜访内容 -->
      <div class="change" v-if="(visibleTypeChange == 2 && IsCooperation)">
        <div class="top">
          <div class="left top-left">
            <text class="left-text">拜访内容</text>
            <text class="must">*</text>
          </div>
        </div>
        <div class="input-box">
          <textarea type="text" @input="inputFun($event,-1,'VisitContent')" placeholder="请输入拜访内容" class="input" rows="4"/>
        </div>
      </div>
      <!-- 选择 输入 -->
      <div class="change" v-if="visibleTypeChange == 1">
        <div class="top">
          <div class="left top-left">
            <text class="left-text">是否知道卡车之家</text>
            <text class="must">*</text>
          </div>
          <div class="right">
            <div class="select-box" @click="changeBoxFun(0,false)">
              <image class="img" :src="selected[changeArr[0].selected ? 0 : 1 ]" style="width:18px;height:18px;"></image>
              <text class="text">知道</text>
            </div>
            <div class="select-box" @click="changeBoxFun(0,true)">
              <image class="img" :src="selected[changeArr[0].selected ? 1 : 0]" style="width:18px;height:18px;"></image>
              <text class="text">不知道</text>
            </div>
          </div>
        </div>
        <div class="input-box" v-if="changeArr[0].selected">
          <textarea type="text" @input="inputFun($event,-1,'CommentContent')" placeholder="请输入对卡车之家的印象和评价" class="input" rows="4"/>
        </div>
      </div>
      <!-- 选择 输入 -->
      <div class="change" v-if="visibleTypeChange == 1">
        <div class="top">
          <div class="left top-left">
            <text class="left-text">是否合作其他家</text>
            <text class="must">*</text>
          </div>
          <div class="right">
            <div class="select-box" @click="changeBoxFun(1,false)">
              <image class="img" :src="selected[changeArr[1].selected ? 0 : 1]" style="width:18px;height:18px;"></image>
              <text class="text">有</text>
            </div>
            <div class="select-box" @click="changeBoxFun(1,true)">
              <image class="img" :src="selected[changeArr[1].selected ? 1 : 0]" style="width:18px;height:18px;"></image>
              <text class="text">无</text>
            </div>
          </div>
        </div>
        <div class="input-box" v-if="!changeArr[1].selected">
          <textarea type="text" @input="inputFun($event,-1,'OtherCooperation')" placeholder="请输入合作的企业" class="input" rows="4"/>
        </div>
      </div>

      <!-- 销量 -->
      <div class="item" v-if="visibleTypeChange == 1">
        <div class="left">
          <text class="left-text">客户年销量(台)</text>
          <text class="must">*</text>
        </div>
        <div class="right">
          <input type="tel" @input="inputFun($event,-1,'SalesVolume')" class="input" placeholder="请输入销量" />
        </div>
      </div>
      <!-- 拜访结果 -->
      <div class="item" v-if="visibleTypeChange == 1 || visibleTypeChange == 2 || visibleTypeChange == 3">
        <div class="left">
          <text class="left-text">拜访结果</text>
          <text class="must">*</text>
        </div>
        <div class="right">
          <input type="text" class="input" @input="inputFun($event,-1,'VisitContent')" placeholder="请输入拜访结果" />
        </div>
      </div>
      <!-- 计划 -->
      <div class="change" v-if="visibleTypeChange == 1 || visibleTypeChange == 2 || visibleTypeChange == 3">
        <div class="top">
          <div class="left top-left">
            <text class="left-text">谈判计划</text>
            <text class="must">*</text>
          </div>
        </div>
        <div class="input-box">
          <textarea type="text" @input="inputFun($event,-1,'NegotiationPlan')" placeholder="请输入下一步谈判计划" class="input" rows="4"/>
        </div>
      </div>
      <!-- 回访内容 -->
      <div class="change" v-if="visibleTypeChange == 8">
        <div class="top">
          <div class="left top-left">
            <text class="left-text">回访内容</text>
            <text class="must">*</text>
          </div>
        </div>
        <div class="input-box">
          <textarea type="text" @input="inputFun($event,-1,'VisitContent')" placeholder="请输入回访内容" class="input" rows="4"/>
        </div>
      </div>
      <!-- 客户产品建议 -->
      <div class="change" v-if="visibleTypeChange == 8 || (visibleTypeChange == 2 && IsCooperation)">
        <div class="top">
          <div class="left top-left">
            <text class="left-text">客户产品建议</text>
          </div>
        </div>
        <div class="input-box">
          <textarea type="text" @input="inputFun($event,-1,'CustomerSuggestion')" placeholder="请输入客户产品建议" class="input" rows="4"/>
        </div>
      </div>
      <!-- 是否打款 -->
      <div class="change" v-if="visibleTypeChange == 4 || visibleTypeChange == 5 || visibleTypeChange == 9 || visibleTypeChange == 10">
        <div class="top">
          <div class="left top-left">
            <text class="left-text">是否打款</text>
            <text class="must">*</text>
          </div>
          <div class="right">
            <div class="select-box money" @click="changeBoxFun(2,false)">
              <image class="img" :src="selected[changeArr[2].selected ? 0 : 1]" style="width:18px;height:18px;"></image>
              <text class="text">已打款</text>
            </div>
            <div class="select-box money" @click="changeBoxFun(2,true)">
              <image class="img" :src="selected[changeArr[2].selected ? 1 : 0]" style="width:18px;height:18px;"></image>
              <text class="text">未打款</text>
            </div>
          </div>
        </div>
      </div>
      <!-- 购买原因 -->
      <div class="change" v-if="visibleTypeChange == 4 || visibleTypeChange == 5 || visibleTypeChange == 9 || visibleTypeChange == 10">
        <div class="top">
          <div class="left top-left">
            <text class="left-text">购买原因</text>
          </div>
        </div>
        <div class="input-box">
          <textarea type="text" @input="inputFun($event,-1,'VisitContent')" placeholder="请输入购买原因" class="input" rows="4"/>
        </div>
      </div>
      <!-- 成功分享 -->
      <div class="change" v-if="visibleTypeChange == 4 || visibleTypeChange == 5 || visibleTypeChange == 9 || visibleTypeChange == 10">
        <div class="top">
          <div class="left top-left">
            <text class="left-text">成功分享</text>
          </div>
        </div>
        <div class="input-box">
          <textarea type="text" @input="inputFun($event,-1,'SuccessShare')" placeholder="请输入成功经验" class="input" rows="4"/>
        </div>
      </div>
      <!-- 活动内容 -->
      <div class="change" v-if="visibleTypeChange == 6">
        <div class="top">
          <div class="left top-left">
            <text class="left-text">活动内容</text>
          </div>
        </div>
        <div class="input-box">
          <textarea type="text" @input="inputFun($event,-1,'VisitContent')" placeholder="请输入活动内容" class="input" rows="4"/>
        </div>
      </div>
      <div class="change" v-if="visibleTypeChange != 4 && visibleTypeChange != 5 && visibleTypeChange != 9 && visibleTypeChange != 10">
        <div class="top">
          <div class="left top-left">
            <text class="left-text">发现问题</text>
          </div>
        </div>
        <div class="input-box">
          <textarea type="text" @input="inputFun($event,-1,'QuestionContent')" placeholder="请输入发现的问题" class="input" rows="4"/>
        </div>
      </div>
      <!-- 保存 -->
      <div class="next" @click="submit">
        <text class="next-text">保存</text>
      </div>
    </scroller>
  </div>
</template>
<script>
  import {toast,getItem,setItem,openLink,visibleAddFun,closeLink} from '../lib/util.js';
  import dingtalk from 'dingtalk-javascript-sdk';
  export default {
    data(){
      return {
        selected:[
          'https://s.kcimg.cn/dingtalk/image/circle.png',
          'https://s.kcimg.cn/dingtalk/image/yes.png'
        ],
        lists:[
          {
            name:'拜访客户',
            value:'',
            must: false,
            placeholder:"请输入拜访客户"
          },
          {
            name:'拜访类别',
            value:'',
            must:false,
            placeholder:"选择拜访类别"
          }
        ],
        // 单选
        changeArr:[
          {selected:false},
          {selected:true},
          {selected:true},
        ],
        intentionType: "请选择",
        activityType: "请选择",
        contentType: "请选择",
        reasonType: "请选择",
        // 活动
        activityChange: {},
        // 培训
        trainContent: {},
        trainReason: {},
        timer:null,
        // 拜访类型
        visibleTypeChange: 0,
        // 是否可以保存
        isCanSubmit: false,
        // 需要提交的信息
        visibleData: null,
        // 是否签单了
        IsCooperation: false
      }
    },
    watch:{
      intentionType(val){
        clearInterval(this.timer)
      },
      activityType(val){
        // clearInterval(this.timer)
        // toast(this.activityType)
      },
      contentType(val){
        clearInterval(this.timer)
      },
      reasonType(val){
        clearInterval(this.timer)
      },
    },
    created(){

      // 提交信息
      getItem('visibleData',event=>{
        let data = JSON.parse(event.data)
        if (data !== undefined) {
          this.visibleData = data
          // 活动不加联系人
          if(this.visibleTypeChange != 6){
            this.visibleData.ContactInfoList = []
          }
        }
      })
      getItem('StoreInfo',event=>{
        let data = JSON.parse(event.data)
        if (data !== undefined) {
          this.IsCooperation = data.IsCooperation
        }
      })
      // 获取缓存数据
      this.obtainData()

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
    methods:{
      realTime(){
        this.timer && clearInterval(this.timer)
        this.timer = setInterval(()=>{
          // 获取意向
          getItem('intentionType',event=>{
            let data = JSON.parse(event.data)
            if (data !== undefined) {
              this.intentionType = data.name

              this.visibleData.IntentionType = data.value
              if(data.value === 5){
                this.visibleData.RefusalReason = data.some
              }
            }
          })
          // 获取活动类型
          getItem('visibleActivity',event=>{
            let data = JSON.parse(event.data)
            if (data !== undefined) {
              this.activityType = ''
              var num = 0
              data.forEach(element => {
                if(element.selectedClass){
                  this.activityType += element.name + ' '
                  let obj = {
                    'ActivityType' : element.value,
                    'ActivityTypeText' : element.name
                  }
                  this.visibleData.ActivityInfoList[num] = obj
                  num++
                }
              });
            }
          })
          // 培训原因
          getItem('TrainingReason',event=>{
            let data = JSON.parse(event.data)
            if (data !== undefined) {
              this.reasonType = data.name
              this.trainReason = data
              this.visibleData.TrainingInfoModel.TrainingReason = data.name
            }
          })
          // 培训内容
          getItem('TrainingContent',event=>{
            let data = JSON.parse(event.data)
            if (data !== undefined) {
              this.contentType = data.name
              this.trainContent = data
              this.visibleData.TrainingInfoModel.TrainingContent = data.name
            }
          })
        },200)
      },
      // 获取数据
      obtainData(){
        // 店铺信息
        getItem('StoreInfo',event=>{
          let data = JSON.parse(event.data)
          if (data !== undefined) {
            this.$set(this.lists[0],'value',data[0].StoreName)
          }
        })
        // 类型
        getItem('visibleType',event=>{
          // 关闭load
          dingtalk.ready(function(){
            dingtalk.apis.device.notification.hidePreloader()
          });

          let data = JSON.parse(event.data)
          if (data !== undefined) {
            this.$set(this.lists[1],'value',data.name)
            // 类型参数
            this.visibleTypeChange = data.value
            
            switch (this.visibleTypeChange) {
              case 1: // 初次拜访
                // 是否知道卡车之家
                this.visibleData.IsKnow = 1
                // 是否有其他合作者
                this.visibleData.OtherCooperation = '无'
                break;
              case 6:
                // 活动
                this.visibleData.ActivityInfoList = []
                break;
              case 7:
                // 培训
                this.visibleData.TrainingInfoModel = {}
                break;
            }
          }
        })
        // 级别
        getItem('visibleLevel',event=>{
          let data = JSON.parse(event.data)
          if (data !== undefined) {
            if(this.visibleTypeChange === 7 || this.visibleTypeChange === 6 ) return;
            var num = 0
            data.forEach(element => {
              if( element.selectedClass ){
                let name = {
                  name: element.name,
                  value:'',
                  must:true,
                  placeholder:"请输入姓名或称呼",
                  type: 'RealName',
                  index: num,
                  inoputType: 'text'
                }
                let tel = {
                  name: element.name+'电话',
                  value:'',
                  must:false,
                  placeholder:"请输入联系电话",
                  type: 'Telephone',
                  index: num,
                  inoputType: 'tel'
                }
                this.lists.push(name)
                this.lists.push(tel)
                this.visibleData.ContactInfoList[num] = {}
                num ++;
              }
            });
          }
        })
      },
      // 单选项
      changeBoxFun(n,b){
        if(this.changeArr[n].selected === b) return;
        this.changeArr[n].selected = b
      },
      // 保存输入信息
      inputFun(event,index,name,type){
        if(type && index == -1){
          // 为大类增加
          if( type === 'TrainingInfoModel'){
            this.visibleData[type][name] = event.value
          }else{
            this.visibleData[type] = {}
            this.visibleData[type][name] = event.value
          }
        }else if(index != -1){
          this.visibleData.ContactInfoList[index][name] = event.value
          // type 在这里单独为职位赋值
          if(name == "RealName"){
            this.visibleData.ContactInfoList[index].Position= type
          }
        }else{
          this.visibleData[name] = event.value
        }
        
      },
      gotolink(type){
        // 页面跳转
        if(this.SomeOpen) return;
        this.SomeOpen = true
        // 定时器
        this.realTime()
        openLink(type,res=>{
          this.SomeOpen = false
        })
      },
      // 提交保存
      submit(){
        var me = this
        switch (this.visibleTypeChange) {
          case 1:
            me.firstVist();
            break;
          case 2:
          case 3:
            // 签单与否
            if(!me.IsCooperation){
              me.newerVist();
            }else{
              // 新人签单后数据验证
              me.returnVisit()
            }
            break;
          case 6:
          // 活动
            me.activityVisit();
            break;
          case 7:
          // 培训
            me.TrainVisible();
            break;
          case 8:
          // 签单回访
            me.returnVisit();
            break;
          case 4:
          case 5:
          case 9:
          case 10:
          // 签单
            me.successVisit();
            break;
          case 100:
            // 其他
            me.isCanSubmit = true
            me.visibleNameFun()
        }
        // 可以保存 ？
        if(this.isCanSubmit){
          // 成功设置详情页是否有修改按钮
          setItem('submitok','1')
          dingtalk.ready(function(){
            dingtalk.apis.device.notification.showPreloader({
              text: "正在提交", //loading显示的字符，空表示不显示文字
              showIcon: true
            })
          })
          if(this.submitBtn) return;
          this.submitBtn = true
          // 提交
          visibleAddFun(
              JSON.stringify({
                 "Body": this.visibleData
                 }) 
            ,res=>{
              // 隐藏loading
              dingtalk.ready(function(){
                dingtalk.apis.device.notification.hidePreloader()
              })

              var obj = JSON.parse(res.data)
              if(obj.Body){
                toast('提交成功！')
                openLink('detail/index',res=>{
                  this.submitBtn = false
                })
                return;
              }else{
                this.submitBtn = false
                toast(res.data);
                return;
              }
            })
        }
      },
      // 其他
      visibleNameFun(){
        // 输入的姓名判断
        this.isCanSubmit = true
        this.visibleData.ContactInfoList.forEach(element => {
          if( !element.RealName || (element.RealName && element.RealName.trim() == '')){
            toast('请输入拜访人姓名或称呼',5)
            this.isCanSubmit = false
            return;
          }
        });
      },
      // 初次拜访
      firstVist(){
        if(this.intentionType == '请选择'){
          toast('请选择客户意向类型',5)
          return;
        }else if(this.visibleData.IsKnow == 0 && !this.visibleData.CommentContent  ){
          toast('请填写用户对卡车之家的评价',5)
          return;
        }else if( this.visibleData.IsKnow == 0 && this.visibleData.CommentContent.trim() == ''){
          toast('请填写客户年销售额（台）',5)
          return;
        }else if( !this.visibleData.SalesVolume || (this.visibleData.SalesVolume && this.visibleData.SalesVolume.trim() == '')){
          toast('请填写客户年销售额（台）',5)
          return;
        }else if(!this.visibleData.VisitContent || (this.visibleData.VisitContent && this.visibleData.VisitContent.trim() == '' )){
          toast('请填写拜访结果',5)
          return;
        }else if(!this.visibleData.NegotiationPlan || ( this.visibleData.NegotiationPlan && this.visibleData.NegotiationPlan.trim() == '')){
          toast('请输入下一步谈判计划',5)
          return;
        }
        // 可以通过
        this.isCanSubmit = true
        this.visibleNameFun()
      },
      // 新人首次拜访 && 未签单回访
      newerVist(){

        if( (this.visibleData.VisitContent && this.visibleData.VisitContent.trim() == '') || !this.visibleData.VisitContent){
          toast('请填写拜访结果',5)
          return;
        }else if( (this.visibleData.NegotiationPlan && this.visibleData.NegotiationPlan.trim() == '') || !this.visibleData.NegotiationPlan){
          toast('请输入下一步谈判计划',5)
          return;
        }
        // 可以通过
        this.isCanSubmit = true
        this.visibleNameFun()
      },
      // 签单回访 | 已签单、新人首次拜访
      returnVisit(){
        if((this.visibleData.LeadsSales && this.visibleData.LeadsSales.trim() == '') || !this.visibleData.LeadsSales){
          toast('请输入线索销量',5)
          return;
        }else if( ( this.visibleData.VolumeRatio && this.visibleData.VolumeRatio.trim() == '') || !this.visibleData.VolumeRatio){
          toast('请输入百分比',5)
          return;
        }else if( (this.visibleData.VisitContent && this.visibleData.VisitContent.trim() == '') || !this.visibleData.VisitContent){
          toast('请输入拜访内容',5)
          return;
        }
        // 可以通过
        this.isCanSubmit = true
        this.visibleNameFun()
      },
      // 成功回签
      successVisit(){
        // 是否打款了 添加到提交list
        this.visibleData.IsAlreadyPay = this.changeArr[2].selected ? 0 : 1;
        this.visibleData.IsGroup = 1

        this.visibleNameFun()
      },
      // 参加活动
      activityVisit(){
        if( this.activityType ==  "请选择"){
          toast('请选择活动类型',5)
          return;
        }
        // 可以通过
        this.isCanSubmit = true
      },
      // 培训
      TrainVisible(){
        if(this.contentType == '请选择'){
          toast('请选择培训的内容',5)
          return;
        }else if(this.reasonType == '请选择'){
          toast('请选择培训的原因',5)
          return;
        }else if( (this.visibleData.TrainingInfoModel.ByTrainingName && this.visibleData.TrainingInfoModel.ByTrainingName.trim() == '') || !this.visibleData.TrainingInfoModel.ByTrainingName){
          // toast('请输入被培训人姓名',5)
          toast(this.visibleData.TrainingInfoModel)
          return;
        }else if( (this.visibleData.TrainingInfoModel.ByTrainingPosition && this.visibleData.TrainingInfoModel.ByTrainingPosition.trim() == '') || !this.visibleData.TrainingInfoModel.ByTrainingPosition){
          toast('请输入被培训人职务',5)
          return;
        }
        // 可以通过
        this.isCanSubmit = true
      }
    }
  }
</script>

<style scoped>
  .header{
    background-color: #fff;
    padding-left: 16px;
  }
  .item,.change{
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgba(23,24,26,0.08);
  }
  .change{
    justify-content: flex-start;
    align-items: flex-start;
  }
  .item{
    height: 48px;
  }
  .left{
    width: 117px;
  }
  .top-left{
    width: 150px;
    text-align: left;
  }
  .change-box{
    align-items: center;
    justify-content: flex-end;
  }
  .left,.right{
    flex-direction: row;
    align-items: center;
  }
  .right{
    width: 265px;
  }
  .left-text{
    color: #17181A;
    font-size: 16px;
    height: 48px;
    line-height: 48px;
  }
  .must{
    color: #F7411C;
    font-size: 16px;
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
  .right-text{
    font-size: 16px;
    color: #17181A;
  }
  .right-change{
    font-size: 16px;
    color:#A1A9B3;
  }
  .zone-text{
    color: #A1A9B3;
    font-size: 16px;
  }
  .no-text{
    color: #F7411C;
    font-size: 16px;
    margin-left: 12px;
    margin-right: 16px;
  }
  .reason{
    align-items: flex-start;
    flex-direction: column;
    height: 173px;
  }
  .input-box{
    width: 368px;
    height: 96px;
    padding-left: 12px;
    padding-right: 12px;
    padding-top: 8px;
    padding-bottom: 8px;
    margin-bottom: 17px;
    border-width: 1px;
    border-style: solid;
    border-color: #D8D8D8;
    align-items: flex-start;
  }
  .input{
    width: 344px;
    color: #17181A;
    font-size: 16px;
    line-height: 24px;
  }
  .top{
    justify-content: flex-start;
    flex-direction: row;
    align-items: center;
    width: 340px;
  }
  .change{
    flex-direction: column;
  }
  .select-box{
    margin-left: 30px;
    flex-direction: row;
    align-items: center;
  }
  .img{
    margin-right: 3px;
  }
  .text{
    font-size: 16px;
    color: #17181A;
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
    margin-bottom: 30px;
    margin-top: 16px;
  }
  .next-text{
    color: #fff;
    font-size: 16px;
  }
  .money{
    margin-left:0;
    margin-right: 15px;
  }
</style>
