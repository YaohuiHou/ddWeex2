<template>
    <div class="visible">
        <scroller class="scroller">
            <!-- 输入 -->
            <div class="item">
                <div class="left">
                    <text class="left-text">拜访客户</text>
                    <text class="must">*</text>
                </div>
                <div class="right">
                    <input type="text" class="input" v-model="otherVisit.DealerName" placeholder="请输入拜访客户名称" />
                </div>
            </div>
            <div class="item">
                <div class="left">
                    <text class="left-text">拜访类别</text>
                    <!-- <text class="must">*</text> -->
                </div>
                <div class="right">
                    <text class="right-text">其他商业配合拜访</text>
                </div>
            </div>

            <div class="item" @click="gotoLink('visible/time')">
                <div class="left">
                    <text class="left-text">拜访时长</text>
                    <text class="must">*</text>
                </div>
                <div class="right change-box">
                    <text :class="[ otherVisit.VisitHoursText != '请选择拜访时长' ? 'right-text' : 'right-time' ]">{{ otherVisit.VisitHoursText }}</text>
                    <div class="icon"></div>
                </div>
            </div>

            <!-- 拜访详情 -->
            <div class="change">
                <div class="top">
                    <div class="left top-left">
                        <text class="left-text">拜访详情</text>
                        <text class="must">*</text>
                    </div>
                </div>
                <div class="input-box">
                    <textarea type="text" placeholder="请输入拜访详情" v-model="otherVisit.VisitContent" class="input textarea" rows="4"/>
                </div>
            </div>
            <!-- 发现问题 -->
            <div class="change">
                <div class="top">
                    <div class="left top-left">
                        <text class="left-text">发现问题</text>
                    </div>
                </div>
                <div class="input-box">
                    <textarea type="text" v-model="otherVisit.QuestionContent" placeholder="请输入未匹配原因，待审核" class="input textarea" rows="4"/>
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
    import dingtalk from 'dingtalk-javascript-sdk';
    import {toast,getItem,setItem,openLink,closeLink,visibleAddotherFun} from '../lib/util.js';
    export default {
        data (){
            return {
                otherVisit:{
                    "CheckinRecordId": 0,
                    "DealerName": "",
                    "UserId": 0,
                    "UserName": "",
                    "IsEffective": 1,
                    "InvalidReason": "",
                    "VisitHoursText": "请选择拜访时长",
                    "VisitContent": "",
                    "QuestionContent": ""
                }
            }
        },
        created(){
            setItem('visibleTimer')

            getItem('visibleData',event=>{
                let data = JSON.parse(event.data)
                this.otherVisit = {
                    "CheckinRecordId": data.CheckinRecordId,
                    "DealerName": "",
                    "UserId": data.UserId,
                    "UserName": data.UserName,
                    "IsEffective": 1,
                    "InvalidReason": "",
                    "VisitHoursText": "请选择拜访时长",
                    "VisitContent": "",
                    "QuestionContent": ""
                }
            })
        },
        methods:{
            gotoLink(view){
                if(this.SomeOpen) return;
                this.SomeOpen = true
                // 到指定页面
                openLink(view,res=>{
                    this.SomeOpen = false
                })
                let timer = setTimeout(() => {
                    this.SomeOpen = false
                    this.timerFun()
                    clearTimeout(timer)
                }, 300);
            },
            timerFun(){
                this.timer && clearInterval(this.timer)
                this.timer = setInterval(()=>{
                    // 拜访时长
                    getItem('visibleTimer',event=>{
                        let data = JSON.parse(event.data)
                        if (data !== undefined) {
                            this.otherVisit.VisitHoursText = data.name
                            toast(data)
                            this.timer && clearInterval(this.timer)
                        }
                    })
                },200)
            },
            submit(){
                if(this.otherVisit.DealerName.trim() == ''){
                    toast('请输入拜访客户名称',5)
                    return;
                }else if(this.otherVisit.VisitHoursText == '请选择拜访时长'){
                    toast('请选择拜访时长',5)
                    return;
                }else if(this.otherVisit.VisitContent.trim() == ''){
                    toast('请填写拜访客户详情',5)
                    return;
                }
                dingtalk.ready(function(){
                dingtalk.apis.device.notification.showPreloader({
                    text: "正在提交", //loading显示的字符，空表示不显示文字
                    showIcon: true
                })
                })
                if(this.submitBtn) return;
                this.submitBtn = true

                // 成功设置详情页是否有修改按钮
                setItem('submitok','1')

                // 提交
                visibleAddotherFun(
                    JSON.stringify({
                    "Body": this.otherVisit
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
        }
    }
</script>


<style scoped>
  .visible{
    background-color: #F3F4F5;
  }
  .item,.change{
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgba(23,24,26,0.08);
    padding-left: 16px;
    background-color: #fff;
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
    padding-right: 0;
  }
  .left,.right{
    flex-direction: row;
    align-items: center;
  }
  .right{
    width: 265px;
    justify-content: flex-end;
    padding-right: 16px;
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
    text-align: right;
  }
  .right-time{
      color: #A1A9B3;
      font-size: 16px;
      text-align: right;
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
    text-align: right;
  }
  .textarea{
     text-align: left; 
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
    margin-left: 16px;
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