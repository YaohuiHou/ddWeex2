<template>
  <div class="type-view">
    <scroller class="view">
      <div class="box" v-for="(item,index) in lists" @click="changeFun(index)" v-if="item.value < 6">
        <image class="img" :src="selected[ item.selectedClass ? 1:0 ]" style="width:18px;height:18px;"></image>
        <text :class="[item.selectedClass ? 'selected' : 'text' ]">{{item.name}}</text>
      </div>
      <div class="box other">
        <div class="left">
          <image class="img" :src="selected[ otherClass ? 1:0 ]" style="width:18px;height:18px;"></image>
          <text :class="[otherClass ? 'selected' : 'text' ]">其他</text>
        </div>
        <div class="right">
          <input type="text" class="input" placeholder="请输入职位" :value="otherType" @input="inputFun"/>
          <text :class="[otherClass ? 'selectedok' : 'ok' ]" @click="letGo">确认</text>
        </div>
      </div>
      <!-- 保存 -->
      <div class="next" @click="submitFun">
        <text class="next-text">保存</text>
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
        // lists:[
        //   '老板',
        //   '总经理',
        //   '店长',
        //   '销售经理',
        //   '财务',
        //   '信息员'
        // ],
        selected:[
          'https://s.kcimg.cn/dingtalk/image/circle.png',
          'https://s.kcimg.cn/dingtalk/image/yes.png'
        ],
        lists:[
          {name:'老板',value:1,selectedClass:false},
          {name:'总经理',value:2,selectedClass:false},
          {name:'店长',value:3,selectedClass:false},
          {name:'销售经理',value:4,selectedClass:false},
          {name:'财务',value:5,selectedClass:false},
          {name:'信息员',value:6,selectedClass:false},
          {name:'',value:100,selectedClass:false}
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
            title: '选择被访人级别'
        });
        // });
      })
    },
    created(){
      getItem('visibleLevel',event=>{
        let data = JSON.parse(event.data)
        if(data !== undefined){
          if( data[6].value === 100 ){     // 其他
            this.otherType = data[6].name
            this.otherClass = data[6].selectedClass
            this.$set(this.lists[6],'selectedClass',this.otherClass)
            this.$set(this.lists[6],'name',this.otherType)
          }
          this.lists = data
        }
      })
    },
    methods:{
      // 选中
      changeFun(index){
        
        this.$set(this.lists[index],'selectedClass',!this.lists[index].selectedClass)

        
      },
      // 输入内容
      inputFun(event){
        this.otherType = event.value

        if( event.value.length > 0 ){
          this.otherClass = true
        }else{
          this.otherClass = false
        }
        this.$set(this.lists[6],'selectedClass',this.otherClass)
        this.$set(this.lists[6],'name',this.otherType)
      },
      // 输入信息存储
      letGo(){
        if(this.SomeOpen) return;
        this.SomeOpen = true
        // // 储存选择
        // let type = {
        //   name: this.otherType,
        //   value: 100,
        //   selectedClass: true
        // }
        // this.lists.push(type)
        setItem('visibleLevel',JSON.stringify(this.lists),event=>{
          // 返回上一页
          goBackLink()
          this.SomeOpen = false
        })
      },
      submitFun(){
        if(this.SomeOpen) return;
        this.SomeOpen = true
        // 储存选择
        setItem('visibleLevel',JSON.stringify(this.lists),event=>{
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
  .selected{
    font-size: 16px;
    color: #1571E5;
  }
  .img{
    margin-right: 10px;
  }
  .other{
    justify-content: space-between;
  }
  .left{
    flex-direction: row;
    align-items: center;
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
  .selectedok{
    width: 65px;
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    color: #1571E5;
    border-left-width: 1px;
    border-left-style: solid;
    border-left-color: rgba(23,24,26,0.08);
    text-align: center;
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
    margin-top: 36px;
  }
  .next-text{
    color: #fff;
    font-size: 16px;
  }
</style>
