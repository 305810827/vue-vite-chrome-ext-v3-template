<template>
  <div class="content-view">
    <button @click="openDialog">button1</button>
  </div>
</template>
<script setup>
import { reactive, onMounted } from "vue";

const state = reactive({
  currentTab: 'CONTENT_SCRIPTS_INIT'
});
//
onMounted(() => {
  chrome.runtime.sendMessage({ type: "POPUP_INIT" }, async tab => {
    state.currentTab = await tab;
    console.log(state.currentTab, 'currentTab');
  });
});

const openDialog = () => {
  alert('openDialog')
}
</script>

<style>
.content-view {
  position: fixed;
  right: 100px;
  top: 100px;
  width: 80px;
  height: 40px;
}
/*.overlay {*/
/*  @apply fixed inset-0 w-full h-full bg-black bg-opacity-10 z-50;*/
/*}*/

/*.popup {*/
/*  @apply absolute top-4 right-4 bg-white shadow-lg p-4 rounded-md w-72;*/
/*}*/
</style>
