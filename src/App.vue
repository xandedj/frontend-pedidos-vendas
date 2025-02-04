<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Sistema de Pedidos</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/produtos">Produtos</v-btn>
      <v-btn text to="/clientes">Clientes</v-btn>
      <v-btn text to="/pedidos">Pedidos</v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    //
  }),
};
</script>