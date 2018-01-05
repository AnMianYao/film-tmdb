<template>
  <div id="app">

    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>

  </div>
</template>

<script>
export default {
  name: 'app',
  data(){
    return{}
  },
  methods:{
    setCookie: function (name, value, days) {

      let d = new Date();

      d.setTime(d.getTime() + 24*60*60*1000*days);

      window.document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();

    },

    getCookie: function (name) {

      let v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');

      return v ? v[2] : null;

    }
  }
}
</script>

<style>

</style>
