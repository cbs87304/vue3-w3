import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
//建立元件
//建立應用程式

createApp({
  data() {
    return {
      user: {
        username: "", //html標籤用 v-model自動更新
        password: "",
      },
    }
  },
  methods: {
    login() {
      const api = "https://vue3-course-api.hexschool.io/v2/admin/signin";
      axios
      .post(api, this.user)
      .then((response) => {
        const { token, expired } = response.data;
        
        // 寫入 cookie token
        // expires 設置有效時間
        document.cookie = `hexToken=${token};expires=${new Date(
            expired
            )}; path=/`;
        window.location = "products.html";
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
    },
  },
}).mount("#app");
//渲染至畫面