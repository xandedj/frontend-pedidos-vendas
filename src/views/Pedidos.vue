<template>
    <v-container>
      <h1 class="mb-5">Gerenciamento de Pedidos</h1>
      <v-data-table
        :headers="headers"
        :items="pedidos"
        :items-per-page="5"
        class="elevation-1"
        v-if="showTable"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>Pedidos</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template #activator="{ on, attrs }">
                <!-- <v-btn color="primary" @click="openDialog()">Novo Produto</v-btn> -->
                <v-btn color="primary" v-bind="attrs" v-on="on">
                  Novo Pedido
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
                        <v-text-field v-model="editedItem.cliente" label="Cliente"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.data" label="Data"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.total" label="Total"></v-text-field>
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
        <template v-slot:item="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'ListaPedidos', // Alterado para um nome multi-word
    data: () => ({
      dialog: false,
      headers: [
        { text: 'Cliente', align: 'start', sortable: true, value: 'cliente' },
        { text: 'Data', value: 'data' },
        { text: 'Total', value: 'total' },
        { text: 'Ações', value: 'actions', sortable: false }
      ],
      pedidos: [],
      showTable: false,
      editedIndex: -1,
      editedItem: {
        cliente: '',
        data: '',
        total: 0
      },
      defaultItem: {
        cliente: '',
        data: '',
        total: 0
      }
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Novo Pedido' : 'Editar Pedido'
      }
    },
    methods: {
      editItem (item) {
        this.editedIndex = this.pedidos.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        this.$nextTick(() => {
        this.showTable = true
  })
      },
      deleteItem (item) {
        const index = this.pedidos.indexOf(item)
        confirm('Tem certeza que deseja deletar este pedido?') && this.pedidos.splice(index, 1)
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
          Object.assign(this.pedidos[this.editedIndex], this.editedItem)
        } else {
          this.pedidos.push(this.editedItem)
        }
        this.close()
      }
    }
  }
  </script>