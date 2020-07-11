<template>
  <div class="container">
    <el-header height="300">
      <h1 class="title">Chat</h1>
    </el-header>
    <el-main>
      <el-row type="flex" justify="center" v-if="!userName">
        <el-col :span="12">
          <el-form :model="form" status-icon label-width="120px" label-position="top">
            <el-form-item label="Чтобы приступить к обмену сообщениями введите имя:" prop="name">
              <el-input type="text" v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm()">Отправить</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-card v-if="userName" v-loading="loading">
        <el-row style="background-color: #F2F6FC; border-radius: 4px; border: 1px solid #DCDFE6; border-bottom: none;">
          <blockquote v-for="message in messages" :key="message.id">
            <p>{{message.text}}</p>
            <footer style="text-align: right; font-size: 14px; padding-top: 10px">
              <cite>{{message.author}}</cite>
              <time :datetime="message.dateISOS">{{message.dateDisplay}}</time>
            </footer>
          </blockquote>
        </el-row>
        <el-row>
            <el-form :model="form" status-icon label-width="120px" label-position="top">
              <el-form-item>
                <el-input type="textarea" v-model="form.message" placeholder="Введите ваше сообщение"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="postMessage()">Отправить</el-button>
                <el-button type="default" @click="form.message = ''">Очистить</el-button>
              </el-form-item>
            </el-form>
        </el-row>
      </el-card>
    </el-main>
    <el-footer>
    </el-footer>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import { fetchMessages, saveMessage } from "../services/service";

export default {
  created() {
    if (this.userName) {
      this.getMessages();
      this.refreshData()
    }
  },
  data() {
    return {
      loading: false,
      messages: null,
      form: {
        name: '',
        message: ''
      },
      interval: null
    }
  },
  computed: {
    ...mapGetters(['userName'])
  },
  watch: {
    userName() {
      if (this.userName) {
        this.getMessages();
      }
    }
  },
  methods: {
    submitForm() {
      this.$store.dispatch('setName', this.form.name)
    },

    getMessages() {
      this.loading = true;
      fetchMessages()
        .then((response) => {
          this.messages = response.data;
          this.messages.forEach(this.prepareDate);
          this.loading = false;
          console.log('success fetch messages')
        }).catch(err => new Error(err))
    },

    postMessage() {
      this.loading = true;
      saveMessage({
        author: this.userName,
        text: this.form.message,
        date: Date.now()
      })
        .then(response => {
          this.form.message = '';
          this.prepareDate(response.data);
          this.messages.push(response.data)
          this.loading = false;
        })
        .catch(err => new Error(err))
    },

    prepareDate(message) {
      const date = new Date(message.date)
      message.dateISOS = date.toISOString();
      message.dateDisplay = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    },

    refreshData() {
      this.interval = setInterval(this.getMessages, 15000)
    }
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  max-width: 1480px;
  min-height: 100vh;
  text-align: center;
}

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

blockquote {
  padding: 20px;
  text-align: left;
}

blockquote:nth-child(odd) {
  background-color: #EBEEF5;
}


</style>
