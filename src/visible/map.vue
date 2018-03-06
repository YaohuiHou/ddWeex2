<template>
    <div class="map">
        <div class="shop" v-for="(item,index) in shop">
            <div class="item" @click="gotoLink('search/dealer')">
                <div class="left">
                    <text class="left-text">品牌</text>
                </div>
                <div class="right">
                    <text class="right-text">{{ item.BrandName }}</text>
                </div>
            </div>
            <div class="item" @click="gotoLink('search/dealer')">
                <div class="left">
                    <text class="left-text">店铺</text>
                </div>
                <div class="right">
                    <text class="right-text">{{ item.StoreName }}</text>
                    <text class="icon" @click="alertToast(index,0)">设置地址</text>
                </div>
            </div>
            <div class="item no-border" @click="gotoLink('search/dealer')">
                <div class="left">
                    <text class="left-text">详细地址</text>
                </div>
                <div class="right" v-if="item.disabled !== 'ok'">
                    <text class="right-text">{{ item.Address }}</text>
                    <text class="icon" @click="disableFun(index)">编辑</text>
                </div>
                <div class="right" v-else>
                    <input type="text" v-model="addresVal" class="right-text" placeholder="请输入详细地址"/>
                    <text class="icon" @click="alertToast(index,1)">保存</text>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import dingtalk from 'dingtalk-javascript-sdk';
    import {toast,getItem,setItem,jsapifun,openLink,getCheckin,closeLink,setUdlocation} from '../lib/util.js';
    export default {
        data(){
            return {
                // 经销商信息
                listsDetail:{},
                list:{},
                // 选中店铺
                shop:[],
                disable: false,
                visibleData: {},
                // 员工ID
                DingTalkUserId: '',
                // 经纬度
                CheckLatitude: '',
                CheckLongitude: '',
                // 拜访数据
                CheckInRecord: {},
                // 输入的地址
                addresVal:'',
                // 定位信息
                someResult:null
            }
        },
        created(){
            var me = this;
            
            getItem('StoreInfo',event=>{
                this.shop = JSON.parse(event.data)
            })

            // 签到信息
            getItem('CheckInRecord',event=>{
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
                    UserName: this.CheckInRecord.UserName
                }
            })

            // 获取选中的经销商
            getItem('DealerDetail',event=>{
                this.listsDetail = JSON.parse(event.data)
                this.visibleData.DealerId = this.listsDetail.DealerId
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
        },
        methods:{
            disableFun(i){
                let arr = [...this.shop]
                arr[i].disabled = 'ok'
                this.shop = arr
            },
            alertToast(i,n){
                if( n ){
                    this.submitFun(i)
                    return
                }
                var me = this;
                dingtalk.ready(()=>{
                    const dd = dingtalk.apis
                    // 弹窗
                    dd.device.notification.confirm({
                        message: "确认修改地址会将该地址同步到经销商前台",
                        title: "是否确认修改",
                        buttonLabels: ['确定', '取消'],
                        onSuccess : function(result) {
                            //onSuccess将在点击button之后回调
                            /*
                            {
                                buttonIndex: 0 //被点击按钮的索引值，Number类型，从0开始
                            }
                            */
                            if(result.buttonIndex == 0){
                                if( n ){
                                    me.submitFun(i)
                                }else{
                                    // 调取地图
                                    me.tomap(i)
                                }
                            }
                        },
                        onFail : function(err) {}
                    });
                })
            },
            // 调取地图
            tomap(i){
                var me = this
                // dingtalk.error(function(error) {
                //   toast(JSON.stringify(error))
                // })
                dingtalk.ready(()=>{
                    const dd = dingtalk.apis
                    dd.biz.map.locate({
                    latitude: me.CheckLatitude, // 纬度
                    longitude: me.CheckLongitude, // 经度
                    onSuccess: function (result) {
                        me.someResult = result
                        // 重新定位
                        me.uplocationFun(i,result)
                    },
                    onFail: function (err) {
                        // toast(JSON.stringify(err))
                    }
                    });
                })
            },
            // 地址更新ajax
            uplocationFun(i,result,addres){
                var me = this;
                setUdlocation(
                    JSON.stringify({
                        "Body": {
                        "DingTalkUserId": me.DingTalkUserId,
                        "DealerId": me.visibleData.DealerId,
                        "StoreId": me.shop[i].StoreId,
                        "Longitude": result ? result.longitude : me.CheckLongitude,
                        "Latitude": result ? result.latitude : me.CheckLatitude,
                        "Address": addres ? addres : result.snippet
                        }
                    }),
                    res=>{
                        var obj = JSON.parse(res.data) 
                        // 隐藏 重新定位
                        if(obj.Body){
                            me.shop[i].Address = addres ? addres : result.snippet
                            let arr = [...this.shop]
                            arr[i].disabled = null
                            setItem('StoreInfo',JSON.stringify(arr))
                            // 提示前一页修改成功
                            setItem('setOkStore',1)
                            toast('地址已经修改成功！')
                        }else{
                            toast('定位失败，重新定位')
                        }
                    }
                )
            },
            // 点击保存
            submitFun(i){
                if(this.addresVal.length > 0){
                    this.uplocationFun(i,this.someResult,this.addresVal)
                }else{
                    toast('请输入您想要修改的地址')
                }
            }
        }
    }
</script>

<style scoped>
    .map{
    background-color: #FAFBFC;
    width: 400px;
    }
  .shop{
     background-color: #fff; 
     padding-left: 16px;
     width: 400px;
     margin-bottom: 8px;
  }
  .item{
    height: 48px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgba(23,24,26,0.08);
  }
  .no-border{
     border-bottom-width: 0;
    border-bottom-style: none;
  }
  .left,.right{
    flex-direction: row;
  }
  .left{
    width: 80px;
  }
  .right{
    width: 320px;
    align-items: center;
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
    width: 70px;
    height: 48px;
    line-height: 48px;
    color: #1571E5;
    font-size: 14px;
    text-align: right;
  }
  .right-text{
    font-size: 16px;
    color: #17181A;
    width: 220px;
    height: 48px;
    line-height: 48px;
    overflow: hidden;
    text-align: left;
  }
</style>
