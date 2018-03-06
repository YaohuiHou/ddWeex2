<template>
  <div class="type-view">
    <scroller class="view">
      <div class="box" v-for="(item,index) in lists" @click="changeFun(index)">
        <text :class="[item.selectedClass ? 'selected' : 'text' ]">{{item.name}}</text>
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
          {name:'30分钟以下',value:0,selectedClass:false},
          {name:'30-60分钟',value:1,selectedClass:false},
          {name:'1-2小时',value:2,selectedClass:false},
          {name:'2-3小时',value:3,selectedClass:false},
          {name:'3小时以上',value:4,selectedClass:false}
        ],
        nextIndex: -1,
      }
    },
    mounted: function(){
      dingtalk.ready(function(){
        const dd = dingtalk.apis;
        // title
        dd.biz.navigation.setTitle({
            title: '访问时长'
        });
        // });
      })
    },
    created(){
      getItem('visibleTimer',event=>{
        let data = JSON.parse(event.data)
        this.lists[data.value].selectedClass = true
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
        setItem('visibleTimer',JSON.stringify(this.lists[index]),event=>{
          // 返回上一页
          goBackLink()
          this.SomeOpen = false
        })
      },
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
  .selected{
    font-size: 16px;
    color: #1571E5;
  }
</style>
