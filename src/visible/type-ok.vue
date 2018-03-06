<template>
  <div class="type-view">
    <scroller class="view">
      <div class="box" v-for="(item,index) in lists" @click="changeFun(index)">
        <text :class="[item.selectedClass ? 'selected' : 'text' ]">{{item.name}}</text>
      </div>
      <div class="box other">
        <text :class="[otherClass ? 'selected' : 'text' ]">其他</text>
        <div class="right">
          <input type="text" class="input" placeholder="请输入拜访类别" :value="otherType" @input="inputFun"/>
          <text :class="[otherClass ? 'selectedok' : 'ok' ]" @click="letGo">确认</text>
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
        // 1：初次拜访，2：新人初次拜访，4：未签单回访，4：个人团单，5：个人新签，6：参加活动，7：培训，8：签单回访，9：团单续签，10：个人续签，100：其他
        lists:[
          {name:'新人初次拜访',value:2,selectedClass:false,type:0},
          {name:'参加活动',value:6,selectedClass:false,type:0},
          {name:'培训',value:7,selectedClass:false,type:0},
          {name:'签单回访',value:8,selectedClass:false,type:2},
          {name:'团单续签',value:9,selectedClass:false,type:2},
          {name:'个人续签',value:10,selectedClass:false,type:2},
        ],
        nextIndex: -1,
        otherType: "",
        otherClass: false
      }
    },
    mounted: function(){
      dingtalk.ready(function(){
        const dd = dingtalk.apis;
        // title
        dd.biz.navigation.setTitle({
            title: '拜访类型'
        });
        // });
      })
    },
    created(){
      getItem('visibleType',event=>{
        let data = JSON.parse(event.data)
        if( data.value === 100 ){     // 其他
          this.otherType = data.name
          this.otherClass = true
        }else{
          this.lists[data.value-1].selectedClass = true
        }
      })
    },
    methods:{
      // 选中
      changeFun(index){
        if(this.SomeOpen) return;
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
        setItem('visibleType',JSON.stringify(this.lists[index]),event=>{
          // 返回上一页
          goBackLink()
          this.SomeOpen = false
        })
      },
      // 输入内容
      inputFun(event){
        this.otherType = event.value

        if( event.value.length > 0 ){
          this.otherClass = true
          this.$set(this.lists[this.nextIndex],'selectedClass',false)
          this.nextIndex = -1
        }else{
          this.otherClass = false
        }
      },
      // 输入信息存储
      letGo(){
        if(this.SomeOpen) return;
        this.SomeOpen = true
        // 储存选择
        let type = {
          name: this.otherType,
          value: 100,
          selectedClass: true
        }
        setItem('visibleType',JSON.stringify(type),event=>{
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
  }
  .other{
    justify-content: space-between;
  }
  .right{
    flex-direction: row;
    width: 302px;
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
    border-left-width: 1px;
    border-left-style: solid;
    border-left-color: rgba(23,24,26,0.08);
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
