<template>
  <header>
    <nav class="head">
      <router-link to="/" class="logo">TMDB</router-link>
      <ul >
        <li id="login" @click="login" v-bind:class="logged?'hide':''">login</li>
        <li v-bind:class="logged?'':'hide'" id="me">
          <i class="fa fa-angle-down"></i>{{username}}
          <ul class="hover-show" @click="logOff">

            <li v-for="item in favorite">
              <router-link :to="item.link">{{item.name}}</router-link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    <div class="progress"  v-bind:class="loadMsg?'':'hide'">
      <div class="indeterminate"></div>
    </div>
    <login v-bind:loginMessage="loginShow"  @closeLogin="listenFromLogin" @userLogged="listenUserLogged"></login>
    <i class="up material-icons"  v-bind:class="uparrow?'':'hide'" @click="up">arrow_upward</i>

  </header>
</template>

<script>
  import  login from './login.vue';
  import  base from '../common/js/base';
  export default {
    data(){
      return{
        favorite:[
          {name:"Favorite",link:"/favorites"},
          {name:"logoff",link:""}
          ],
        loginShow:false,
        username:"",
        logged:false
      }

    },
    components:{
      login
    },
    props:['loadMsg',"uparrow"],
    mounted(){
      this.getCookie("sessionID");
    },
    methods:{
      logOff(event){
        let target=event.target;
        let self=this;
        if (target.innerHTML.toLowerCase()==="logoff"){
          this.$ajax.get("/api/user/logout")
            .then(response=>{
              console.log(response)
              self.username=self.getCookie("sessionID");
              self.loginShow=response.data['loginShow'];
              self.logged=response.data['logged'];
            })
        }
      },
      getCookie: function (name) {
        let cookieName=encodeURIComponent(name)+"=";
        let cookieStart=document.cookie.indexOf(cookieName);
        let cookieValue=null;

        if (cookieStart>-1){
          let cookieEnd=document.cookie.indexOf(";",cookieStart);
          if (cookieEnd===-1){
            cookieEnd=document.cookie.length;
          }
          cookieValue=decodeURIComponent(document.cookie.substring(cookieStart+cookieName.length,cookieEnd));
        }

        if (cookieValue!==null){
          this.username=cookieValue;
          this.logged=true;
        }


      },
      login(){
        this.loginShow=true;
      },
      listenFromLogin(msg){
        this.loginShow=msg;
      },
      listenUserLogged(msg){
        this.username=msg.username;
        this.logged=msg.logged;
      },
      up(){
        let step=(document.body.scrollTop + document.documentElement.scrollTop)/25;

        base.scrollTopAnimate(document.body,0,-step);
        this.$emit('upArrow',false);
      }
    }
  }
</script>


<style lang="css">
  @import '../common/css/header.css';


</style>
