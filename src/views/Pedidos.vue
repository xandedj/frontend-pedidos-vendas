<template>
  <v-container>
    <v-card-title>
        <h1 class="mb-5">Gerenciamento de Pedidos</h1>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openDialog()">Novo Produto</v-btn>
      </v-card-title>
    <v-data-table
      :headers="headers"
      :items="pedidos"
      :items-per-page="10"
      class="elevation-1"
      v-if="showTable"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Pedidos</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="openDialog()">Novo Pedido</v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        <v-icon small @click="showOrderDetails(item)">mdi-eye</v-icon>  </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="editedItem.cliente" label="Cliente"></v-text-field>
            <v-text-field v-model="editedItem.data" label="Data" type="date"></v-text-field>
            <v-text-field v-model="editedItem.total" label="Total" type="number"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="savePedido">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="orderDetailsDialog" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Detalhes do Pedido</span>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="orderItemsHeaders"
            :items="selectedOrderItems"
            class="elevation-1"
          >
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeOrderDetails">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ListaPedidos',
  data: () => ({
    dialog: false,
    orderDetailsDialog: false, // Novo dialog para detalhes
    headers: [
      { title: 'Cliente', align: 'start', sortable: true, key: 'cliente_nome' },
      { title: 'Data', key: 'data' },
      { title: 'Total', key: 'total' },
      { title: 'Ações', key: 'actions', sortable: false }
    ],
    orderItemsHeaders: [ // Headers para a tabela de itens
      { title: 'Produto', key: 'produto' }, // Ajuste conforme sua API
      { title: 'Quantidade', key: 'quantidade' }, // Ajuste conforme sua API
      { title: 'Preço Unitário', key: 'precoUnitario' }, // Ajuste conforme sua API
      { title: 'Subtotal', key: 'subtotal' }, // Ajuste conforme sua API
    ],
    pedidos: [],
    showTable: false,
    editedIndex: -1,
    editedItem: {
      cliente: '',
      data: '',
      total: 0,
      itens: [] // Array para os itens do pedido
    },
    selectedOrderItems: [], // Itens do pedido selecionado para detalhes
    defaultItem: {
      cliente: '',
      data: '',
      total: 0,
      itens: []
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Novo Pedido' : 'Editar Pedido'
    }
  },
  created() {
    this.fetchPedidos();
    console.log('Pedidos: ', this.pedidos)
  },
  methods: {
    async fetchPedidos() {
      try {
        const response = await axios.get('http://localhost:3000/pedidos'); // Sua URL da API
        this.pedidos = response.data;
        this.showTable = true;
      } catch (error) {
        console.error(error);
      }
    },
    openDialog() {
      this.editedIndex = -1;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.dialog = true;
    },
    editItem(item) {
      this.editedIndex = this.pedidos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.pedidos.indexOf(item);
      confirm('Tem certeza que deseja deletar este pedido?') && this.pedidos.splice(index, 1);
    },
    closeDialog() {
      this.dialog = false;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },
    async savePedido() {
      try {
        if (this.editedIndex > -1) {
          // Atualizar pedido existente
          const response = await axios.put(`http://localhost:3000/pedidos/${this.editedItem.id}`, this.editedItem); // Ajuste o ID
          Object.assign(this.pedidos[this.editedIndex], response.data); // Atualizar com os dados da API
        } else {
          // Criar novo pedido
          const response = await axios.post('http://localhost:3000/pedidos', this.editedItem);
          this.pedidos.push(response.data); // Adicionar o novo pedido com os dados da API
        }
        this.closeDialog();
        this.fetchPedidos(); // Recarregar os pedidos após salvar
      } catch (error) {
        console.error("Erro ao salvar pedido:", error);
      }
    },

    showOrderDetails(item) {
      this.selectedOrderItems = item.itens; // Assumindo que sua API retorna os itens dentro do pedido
      this.orderDetailsDialog = true;
    },
    closeOrderDetails() {
      this.orderDetailsDialog = false;
    }

  }
}
</script>