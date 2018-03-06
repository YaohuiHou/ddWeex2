<template>
  <div class="list">
    <!-- 经销商 -->
    <div class="dealer item" @click="gotoLink('search/dealer')">
      <text class="text-left">经销商</text>
      <div class="right">
        <text :class="[ DealerId === '请选择经销商' ? 'text-right' : 'selected' ]">{{DealerId}}</text>
        <div class="icon"></div>
      </div>
    </div>
    <!-- 店铺 -->
    <!-- <div class="shop item" @click="gotoLink('search/shop')">
      <text class="text-left">店铺</text>
      <div class="right">
        <text :class="[ StoreName === '请选择店铺' ? 'text-right' : 'selected' ]">{{StoreName}}</text>
        <div class="icon"></div>
      </div>
    </div> -->
  </div>
</template>
<script>
  import {openLink,setItem,removeItem} from '../lib/util.js';
  export default {
    props:['DealerId','StoreName'],
    data(){
      return {
      }
    },
    created(){
      
    },
    methods:{
      gotoLink(type){
        // 跳到搜索页
        if(this.SomeOpen) return;
        this.SomeOpen = true

        removeItem('submitok')
        removeItem('DealerDetail',res=>{
          // 储存选择
          setItem('DealerSearch','ok',event=>{

            this.$emit('dealerFun','ok')
            openLink(type,res=>{
              this.SomeOpen = false
            })
          })
        })
        
      }
    }
  }
</script>

<style scoped>
  .list{
    background-color: #fff;
    padding-left: 16px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: #D8D8D8;
  }
  .item{
    padding-top: 12px;
    padding-bottom: 12px;
    height: 48px;
    flex-direction: row;
    justify-content: space-between;
  }
  .dealer{
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgba(23,24,26,0.08);
  }
  .right{
    flex-direction: row;
    align-items: center;
    width: 310px;
  }
  .text-left,.text-right{
    font-size: 16px;
    line-height: 24px;
    
  }
  .text-left{
    color: #17181A;
    width: 80px;
  }
  .text-right{
    color: #A1A9B3;
    width: 278px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .selected{
    color: #17181A;
    width: 278px;
    overflow: hidden;
    height: 24px;
    font-size: 16px;
    line-height: 24px;
    text-align: right;
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
</style>

