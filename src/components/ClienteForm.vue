<template>
  <form @submit.prevent="submitForm">
    <v-text-field v-model="cliente.nome" label="Nome"></v-text-field>
    <v-text-field v-model="cliente.email" label="Email"></v-text-field>
    <v-btn type="submit">Salvar</v-btn>
  </form>
</template>

<script>
export default {
  name: 'ClienteForm',
  data() {
    return {
      cliente: {
        nome: '',
        email: ''
      }
    }
  },
  methods: {
    submitForm() {
      this.$emit('save', this.cliente)
    }
  }
}
</script>