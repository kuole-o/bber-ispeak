<template>
  <div>
    <xk-info :count="total"></xk-info>
    <transition-group name="list" tag="div">
      <template v-for="bb in bbList">
        <xk-card
          :bbData="bb"
          :key="bb._id"
          :name="name"
          :avatar="avatar"
          :fromColor="fromColor"
        />
      </template>
    </transition-group>
    <div class="loading" v-if="loading">
      <img :src="loadingImg" alt="loading" />
    </div>
    <button class="next" @click="getData" v-if="bbList.length < total">再翻翻</button>
    <div style="text-align: center; margin-top: 20px" v-if="showMessage">
      {{ message }}
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import XkCard from './XkCard.vue';
import XkInfo from './XkInfo.vue';
// 内核
import cloudbase from '@cloudbase/js-sdk/app';
// 登录模块
import '@cloudbase/js-sdk/auth';
// 数据库模块
import '@cloudbase/js-sdk/database';

export default {
  components: { XkCard, XkInfo, XkInfo },

  data() {
    return {
      envId: '',
      region: '',
      name: '',
      avatar: '',
      bbList: [],
      total: 0,
      message: '正在加载...',
      loading: true,
      page: 1,
      limit: 5,
      app: null,
      showMessage: false,
      fromColor: '',
      loadingImg: 'https://7.dusays.com/2021/03/04/d2d5e983e2961.gif',
      dbName: 'talks'
    };
  },
  methods: {
    async login(app) {
      const auth = app.auth({ persistence: 'local' });
      if (!auth.hasLoginState()) {
        await auth.anonymousAuthProvider().signIn();
        // 匿名登录成功检测登录状态isAnonymous字段为true
        // const loginState = await auth.getLoginState();
        // console.log(loginState);
      }
    },
    // 获取总数量
    async getCount() {
      const db = await this.app.database();
      const { total } = await db.collection(this.dbName).count();
      this.total = total;
    },
    async getData() {
      this.loading = true;
      this.showMessage = true;
      const app = this.app;
      const db = app.database();
      try {
        const { data } = await db
          .collection('talks')
          .limit(this.limit)
          .skip((this.page - 1) * this.limit)
          .orderBy('date', 'desc')
          .get();
        this.bbList = this.bbList.concat(data);
        this.loading = false;
        this.showMessage = false;
        this.page++;
      } catch (e) {
        this.loading = false;
        this.showMessage = true;
        this.message = e;
      }
    }
  },
  async mounted() {
    const {
      name,
      avatar,
      envId,
      limit = 5,
      dbName = 'talks',
      region = 'ap-shanghai',
      fromColor = 'rgb(245, 150, 170)',
      loadingImg = 'https://7.dusays.com/2021/03/04/d2d5e983e2961.gif'
    } = Vue.prototype.$speakData;
    this.name = name;
    this.envId = envId;
    this.avatar = avatar;
    this.fromColor = fromColor;
    this.region = region;
    this.dbName = dbName;
    this.limit = Number(limit);
    this.loadingImg = loadingImg;
    const app = cloudbase.init({
      env: this.envId,
      region: this.region
    });
    this.app = app;
    await this.login(this.app);
    await this.getData();
    await this.getCount();
  }
};
</script>
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53);
  transform-origin: 50% 50%;
}
.list-enter,
.list-leave-to {
  transform-origin: 50% 50%;
  transform: scaleY(0) translateZ(0);
  opacity: 0;
}
.loading {
  text-align: center;
}
@keyframes Gradient {
  0% {
    background-position: 0 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  to {
    background-position: 0 50%;
  }
}

button {
  cursor: pointer;
  color: #fff;
  border: 0;
  margin: 20px auto;
  border-radius: 0.3125rem;
  display: block;
  padding: 0 1rem;
  height: 40px;
  font-weight: 500;
  text-align: center;
  transition: all 0.5s ease-out;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 1000% 1000%;
  animation: Gradient 90s linear infinite;
  outline: 0;
  box-shadow: 0 0px 5px 2px rgb(7 17 27 / 15%);
}
button:hover {
  box-shadow: 0 0px 8px 6px rgb(7 17 27 / 16%);
}
</style>