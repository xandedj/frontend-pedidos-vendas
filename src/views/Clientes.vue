<template>
  <v-container>
    <h1 class="mb-5">Gerenciamento de Clientes</h1>
    <v-data-table
      :headers="headers"
      :items="clientes"
      :items-per-page="5"
      class="elevation-1"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Clientes</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template #activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Novo Cliente
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.nome" label="Nome"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.telefone" label="Telefone"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="save">Salvar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template #item="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  name: 'ListaClientes', // Alterado para um nome multi-word
  data: () => ({
    dialog: false,
    headers: [
      { text: 'Nome', align: 'start', sortable: true, value: 'nome' },
      { text: 'Email', value: 'email' },
      { text: 'Telefone', value: 'telefone' },
      { text: 'Ações', value: 'actions', sortable: false }
    ],
    clientes: [],
    editedIndex: -1,
    editedItem: {
      nome: '',
      email: '',
      telefone: ''
    },
    defaultItem: {
      nome: '',
      email: '',
      telefone: ''
    }
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Novo Cliente' : 'Editar Cliente'
    }
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.clientes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      const index = this.clientes.indexOf(item)
      confirm('Tem certeza que deseja deletar este cliente?') && this.clientes.splice(index, 1)
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.clientes[this.editedIndex], this.editedItem)
      } else {
        this.clientes.push(this.editedItem)
      }
      this.close()
    }
  }
}
</script>