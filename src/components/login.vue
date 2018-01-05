<template>
  <div class="loginCover" v-bind:class="loginMessage?'':'hide'">
    <div :class="btn" ref="hintParent">
      <i class="material-icons Close" @click="closeLogin">close</i>
      <form >
        <div class="row">
          <div >
            <label for="username">Username</label>
            <input id="username" type="text" class="validate" v-model="username">

          </div>
        </div>

        <div class="row">
          <div>
            <label for="password" >password</label>
            <input id="password" type="password" class="validate" v-model="password">

          </div>
        </div>

        <button class="center btn" @click="addUser">{{btn}}</button>
      </form>

      <a v-bind:class="register?'':'hide'" @click="isLogin">register</a>
    </div>
  </div>
</template>

<script>
  const USERNAME='j1angvei';
  const PASSWORD='jiangwei0829';

  export default {
    data(){
      return{
        btn:"login",
        username:"",
        password:"",
        register:true
      }
    },
    props:['loginMessage'],
    methods:{
      closeLogin(){
        this.$emit('closeLogin',false)
      },
      userLogged(name){
        this.$emit('userLogged',{
          logged:true,
          username:name
        });

      },
      isLogin(event){
        let target=event.target;
        if (target.nodeName.toLowerCase()!=="a"){
          return false;
        }
        this.register=false;
        this.btn="register";

      },
      hint(msg,callback){
        let div=this.$refs.hintParent;
        let span=document.createElement("span");
        span.classList.add("hint");
        span.innerHTML=msg;
        div.appendChild(span);

        setTimeout(function () {
          div.removeChild(span);
          if (callback){
            callback();
          }
        },2000)

      },
      login(name,password){
        let self=this;
        this.$ajax.get('/api/user/addUser',{
          params:{
            username:name
          }
        })
          .then(response=>{
            let TruePassword=response.data[0]?response.data[0].password:undefined;
            let msg;
            let callback;

            if (password===TruePassword && TruePassword){
              msg="登陆成功";
              callback=self.closeLogin;
              self.userLogged(name);
            }else {
              msg="密码和用户名不匹配";
              callback=null;
              self.username="";
              self.password="";
            }
            self.hint(msg,callback);
          })
          .catch(err=>{
            console.log(err)
          });
      },
      isToke(name){
        this.$ajax.get('/api/user/isToken',{
          params:{
            username:name
          }
        })
          .then(response=>{
            return response.data.length>0;
          })
          .catch(err=>{
            console.log(err)
          });
      },
      addRegister(name,password){
        let data={
          "id":0,
          "username": name,
          "password":password,
          "favors":""
        };
        let config= {
          headers: {
            'Content-Type': 'application/json'
          }
        };

        this.$ajax.post('/api/user/addUser',data,config)
          .then((response) => {
            console.log(response)
          })
          .catch(err=>{
            console.log(err)
          });
      },
      addUser(event){
        event.preventDefault();
        let name = this.username;
        let password = this.password;
        let type=this.btn;
        let self=this;

        switch (type){
          case "login":
            this.login(name,password);
            break;
          case "register":

            let msg;
            let callback;
            let isUsernameToken=this.isToke(name);
            if (isUsernameToken){
              msg="用户名已注册！";
              callback=null;
              self.username="";
              self.password="";
            }else {
              this.addRegister(name,password);
              msg="注册成功！";
              callback=self.closeLogin;
              self.userLogged(name);
            }
            self.hint(msg,callback);



            break;
          default:
            break;

        }
      },
    }
  }
</script>


<style lang="css">
span.hint{
  border-radius: 2px;
  width: auto;
  margin-top: 10px;
  position: absolute;
  max-width: 100%;
  height: auto;
  min-height: 48px;
  line-height: 1.5em;
  word-break: break-all;
  background-color: #323232;
  padding: 10px 25px;
  font-size: 1.1rem;
  font-weight: 300;
  color: #fff;
  right: 2em;
  bottom: 2em;
}
</style>
