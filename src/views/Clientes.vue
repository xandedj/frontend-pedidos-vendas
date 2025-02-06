<template>
  <v-container>
    <v-card>
      <v-card-title>
        <h1 class="mb-5">Gerenciamento de Clientes</h1>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openDialog()">Novo Cliente</v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="clientes"
        :search="search"
        :items-per-page="10"
        class="elevation-1"
        show-select
      >
        <template #top>
          <v-text-field
            v-model="search"
            label="Pesquisar"
            class="mx-4"
          ></v-text-field>
        </template>
        <!-- Se necessário, desabilite a regra ESLint para esse slot -->
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.actions="{ item }">
          <v-icon small  color="primary" @click="editCliente(item)">
            mdi-pencil
          </v-icon>
          <v-icon small color="red" @click="deleteCliente(item.id_cliente)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog para criar/editar cliente -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ editedIndex === -1 ? 'Novo Cliente' : 'Editar Cliente' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="editedItem.nome" label="Nome"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog()">Cancelar</v-btn>
          <v-btn text color="primary" @click="saveCliente()">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProdutosView',
  data() {
    return {
      loading: true,
      headers: [
        { title: 'Cod', key: 'id_cliente' },
        { title: 'Nome', key: 'nome' },
        { title: 'Ações', key: 'actions', align: 'end'}
      ],
      clientes: [],
      search: '',
      select:[],
      dialog: false,
      editedIndex: -1,
      editedItem: {
        id_cliente: null,
        nome: '',
        preco: 0
      }
    }
  },
  created() {
    this.fetchClientes();
  },
  methods: {
    async fetchClientes() {
      try {
        const response = await axios.get('http://localhost:3000/clientes');
        this.clientes = response.data;
        
      } catch (error) {
        console.error(error);
      }
    },
    openDialog() {
      this.editedIndex = -1;
      this.editedItem = { id_cliente: null, nome: ''};
      this.dialog = true;
    },

    editProduto(item) {
      this.editedIndex = this.clientes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async saveCliente() {
      try {
        if (this.editedIndex === -1) {
          // Novo cliente
          const response = await axios.post('http://localhost:3000/clientes', this.editedItem);
          this.clientes.push(response.data);
        } else {
          // Atualiza produto
          await axios.put(`http://localhost:3000/clientes/${this.editedItem.id_cliente}`, this.editedItem);
          Object.assign(this.clientes[this.editedIndex], this.editedItem);
        }
        this.closeDialog();
      } catch (error) {
        console.error(error);
      }
    },
    async deleteCliente(id) {
      try {
        await axios.delete(`http://localhost:3000/clientes/${id}`);
        this.clientes = this.clientes.filter(p => p.id_cliente !== id);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>
