<template>
  <v-app>
    <v-container>
      <v-btn
        class="mb-2"
        elevation="2"
        @click="$router.push(`/dashboard`)"
      >
        Back to Dashboard
      </v-btn>
      <v-card class="mx-auto mt-5" max-width="500">
        <v-img :src="showData.imageUrl" height="500px"></v-img>

        <v-card-title class="justify-center"> {{ showData.auther_name }} </v-card-title>

        <v-card-subtitle class="mt-1 text-h6"> {{ showData.name }}</v-card-subtitle>

        <v-card-price class="v-card-price"> {{ showData.amount +'/-' }} </v-card-price>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon @click="show = !show">
            <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
          </v-btn>
        </v-card-actions>

        <v-expand-transition>
          <div v-show="show">
            <v-divider></v-divider>

            <v-card-text>
              {{ showData.description }}
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "ViewProduct",
  data: () => ({
    show: false,
    id: "",
    showData: {
      auther_name: "",
      name: "",
      description: "",
      amount: "",
      imageUrl: ""
    },
  }),
  mounted() {
    this.id = this.$route.params.id;
    this.showProduct();
  },
  methods: {
    async showProduct() {
      await axios
        .get(`products/${this.id}`)
        .then((resp) => {
          this.showData = resp.data.data;
        })
        .catch((error) => {
          this.$toastr.error(error.response.data.message, "Error", {
            timeOut: 2000,
          });
        });
    },
  },
};
</script>

<style scoped>
  .v-card-price {
    font-size: 13px;
    color: #666666;
  }
</style>
