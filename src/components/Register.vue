<template>
  <v-app>
    <v-container>
      <h2 class="mt-2">Register Form</h2>
      <form>
        <v-text-field
          v-model="RegisterData.name"
          :error-messages="nameErrors"
          :counter="10"
          label="Name"
          required
          @input="$v.RegisterData.name.$touch()"
          @blur="$v.RegisterData.name.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="RegisterData.email"
          :error-messages="emailErrors"
          label="E-mail"
          required
          @input="$v.RegisterData.email.$touch()"
          @blur="$v.RegisterData.email.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="RegisterData.password"
          :error-messages="passwordErrors"
          label="Password"
          required
          @input="$v.RegisterData.password.$touch()"
          @blur="$v.RegisterData.password.$touch()"
        ></v-text-field>

        <v-btn class="mr-4" @click="submit"> Register </v-btn>
        <v-btn class="mr-4" @click="clear"> clear </v-btn>
        <v-btn @click="$router.push('/login')"> Login Here </v-btn>
      </form>
    </v-container>
  </v-app>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength, minLength, email } from "vuelidate/lib/validators";
import axios from 'axios'

export default {
  name: "Register",
  mixins: [validationMixin],

  validations: {
    RegisterData : {
      name: { required, maxLength: maxLength(10) },
      email: { required, email },
      password: { required, minLength: minLength(8) }
    }
  },

  data: () => ({
    RegisterData : {
      name: "",
      email: "",
      password: "",
    }
  }),

  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.RegisterData.name.$dirty) return errors;
      !this.$v.RegisterData.name.maxLength &&
        errors.push("Name must be at most 10 characters long");
      !this.$v.RegisterData.name.required && errors.push("Name is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.RegisterData.email.$dirty) return errors;
      !this.$v.RegisterData.email.email && errors.push("Must be valid e-mail");
      !this.$v.RegisterData.email.required && errors.push("E-mail is required");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      !this.$v.RegisterData.password.minLength &&
        errors.push("Password should be at 8 characters long");
      if (!this.$v.RegisterData.password.$dirty) return errors;
      !this.$v.RegisterData.password.required && errors.push("Password is required.");
      return errors;
    }
  },

  methods: {
    async submit() {
      this.$v.$touch();
      await axios.post('register', this.RegisterData);
      this.$router.push('/login');
    },
    clear() {
      this.$v.$reset();
      this.RegisterData = "";
    },
  },
};
</script>
