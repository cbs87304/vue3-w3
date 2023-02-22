import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

let productModal = {};
let delProductMotdal = {};

createApp({
    data() {
      return {
        apiUrl: "https://vue3-course-api.hexschool.io/v2",
        apiPath: "cbs3345678",//每個人設定不一樣
        products: [],
        isNew: false,
        tempProduct: {
          imagesUrl:[],
        },
      }
    },

    mounted() {
        // 取出 Token
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1'
            );
        axios.defaults.headers.common.Authorization = token;
    
        this.checkAdmin();
      
        productModal = new
      bootstrap.Modal(document.getElementById(
        "productModal"),{
            keyboard: false
        });
        
        delProductMotdal = new
        bootstrap.Modal(document.getElementById(
          "delProductModal"),{
              keyboard: false
          }); 
    },

    methods: {
        //先檢查是否已登入
        checkAdmin() {
            const url = `${this.apiUrl}/api/user/check`;
            axios.post(url)
              .then(() => {
                this.getData(); //已登入就執行下方getData的函式
              })
              .catch((err) => {
                alert(err.response.data.message)
                window.location = "index.html"; //未登入或登入錯誤,顯示錯誤資訊,並跳回登入畫面
              })
          },

        //渲染產品資料庫至畫面
        getData() {
        const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
        axios
        .get(url)
          .then((response) => {
            this.products = response.data.products;
          })
          .catch((err) => {
            alert(err.response.data.message);
          })
      },

       updateProduct(){
        let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/`;
        let http = "post";
        if (!this.isNew) {
            url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.temProduct.id}`;
            http = "put"
        }
        axios[http](url,{data: this.temProduct })
        .then((response) => {
            alert(response.data.message);
            productModal.hide();
            this.getData();
        })
        .catch((err) => {
            alert(err.response.data.message);
        })
       },
       openModal(isNew, item) {
        if(isNew === "new"){
            this.temProduct = {
                imagesUrl: [],
            };
            this.isNew = ture;
            productModal.show();
        } else if (isNew === "edit"){
            this.temProduct = { ...item };
            this.isNew = false;
            productModal.show();
        } else if (isNew === "delete"){
            this.temProduct = { ...item };
            delProductMotdal.show()
        }
       },

    delProduct() {
        const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.temProduct.id}`;
        axios.delete(url)
        .then((response) => {
            alert(response.data.message);
            delProductMotdal.hide();
            this.getData();
        })
        .catch((err) => {
            alert(err.response.data.message);
        })
       },
    createImages() {
        this.temProduct.imagesUrl = [];
        this.temProduct.imagesUrl.push("");
       },
    
    },
}).mount('#app');
