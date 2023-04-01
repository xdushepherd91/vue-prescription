<script setup>
import { ref, onMounted, computed } from 'vue';
import { PrescriptionService } from '@/service/PrescriptionService.ts'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import AutoComplete from 'primevue/autocomplete'
import Paginator from 'primevue/paginator'
import lodash from 'lodash'
import { useRouter } from 'vue-router'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"
import Toast from 'primevue/toast'

const toast = useToast()
const confirm = useConfirm()
const service = new PrescriptionService()
const router = useRouter()
const prescriptions = ref([])
const item = ref('');
const row = ref(8)
const total = ref(0)
const page = ref(0)
const filterdPresciptions = computed(() => {
    let result = prescriptions.value.filter(prescription => {
        return !item.value || prescription.name.indexOf(item.value) >= 0
    })
    total.value = result.length
    return result
})


const pagedPrescriptions = computed(() => {
    let temp = lodash.chunk(filterdPresciptions.value, row)
    return lodash.chunk(filterdPresciptions.value, row.value)[page.value]
})


function pageChange(pageState) {
    page.value = pageState.page
}

function filter() {
    this.pagedPrescriptions = lodahs.dropWhile(this.pagedPrescriptions, item => item.name.indexOf(item) >= 0)
}

function jump2Print(prescription) {
    router.push({ path:`/print/${prescription.id}`})
}

function confirmDelete(prescription) {
    confirm.require({
        message: '确定要删除处方吗？',
        header: '确认',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            deletePrescription(prescription)
        },
        reject: () => {
        }
    });
}
function loadPrescription() {
    service.findAll()
        .then(result => {
            prescriptions.value = result
        })
        .catch(err => {
          toast.add({ severity: 'error', summary: '异常', detail: '处方加载失败', life: 1000 });
        })
}

function deletePrescription(prescription) {
    service.deletePrescription(prescription.id)
       .then(res => {
          toast.add({ severity: 'info', summary: '已删除', detail: '处方已删除', life: 1000 });
          loadPrescription()
       })

}

function copy(prescription) {
    let newPrescription = JSON.parse(JSON.stringify(prescription))
    delete newPrescription.id
    service.addPrescription(newPrescription)
       .then(res => {
            router.push({ path:`/new/${res}`})
       })
}

onMounted(() => {
    loadPrescription()
});

</script>

<template>
    <div class="card">
        <Toast />
        <ConfirmDialog></ConfirmDialog>
        <div style="margin-bottom: 10px;">
            <span style="margin-right: 30px">患者查询</span>
            <AutoComplete v-model="item" />
        </div>
        <DataTable :value="pagedPrescriptions" tableStyle="min-width: 50rem">
            <Column field="id" header="处方编号"></Column>
            <Column field="name" header="患者姓名"></Column>
            <Column field="gender" header="患者性别"></Column>
            <Column field="age" header="患者年龄"></Column>
            <Column field="diagnosis" header="临床诊断"></Column>
            <Column field="cost" header="费用"></Column>
            <Column  header="操作">
                    
                <template  #body="slotProps">
                    <span  @click="jump2Print(slotProps.data)" class="button" style="margin-left: 20px;">打印</span>
                    <span  @click="copy(slotProps.data)" class="button" style="margin-left: 20px;">复制</span>
                    <span  @click="confirmDelete(slotProps.data)" class="button" style="margin-left: 20px;">删除</span>
                </template>
            </Column>
        </DataTable>
        <Paginator :rows="row" :totalRecords="total" @page="pageChange"></Paginator>
    </div>
</template>

<style>
.card {
    padding: 20px 100px;
    text-align: center;
}

.button {
  margin: 10px 10px;
  cursor: pointer;
  background-color: aquamarine;
  border-radius: 5px;
  padding: 6px;
}

</style>