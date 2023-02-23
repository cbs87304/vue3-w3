import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'cbs33',    //每個人設定不一樣
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
    }
  },
  mounted() {
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });

    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });

    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    
    axios.defaults.headers.common.Authorization = token;

    this.checkAdmin();
  },

  methods: {
    checkAdmin() {//先檢查是否已登入
      const url = `${this.apiUrl}/api/user/check`;
      
      axios.post(url)
        .then(() => {
          this.getData();//已登入就執行下方getData的函式
        })
        .catch((err) => {
          alert(err.response.data.message)
          window.location = 'index.html';//未登入或登入錯誤,顯示錯誤資訊,並跳回登入畫面
        })
    },
    //渲染產品資料庫至畫面
    getData() { 
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
      
      axios
      .get(url).then((response) => {
        this.products = response.data.products;//取得產品資料
      })
      .catch((err) => {
        alert(err.response.data.message);
      })
    },
    
    updateProduct() { 
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let http = 'post';

      if (!this.isNew) {  
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = 'put'
      }

      axios[http](url, { data: this.tempProduct }).then((response) => {
        alert(response.data.message);
        productModal.hide();
        this.getData();
      })
      .catch((err) => {
        alert(err.response.data.message);
      })
    },

    openModal(isNew, item) {    //產品列表的顯示
      if (isNew === 'new') {    
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (isNew === 'edit') {   
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (isNew === 'delete') { 
        this.tempProduct = { ...item };
        delProductModal.show()
      }
    },

    delProduct() {    //刪除產品
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios
      .delete(url).then((response) => {
        alert(response.data.message);
        delProductModal.hide();
        this.getData();
      })
      .catch((err) => {
        alert(err.response.data.message);
      })
    },

    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  },

}).mount('#app');