<template>
  <div class="search">
    <list @loadmore="fetch" loadmoreoffset="10">
      <!-- 搜索框 -->
      <header>
        <div class="header-box">
          <div class="soso">
            <image class="img" src="https://s.kcimg.cn/dingtalk/image/soso.png" style="width:18px;height:18px;"></image>
            <input type="text" placeholder="搜索经销商" class="input" value="" @input="search"/>
          </div>
        </div>
      </header>
      <!-- 查询 -->
      <cell class="item" v-for="(items,index) in lists" v-bind:key="index">
        <div class="box">
          <text :class="[items.className == true ? 'selected' : 'text' ]" @click="changed(index)">{{items.DealerName}}</text>
        </div>
      </cell>
    </list>
    <shopView v-if="shopShow"></shopView>
  </div>
</template>
<script>
  import dingtalk from 'dingtalk-javascript-sdk';
  import {toast,getDealerList,getItem,setItem,removeItem,openLink,closeLink,goBackLink} from '../lib/util.js';
  export default {
    data(){
      return {
        dduserid:0,
        page:1,
        nextIndex: -1,
        lists:[
        ],
        PageCount:0,
        // 输入文案
        searchValue:'',
        // 不去搜索店铺
        dealerSearch:false
      }
    },
    mounted: function(){
      dingtalk.ready(function(){
        const dd = dingtalk.apis;
        // title
        dd.biz.navigation.setTitle({
            title: '选择经销商'
        });
        // });
      })
    },
    created(){
      // 获取uid
      getItem('DingTalkUserId',event=>{
        this.dduserid = event.data
        // 第一次搜索
        this.search({value:''})
      })
      
      // 是否从经销商过来
      getItem('DealerSearch',event=>{
        if(event.data == 'ok'){
          this.dealerSearch = true
          removeItem('DealerSearch');
        }
      })
      
      removeItem('StoreInfo')
    },
    methods:{
      // 经销商搜索
      search(event,page){
        if(!this.dduserid) return;
        // 搜索 ajax
        this.searchValue = event.value
        let pageText = page ? page : 1
        getDealerList(
          JSON.stringify({
            "Body": { 
              // 用户钉钉id
              "DingTalkUserId": this.dduserid,
              // 输入信息
              "DealerName" : event.value
              },
              "Paged": {
                "PageIndex": pageText,
                "PageSize": 20
              }
            }) 
          ,res=>{
            if(!page){
              this.lists = []
            }
            let obj = JSON.parse(res.data)
            obj.Body.forEach(ele=>{
              this.lists.push(ele)
            })
            // 总页数
            this.PageCount = obj.Paged.PageCount
          }
        )
      },
      // 选择经销商
      changed(index){
        if(this.SomeOpen) return;
        this.SomeOpen = true
        /*
        *  判断是否有上一个，有就干掉
        *  保存index，为下次准备
        */
        if(this.nextIndex !== -1){
          this.$set(this.lists[this.nextIndex],'className',false)
        }
        this.nextIndex = index

        if(!this.lists[index].className){
          this.$set(this.lists[index],'className',true)
        }
        // 储存选择
        setItem('DealerDetail',JSON.stringify(this.lists[index]),event=>{
          if(this.dealerSearch){
            // 返回上一页
            goBackLink()
          }else{
            weex.config.env.platform.toLowerCase() === 'android' ? setTimeout(closeLink, 200) : closeLink()
            openLink('search/shop', res => {
              this.SomeOpen = false
              
            }, err => {
              toast(err)
            })

            // 关闭当前页面
            // closeLink()
            // // 打开当前店铺页
            // openLink('search/shop',res=>{
              
            //   this.SomeOpen = false
            // })
          }
          
        })

      },
      // 滚动加载
      fetch: function(){
        this.page += 1;
        if(this.PageCount > this.page){
          // ajax
          this.search({value: this.searchValue},this.page)
        }
      }
    }
  }
</script>

<style scoped>
  .search{
    background-color: #F3F4F5;
  }
  .header-box{
    height: 64px;
    background-color: #F3F4F5;
  }
  .soso{
    height: 40px;
    background-color: #fff;
    width: 368px;
    margin-left: 16px;
    margin-right: 16px;
    margin-top: 12px;
    margin-bottom: 12px;
    border-bottom-left-radius : 4px;
    border-bottom-right-radius : 4px;
    border-top-left-radius : 4px;
    border-top-right-radius : 4px;
    flex-direction: row;
    align-items: center;
  }
  .img{
    margin-left: 11px;
    margin-right: 11px;
  }
  .input{
    height: 40px;
    line-height: 40px;
    width: 350px;
    font-size: 16px;
    placeholder-color: #A1A9B3;
    color: #17181A;
  }
  .item{
    background-color: #fff;
    padding-left: 16px;
    height: 48px;
  }
  .box{
    width: 384px;
    height: 48px;
    line-height: 48px;
    padding-right: 16px;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgba(23,24,26,0.08);
    justify-content: flex-start;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .box:last-child{
    border-top-width: none;
  }
  .text{
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    color: #17181A;
  }
  .selected{
    color: #1571E5;
    height: 48px;
    line-height: 48px;
    font-size: 16px;
  }
</style>
