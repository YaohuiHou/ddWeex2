<template>
  <div class="other">
    <div class="item" @click="gotoLink('visible/type')">
      <div class="left">
        <text class="left-text">拜访类别</text>
        <text class="must">*</text>
      </div>
      <div class="right">
        <text :class="[ visibleType != '请选择拜访类别' ? 'selected' : 'right-text' ]">{{ visibleType }}</text>
        <div class="icon"></div>
      </div>
    </div>
    <div class="item" @click="gotoLink('visible/time')">
      <div class="left">
        <text class="left-text">拜访时长</text>
        <text class="must">*</text>
      </div>
      <div class="right">
        <text :class="[ visibleTimer != '请选择拜访时长' ? 'selected' : 'right-text' ]">{{ visibleTimer }}</text>
        <div class="icon"></div>
      </div>
    </div>
    <div class="item" @click="gotoLink('visible/level')">
      <div class="left">
        <text class="left-text">被访人级别</text>
        <text class="must">*</text>
      </div>
      <div class="right">
        <text :class="[ visibleLevel != '请选择被访人级别' ? 'selected' : 'right-text' ]">{{ visibleLevel }}</text>
        <div class="icon"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {toast,openLink,getItem} from '../lib/util.js';
  import dingtalk from 'dingtalk-javascript-sdk';
  export default {
    props:['visibleType','visibleTimer','visibleLevel','IsCooperation'],
    data(){
      return{

      }
    },
    created(){
    },
    methods:{
      gotoLink(view){
        if(this.SomeOpen) return;
        this.SomeOpen = true
        // 到指定页面
        this.$emit('timerFun',1)
        if(view === 'visible/type' && this.IsCooperation ){
          openLink('visible/type-ok',res=>{
            this.SomeOpen = false
          })
        }else{
          openLink(view,res=>{
            this.SomeOpen = false
          })
        }
        let timer = setTimeout(() => {
          this.SomeOpen = false
          clearTimeout(timer)
        }, 300);
      }
    }
  }
</script>

<style scoped>
  .other{
    background-color: #fff;
    margin-top: 8px;
    margin-bottom: 16px;
    padding-left: 16px;
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
  .left,.right{
    flex-direction: row;
    align-items: center;
  }
  .left{
    width: 100px;
  }
  .right{
    width: 284px;
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
    color: #A1A9B3;
    width: 252px;
    height: 48px;
    line-height: 48px;
    text-align: right;
  }
  .selected{
    font-size: 16px;
    color: #17181A;
    width: 252px;
    height: 48px;
    line-height: 48px;
    overflow: hidden;
    text-align: right;
  }
</style>
