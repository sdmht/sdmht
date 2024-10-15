<template>
  <q-card>
    <q-card-section> 登录/注册 </q-card-section>
    <q-form>
      <q-input
        v-model="表单.邮箱"
        label="邮箱"
        type="email"
        :rules="[(val) => val || '请输入邮箱']"
      />
      <q-input v-model="表单.验证码" label="验证码" />
      <q-input v-model="表单.密码" label="密码" type="password" />
      <q-btn label="提交" type="submit" color="primary" />
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
const 表单 = {
  邮箱: '',
  验证码: '',
  密码: '',
}
</script>
