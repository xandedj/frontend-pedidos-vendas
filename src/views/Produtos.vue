<template>
  <v-container>
    <v-card>
      <v-card-title>
        <h1 class="mb-5">Gerenciamento de Produtos</h1>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openDialog()">Novo Produto</v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="produtos"
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
          <v-icon small  color="primary" @click="editProduto(item)">
            mdi-pencil
          </v-icon>
          <v-icon small color="red" @click="deleteProduto(item.id_produto)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog para criar/editar produto -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ editedIndex === -1 ? 'Novo Produto' : 'Editar Produto' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="editedItem.nome" label="Nome"></v-text-field>
            <v-text-field v-model="editedItem.preco" label="Preço" type="number"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog()">Cancelar</v-btn>
          <v-btn text color="primary" @click="saveProduto()">Salvar</v-btn>
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
        { title: 'Cod', key: 'id_produto' },
        { title: 'Nome', key: 'nome' },
        { title: 'Preço', key: 'preco' , align: 'end'},
        { title: 'Ações', key: 'actions', align: 'end'}
      ],
      produtos: [],
      search: '',
      select:[],
      dialog: false,
      editedIndex: -1,
      editedItem: {
        id_produto: null,
        nome: '',
        preco: 0
      }
    }
  },
  created() {
    this.fetchProdutos();
  },
  methods: {
    async fetchProdutos() {
      try {
        const response = await axios.get('http://localhost:3000/produtos');
        this.produtos = response.data;
        
      } catch (error) {
        console.error(error);
      }
    },
    openDialog() {
      this.editedIndex = -1;
      this.editedItem = { id_produto: null, nome: '', preco: 0 };
      this.dialog = true;
    },

    editProduto(item) {
      this.editedIndex = this.produtos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async saveProduto() {
      try {
        if (this.editedIndex === -1) {
          // Novo produto
          const response = await axios.post('http://localhost:3000/produtos', this.editedItem);
          this.produtos.push(response.data);
        } else {
          // Atualiza produto
          await axios.put(`http://localhost:3000/produtos/${this.editedItem.id_produto}`, this.editedItem);
          Object.assign(this.produtos[this.editedIndex], this.editedItem);
        }
        this.closeDialog();
      } catch (error) {
        console.error(error);
      }
    },
    async deleteProduto(id) {
      try {
        await axios.delete(`http://localhost:3000/produtos/${id}`);
        this.produtos = this.produtos.filter(p => p.id_produto !== id);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>
