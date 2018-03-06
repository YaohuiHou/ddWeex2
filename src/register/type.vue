<template>
  <div class="type-view">
    <scroller class="view">
      <div :class="[index != 4 ? 'box' : 'box other' ]" v-for="(item,index) in lists">
        <div class="left">
          <text @click="changeFun(index)" :class="[item.selectedClass ? 'selected' : 'text' ]">{{item.name}}</text>
          <text v-if="index == 4" :class="[item.selectedClass ? 'selectedok' : 'ok' ]" @click="letGo">确认</text>
        </div>
        <div class="right" v-if="index == 4">
          <textarea type="text" class="input" placeholder="请输入拒绝原因" rows="4" :value="item.some" @input="inputFun"/>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import {toast,setItem,getItem,goBackLink} from '../lib/util.js';
  import dingtalk from 'dingtalk-javascript-sdk';
  export default {
    data(){
      return {
        lists:[
          {name:'已签约，未打款',value:1,selectedClass:false},
          {name:'非常有意向，已经进入签约价格谈判阶段',value:2,selectedClass:false},
          {name:'有意向，处于沟通阶段',value:3,selectedClass:false},
          {name:'没有拒绝，但是又没有反对合作，处于了解阶段',value:4,selectedClass:false},
          {name:'无意向，拒绝合作',value:5,selectedClass:false,some:''},
        ],
        nextIndex: -1,
        otherType: "",
        otherClass: false
      }
    },
    created(){
      getItem('intentionType',event=>{
        let data = JSON.parse(event.data)
        if( data !== undefined ){     // 其他
          this.lists[data.value-1].selectedClass = true
          if(data.value === 5){
            this.lists[data.value-1].some = data.some
          }
        }
      })
    },
    methods:{
      // 选中
      changeFun(index){
        if(this.SomeOpen || index == 4) return;
        this.SomeOpen = true
        /*
        *  判断是否有上一个，有就干掉
        *  保存index，为下次准备
        */
        if(this.nextIndex !== -1){
          this.$set(this.lists[this.nextIndex],'selectedClass',false)
        }
        this.nextIndex = index
        this.$set(this.lists[index],'selectedClass',true)

        // 储存选择
        setItem('intentionType',JSON.stringify(this.lists[index]),event=>{
          // 返回上一页
          goBackLink()
          this.SomeOpen = false
        })
      },
      // 输入内容
      inputFun(event){
        this.lists[4].some = event.value
        if( event.value.length > 0 ){
          (this.nextIndex !== -1) && this.$set(this.lists[this.nextIndex],'selectedClass',false)
          this.$set(this.lists[4],'selectedClass',true)
          this.nextIndex = 4
        }else{
          this.$set(this.lists[4],'selectedClass',false)
        }
      },
      // 输入信息存储
      letGo(){
        if(this.SomeOpen) return;
        this.SomeOpen = true
        setItem('intentionType',JSON.stringify(this.lists[4]),event=>{
          // 返回上一页
          goBackLink()
          this.SomeOpen = false
        })
      }
    }
  }
</script>

<style scoped>
  .type-view{
    background-color: #fff;
    padding-left: 16px;
  }
  .box{
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgba(23,24,26,0.08);
    align-items: center;
    height: 48px;
    line-height: 48px;
    flex-direction: row;
    
  }
  .text{
    font-size: 16px;
    color: #17181A;
    height: 48px;
    line-height: 48px;
  }
  .other{
    justify-content: space-between;
  }
  .left{
    flex-direction: row;
    justify-content: space-between;
  }
  .right{
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
    width: 237px;
    height: 48px;
    color: #17181A;
    font-size: 16px;
  }
  .ok{
    width: 65px;
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    color: #A1A9B3;
    text-align: center;
  }
  .selected{
    font-size: 16px;
    color: #1571E5;
  }
  .selectedok{
    width: 65px;
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    border-left-width: 1px;
    border-left-style: solid;
    border-left-color: rgba(23,24,26,0.08);
    text-align: center;
    color: #1571E5;
  }
</style>
