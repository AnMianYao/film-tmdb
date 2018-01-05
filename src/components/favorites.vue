<template>
    <div class="favorites">
      <top v-bind:uparrow="upArrow" v-bind:loadMsg="loading"
           @upArrow="changeUpArrow"></top>

      <div class="main">
        <div class="intro">
          <div class="inner">
            <span class="icon"></span>
            <h2>{{username}}</h2>
            <p>{{username}}! Here are Favorites of you movie,TV show or stars.</p>
          </div>
        </div>


        <section>
          <h2> my favorites</h2>
          <div @click="typeSelected">
            <p>
              <a v-for="item in typeSelect" :class="item.active">{{item.name}}</a>
            </p>

            <p>
              Filter by
              <select ref="selected">
                <option id="popularity">popularity</option>
                <option id="time">released time</option>
              </select>
              <strong>order</strong>
              <i class="icon" v-for="item in sort" :class="item.name+item.active"></i>
            </p>
          </div>
        </section>
        <ul>
          <li v-for="item in favor" class="favor-item">
            <router-link :to="'/layout/'+item.type+'/'+item.id">
              <article>
                <div class="imgContainer">
                  <img :src="item.src"/>
                </div>

                <div>
                  <h3>{{item.title}}</h3>
                  <p>{{item.overview}}</p>
                  <span><i class="icon"></i>learn more </span>
                </div>

              </article>
            </router-link >
          </li>

        </ul>
      </div>
    </div>
</template>

<script>
  import top from './header.vue';
  import ajax from '../common/js/tmdb';
    export default {
        name: "favorites",
      data(){
        return{
          loading:true,
          upArrow:true,
          username:"",
          resource:[],
          typeSelect:[
            {name:'Movie', active:'active'},
            {name:"TV", active:''},
            {name:"Person", active:''}
          ],
          selectedType:"movie",
          sort:[
            {name:'up ',active:'active'},
            {name:'down ',active:''}
          ],
          sortType:{
            select:"popularity",
            order:0
          }
        }
      },
      components:{
        top
      },
      computed:{
        favor(){
          let string=this.selectedType;
          let self=this;
          let result= this.resource.filter(n => n.type===string);
          return result.sort(function (n1,n2) {
            let key=self.sortType.select;
            if (self.sortType.order===0){
              return n1[key]-n2[key]>0
            }else {
              return n1[key]-n2[key]<0
            }
          })
        },
      },
      mounted(){
          this.serializeData();
          this.getCookie("username");
      },
      methods:{
        changeUpArrow(msg) {

          this.upArrow = msg;
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

          return cookieValue;


        },
        getFavorites(){
          let self=this;
          return new  Promise(((resolve) => {
            self.$ajax.get('/api/user/favor',{
              params:{
                username:self.getCookie("username")
              }
            })
              .then(response=>{
                let data=response.data[0].favors;

                resolve(data);
              })
              .catch(err=>{
                console.log(err);
              });
          }));
        },
        getItemData(string){
          let self=this;
          let info=string.split("&");
          let type=info[0];
          let id=info[1];
          let raws=ajax.favorite(id,type);
          let url=raws[0];
          let filter=raws[1];
          this.$ajax.get(url).then((data)=>{
            self.resource.push(filter(data.data));
          });
        },
        serializeData(){
          let self=this;
          let promise= this.getFavorites();
          promise.then((data)=>{
           let arrary=data.split('|');
           arrary.forEach((n)=>{
             self.getItemData(n);
           });
           self.loading=false;
         });

        },

        typeSelected(event){
          let target=event.target;
          let targetNodeName=target.nodeName.toLowerCase();
          let self=this;

          if (targetNodeName==="i"){
            if (this.sortType.order===0){
              this.sortType.order=1;
              this.sort[1].active='active';
              this.sort[0].active='';
            }else {
              this.sortType.order=0;
              this.sort[0].active='active';
              this.sort[1].active='';
            }

          }

          if (targetNodeName==="select"){
            let select=this.$refs.selected;
            let selectOption=select.options[select.selectedIndex];
            this.sortType.select=selectOption.id;
            return false;
          }

          if (targetNodeName==="a"){
            this.selectedType=target.innerHTML.toLowerCase();
            this.typeSelect.forEach((n)=>{
              n.active='';
              if (n.name.toLowerCase()===self.selectedType){
                n.active="active";
              }
            });
            return false;
          }


        },

      }
    }
</script>

<style>
  @import '../common/css/main.css';
  @import '../common/css/favorites.css';
</style>
