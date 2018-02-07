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

      <a @click="isLogin">{{register[0]}}</a>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        btn:"login",
        username:"",
        password:"",
        register:['register',"login"]
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
        let element=this.register.shift();
        this.register.push(element);
        this.btn=target.innerHTML.toLowerCase();

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
        let self=this;
        return new Promise(function (resolve, reject) {
          self.$ajax.get('/api/user/isToken',{
            params:{
              username:name
            }
          })
            .then(response=>{
              if (response.data.length>0){
                resolve();
              }else {
                reject()
              }
            })
            .catch(err=>{
              console.log(err)
            });
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

            isUsernameToken.then(function () {
              msg="用户名已注册！";
              callback=null;
              self.username="";
              self.password="";
              self.hint(msg,callback);
            },function () {
              self.addRegister(name,password);
              msg="注册成功！";
              callback=self.closeLogin;
              self.userLogged(name);
              self.hint(msg,callback);
            });





            break;
          default:
            break;

        }
      },
    }
  }
</script>


<style lang="css">
</style>
