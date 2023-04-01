<script setup>
import { ref, onMounted, computed } from 'vue';
import { TreatmentService } from '@/service/TreatmentService'
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

import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'

const toast = useToast()
const confirm = useConfirm()
const service = new TreatmentService()
const router = useRouter()
const treatments = ref([])
const treatment = ref([])
const item = ref('');
const row = ref(8)
const total = ref(0)
const page = ref(0)

const filteredTreatments = computed(() => {
    let result = treatments.value.filter(treatment => {
        return !item.value || treatment.name.indexOf(item.value) >= 0
    })
    total.value = result.length
    return result
})


const pagedTreatments = computed(() => {
    let temp = lodash.chunk(filteredTreatments.value, row)
    return lodash.chunk(filteredTreatments.value, row.value)[page.value]
})


function pageChange(pageState) {
    page.value = pageState.page
}

function confirmDelete(treatment) {
    confirm.require({
        message: '确定要删除吗？',
        header: '确认',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            deleteTreatment(treatment)
        },
        reject: () => {
        }
    });
}
function loadTreatment() {
    service.findAll()
        .then(result => {
            treatments.value = lodash.reverse(result)
        })
        .catch(err => {
            console.error(err)
            toast.add({ severity: 'error', summary: '异常', detail: '数据加载失败', life: 1000 });
        })
}

function deleteTreatment(treatment) {
    service.delete(treatment.id)
        .then(res => {
            toast.add({ severity: 'info', summary: '已删除', detail: '治疗项目已删除', life: 1000 });
            loadTreatment()
        })

}

function save(newTreatment) {
    service.addTreatment(JSON.parse(JSON.stringify(newTreatment)))
        .then(res => {
            toast.add({ severity: 'info', summary: '已添加', detail: '治疗项目添加成功', life: 1000 });
            loadTreatment()
        })
}

function update(newTreatment) {
    service.updateTreatment(JSON.parse(JSON.stringify(newTreatment)))
        .then(res => {
            toast.add({ severity: 'info', summary: '已添加', detail: '治疗项目添加成功', life: 1000 });
            loadTreatment()
        })
}

function addNewitem() {
    let treatment = {
        name: '根管治疗',
        price: 14,
        quantity: 1,
        remark: '常规治疗',
    }
    treatments.value.unshift(treatment)
}

onMounted(() => {
    loadTreatment()
});

</script>

<template>
    <div class="card">
        <Toast />
        <ConfirmDialog></ConfirmDialog>
        <div style="margin-bottom: 10px;">
            <span style="margin-right: 30px">治疗项目查询</span>
            <AutoComplete v-model="item" />
            <span @click="addNewitem" class="button" style="margin-left: 20px;">添加费用项</span>
        </div>
        <DataTable :value="pagedTreatments" tableStyle="min-width: 50rem">
            <Column field="id" header="项目编号"></Column>
            <Column field="age" header="项目名">
                <template #body="slotProps">
                    <InputText v-model="slotProps.data.name" />
                </template>
            </Column>
            <Column header="项目价格">
                <template #body="slotProps">
                    <InputNumber v-model="slotProps.data.price" inputId="minmaxfraction" :minFractionDigits="2"
                        :maxFractionDigits="5" />
                </template>
            </Column>
            <Column field="age" header="项目备注">
                <template #body="slotProps">
                    <InputText v-model="slotProps.data.remark" />
                </template>
            </Column>
            <Column header="操作">
                <template #body="slotProps">
                    <span v-if="slotProps.data.id" @click="update(slotProps.data)" class="button"
                        style="margin-left: 20px;">更新</span>
                    <span v-else @click="save(slotProps.data)" class="button blue" style="margin-left: 20px;">保存</span>
                    <span @click="confirmDelete(slotProps.data)" class="button warn" style="margin-left: 20px;">删除</span>
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

.blue {
    background-color: rgb(170, 228, 228) !important;
}

.warn {
    background-color: orange !important;
}
</style>