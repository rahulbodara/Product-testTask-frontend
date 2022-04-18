<template>
  <v-app>
    <v-container>
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            class="mb-2"
            elevation="2"
            v-on="{ ...tooltip }"
            @click="signout"
          >
            Logout
          </v-btn>
        </template>
        {{ name }}
      </v-tooltip>
      <v-btn
        class="mb-2 float-right"
        color="primary"
        elevation="2"
        @click="addProduct"
      >
        Add Product
      </v-btn>
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="desserts" :search="search">
          <template v-slot:item.imageUrl="{ item }">
            <img :src="item.imageUrl" style="width: 50px; height: 50px" />
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn
              class="ma-2"
              outlined
              fab
              dark
              small
              color="indigo"
              @click="editItem(item.id)"
            >
              <v-icon dark> mdi-pencil </v-icon>
            </v-btn>
            <v-btn
              class="ma-2"
              outlined
              fab
              dark
              small
              color="red"
              @click="deleteItem(item.id)"
            >
              <v-icon dark> mdi-delete </v-icon>
            </v-btn>
            <v-btn
              class="ma-2"
              outlined
              fab
              dark
              small
              color="blue"
              @click="$router.push(`/viewProduct/${item.id}`)"
            >
              <v-icon dark> mdi-eye </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ formTitle }}
        </v-card-title>
        <v-container>
          <form enctype="multipart/form-data">
          <v-text-field
              v-model="showData.auther_name"
              :error-messages="autherNameErrors"
              label="Auther Name"
              required
              @input="$v.showData.auther_name.$touch()"
              @blur="$v.showData.auther_name.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="showData.name"
              :error-messages="nameErrors"
              label="Name"
              required
              @input="$v.showData.name.$touch()"
              @blur="$v.showData.name.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="showData.description"
              :error-messages="descriptionErrors"
              label="Description"
              required
              @input="$v.showData.description.$touch()"
              @blur="$v.showData.description.$touch()"
            ></v-text-field>
            <v-file-input
              v-model="showData.image"
              label="File input"
              @change="onChange"
            ></v-file-input>
            <v-text-field
              v-model="showData.amount"
              :error-messages="amountErrors"
              label="Amount"
              required
              @input="$v.showData.amount.$touch()"
              @blur="$v.showData.amount.$touch()"
            ></v-text-field>
            <v-btn
              class="mr-4"
              @click="
                modalStatus == 1
                  ? updateProduct(showData.id)
                  : storeProduct()
              "
            >
            <span>{{ modalStatus == 1 ? "Update" : "Add" }}</span>
            </v-btn>
            <v-btn @click="clear"> clear </v-btn>
          </form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  name: "Dashboard",
  mixins: [validationMixin],

  validations: {
    showData: {
      auther_name: { required },
      name: { required },
      description: { required },
      amount: { required },
    },
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Id",
          align: "start",
          filterable: false,
          value: "id",
        },
        { text: "Auther Name", value: "auther_name" },
        { text: "Name", value: "name" },
        { text: "Image", value: "imageUrl" },
        { text: "Description", value: "description" },
        { text: "Amount", value: "amount" },
        { text: "Action", value: "action" },
      ],
      desserts: [],
      showData: {
        id: "",
        auther_name: "",
        name: "",
        description: "",
        amount: "",
        image: "",
      },
      name: "",
      profileImage: [],
      dialog: false,
      formTitle: "",
      modalStatus: 0,
    };
  },
  
  computed: {
    autherNameErrors(){
      const errors = [];
      if (!this.$v.showData.auther_name.$dirty) return errors;
      !this.$v.showData.auther_name.required && errors.push("Auther Name is required");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.showData.name.$dirty) return errors;
      !this.$v.showData.name.required && errors.push("Name is required");
      return errors;
    },
    descriptionErrors() {
      const errors = [];
      if (!this.$v.showData.description.$dirty) return errors;
      !this.$v.showData.description.required &&
        errors.push("Description is required.");
      return errors;
    },
    amountErrors() {
      const errors = [];
      if (!this.$v.showData.amount.$dirty) return errors;
      !this.$v.showData.amount.required && errors.push("Amount is required.");
      return errors;
    },
  },
  async mounted() {
    await this.showAllProducts();
    let userInfo = localStorage.getItem("userInfo");
    userInfo = JSON.parse(userInfo);
    this.name = userInfo.name;
  },
  methods: {
    onChange(event) {
      this.profileImage = event;
    },
    async editItem(id) {
      this.formTitle = "Edit Product";
      this.modalStatus = 1;
      this.dialog = true;
      await axios
        .get(`products/${id}`)
        .then((resp) => {
          this.showData = resp.data.data;
        })
        .catch((error) => {
          this.$toastr.error(error.response.data.message, "Error", {
            timeOut: 2000,
          });
        });
    },
    async deleteItem(id) {
      await axios
        .delete(`products/${id}`)
        .then((resp) => {
          this.$toastr.success(resp.data.message, "Success", { timeOut: 2000 });
          this.showAllProducts();
        })
        .catch((error) => {
          this.$toastr.error(error.response.data.message, "Error", {
            timeOut: 2000,
          });
        });
    },
    async showAllProducts() {
      await axios
        .get("products")
        .then((resp) => {
          this.desserts = resp.data.data;

        })
        .catch((error) => {
          this.$toastr.error(error.response.data.message, "Error", {
            timeOut: 2000,
          });
        });
    },
    async updateProduct(id) {
      let formData = new FormData();
      formData.append("auther_name", this.showData.auther_name);
      formData.append("name", this.showData.name);
      formData.append("description", this.showData.description);
      formData.append("amount", this.showData.amount);
      formData.append("image", this.profileImage);
      await axios
        .post(`products/${id}`, formData)
        .then((resp) => {
          this.dialog = false;
          this.$toastr.success(resp.data.message, "Success", { timeOut: 2000 });
          this.showAllProducts();
        })
        .catch((error) => {
          this.$toastr.error(error.response.data.message, "Error", {
            timeOut: 2000,
          });
        });
    },
    clear() {
      this.$v.$reset();
      this.showData = "";
    },
    async signout() {
      await axios
        .get("logout")
        .then((resp) => {
          this.$toastr.success(resp.data.message, "Success", { timeOut: 2000 });
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          this.$router.push({ path: "/" });
        })
        .catch((error) => {
          this.$toastr.error(error.response.data.message, "Error", {
            timeOut: 2000,
          });
        });
    },
    addProduct() {
      this.formTitle = "Add Product";
      this.modalStatus = 0;
      this.dialog = true;
    },
    async storeProduct() {
      let formData = new FormData();
      formData.append("auther_name", this.showData.auther_name);
      formData.append("name", this.showData.name);
      formData.append("description", this.showData.description);
      formData.append("amount", this.showData.amount);
      formData.append("image", this.profileImage);
      await axios
        .post('products', formData)
        .then((resp) => {
          this.dialog = false;
          this.$toastr.success(resp.data.message, "Success", { timeOut: 2000 });
          this.showAllProducts();
          this.clear();
        })
        .catch((error) => {
          this.$toastr.error(error.response.data.message, "Error", {
            timeOut: 2000,
          });
        });
    }
  }
};
</script>
