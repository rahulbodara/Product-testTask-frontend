<template>
  <v-app>
    <v-container>
      <h2 class="mt-2">Login Form</h2>
      <form>
        <v-text-field
          v-model="LoginData.email"
          :error-messages="emailErrors"
          label="E-mail"
          required
          @input="$v.LoginData.email.$touch()"
          @blur="$v.LoginData.email.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="LoginData.password"
          type="password"
          :error-messages="passwordErrors"
          label="Password"
          required
          @input="$v.LoginData.password.$touch()"
          @blur="$v.LoginData.password.$touch()"
        ></v-text-field>

        <v-btn class="mr-4" @click="submit"> Login </v-btn>
        <v-btn class="mr-4" @click="clear"> clear </v-btn>
        <v-btn @click="$router.push('/register')"> Register Here </v-btn>
      </form>
    </v-container>
  </v-app>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, email } from "vuelidate/lib/validators";
import axios from "axios";

export default {
  name: "Login",
  mixins: [validationMixin],

  validations: {
    LoginData: {
      email: { required, email },
      password: { required, minLength: minLength(8) },
    },
  },

  data: () => ({
    LoginData: {
      email: "",
      password: "",
    },
  }),

  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.LoginData.email.$dirty) return errors;
      !this.$v.LoginData.email.email && errors.push("Must be valid e-mail");
      !this.$v.LoginData.email.required && errors.push("E-mail is required");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      !this.$v.LoginData.password.minLength &&
        errors.push("Password should be at 8 characters long");
      if (!this.$v.LoginData.password.$dirty) return errors;
      !this.$v.LoginData.password.required &&
        errors.push("Password is required.");
      return errors;
    },
  },
  methods: {
    async submit() {
      this.$v.$touch();
      await axios.post("login", this.LoginData)
        .then((res) => {
            localStorage.setItem('token',res.data.data.token);
            localStorage.setItem('userInfo',res.data.data.userInfo);
            this.$toastr.success(res.data.message, 'Success', {timeOut: 2000});
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.data.token;
            this.$router.push({path: 'dashboard'});
        }).catch((error) => {
            this.$toastr.error(error.response.data.message, 'Error', {timeOut: 2000});
        });
    },
    clear() {
      this.$v.$reset();
      this.LoginData = "";
    },
  },
};
</script>
