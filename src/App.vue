<script setup lang="ts">
import { RouterView } from 'vue-router'
import TabMenu from 'primevue/tabmenu';
import { ref } from "vue"
const items = ref([
    {
        label: '皓齿思睿口腔门诊',
        icon: 'pi pi-fw pi-home',
        disabled: true,
    },
    {
        label: '处方管理',
        icon: 'pi pi-fw pi-file-edit',
        to: '/'
    },
    {
        label: '开处方',
        icon: 'pi pi-fw pi-file-edit',
        to: '/new'
    },
    {
        label: '治疗项目管理',
        icon: 'pi pi-fw pi-calendar',
        to: '/treatment'
    },
]);
</script>

<template>
  <TabMenu :model="items"/>
  <RouterView id="main" />
</template>

