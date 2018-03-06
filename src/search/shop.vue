<template>
  <div class="search">
    <list>
      <!-- 店铺 -->
      <cell class="item" v-for="(item,index) in lists"  v-bind:key="index">
        <div class="box" @click="selectedFun(index)">
          <image class="img" :src="selected[ item.selected === true ? 1 : 0 ]" style="width:18px;height:18px;"></image>
          <text :class="[item.selected === true ? 'slected' : 'text']">{{item.StoreName}}</text>
          <!-- :class="item.selected === true ? 'slected' : 'text'" -->
        </div>
      </cell>
      <cell>
         <!-- 下一步 -->
        <div class="next" @click="nextBtn">
          <text class="next-text">保存</text>
        </div>
      </cell>
    </list>
  </div>
</template>
<script>
  import dingtalk from 'dingtalk-javascript-sdk';
  import {toast,getItem,setItem,openLink,replaceLink,goBackLink} from '../lib/util.js';
  export default {
    data(){
      return {
        lists:[
        ],
        selected:[
          'https://s.kcimg.cn/dingtalk/image/circle.png',
          'https://s.kcimg.cn/dingtalk/image/yes.png'
        ],
        nextIndex: -1
      }
    },
    mounted: function(){
      dingtalk.ready(function(){
        const dd = dingtalk.apis;
        // title
        dd.biz.navigation.setTitle({
            title: '选择店铺'
        });
        // });
      })
    },
    created(){
      // 获取选中的经销商
      getItem('DealerDetail',event=>{
        let shop = JSON.parse(event.data)
        this.lists = shop.DealerSubList
      })
    },
    methods:{
      // 选中店铺
      selectedFun(index){
        this.nextIndex = index

        this.$set(this.lists[index],'selected',!this.lists[index].selected)
      },
      // 保存，到下一步
      nextBtn(){
        if(this.SomeOpen) return;
        this.SomeOpen = true
        // 储存选择
        let storeArr = []
        this.lists.forEach(element => {
          if(element.selected){
            storeArr.push( element )
          }
          element.disabled = false
        });
        if(storeArr.length <= 0){
          toast('请选择店铺进行提交')
          this.SomeOpen = false
          return
        }
        setItem('StoreInfo',JSON.stringify(storeArr),event=>{
          this.SomeOpen = false
          // 返回上一页
          goBackLink()
        })
      }
    }
  }
</script>

<style scoped>
  .search{
    background-color: #F3F4F5;
  }
  .item{
    background-color: #fff;
    padding-left: 16px;
  }
  .box{
    width: 384px;
    padding-top: 12px;
    padding-right: 20px;
    padding-bottom: 12px;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgba(23,24,26,0.08);
    flex-direction: row;
  }
  .text{
    width: 344px;
    font-size: 16px;
    color: #17181A;
    line-height: 24px;
    word-wrap:break-word;
  }
  .slected{
    width: 344px;
    font-size: 16px;
    color: #1571E5;
    line-height: 24px;
    word-wrap:break-word;
  }
  .img{
    margin-left: 3px;
    margin-right: 7px;
    margin-top: 3px;
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
    margin-top: 50px;
  }
  .next-text{
    color: #fff;
    font-size: 16px;
  }
</style>
