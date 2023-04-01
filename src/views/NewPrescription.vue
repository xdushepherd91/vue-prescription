<script lang="ts">
import Button from 'primevue/button'
import Divider from 'primevue/divider'

import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import SelectButton from 'primevue/selectbutton'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import lodash from 'lodash'
import db from '@/service/db'
import { PrescriptionService } from '../service/PrescriptionService'
import { TreatmentService } from '@/service/TreatmentService'
import Toast from 'primevue/toast'
const prescriptionService = new PrescriptionService()
const treatmentService = new TreatmentService()

export default {
  components: {
    Button,
    Divider,
    InputNumber,
    InputText,
    SelectButton,
    Dropdown,
    DataTable,
    Column,
  },
  data() {
    return {
      prescription: {},
      currentItem: [],
      treatments: [],
      suggestions: [],
      index: 0,
      update: false,
    }
  },
  computed: {
    cost() {
      return this.sum()
    }
  },
  async created() {
    this.loadTreatments()
  },
  methods: {
    sum() {
      if (lodash.isEmpty(this.prescription.items)) {
        return 0
      }
      let result = 0;

      this.prescription.items.forEach(item => {
        result += item.price * item.quantity
      })

      return result
    },
    loadPrescription() {
      prescriptionService
        .find(parseInt(this.$route.params.id))
        .then(res => {
          this.index = 0
          res.items.forEach(item => {
            this.currentItem[++this.index] = lodash.find(this.treatments, element => element.id === item.id)
            item.index = this.index
          })
          this.index++
          this.prescription = res
        })
    },
    loadTreatments() {
      treatmentService.findAll()
        .then(result => {
          this.treatments = lodash.reverse(result)

          if (this.$route.params.id) {
            this.loadPrescription()
            this.update = true
          }
        })
        .catch(err => {
          console.error(err)
          toast.add({ severity: 'error', summary: '异常', detail: '数据加载失败', life: 1000 });
        })
    },
    formatDate(date) {
      let localDate =  [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-')
      let time =         [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
        ].join(':')
      return localDate + ' ' + time
    },
    padTo2Digits(num :number) {
      return lodash.padStart(num.toString(), 2, '0');
    },
    save() {
      this.prescription.cost = this.sum()
      const now = this.formatDate(new Date())
      this.prescription.createAt = now
      this.prescription.updateAt = now 
      prescriptionService.addPrescription(JSON.parse(JSON.stringify(this.prescription)))
        .then(res => {
          console.log(res)
          this.$router.push({ path: `/print/${res}` })
        })
        .catch(err => {
          console.log(err)
        })
    },
    updateData() {
      this.prescription.cost = this.sum()
      const now = this.formatDate(new Date())
      this.prescription.createAt = now
      this.prescription.updateAt = now 
      prescriptionService.updatePrescription(JSON.parse(JSON.stringify(this.prescription)))
        .then(res => {
          console.log(res)
          this.$router.push({ path: `/print/${this.prescription.id}` })
        })
        .catch(err => {
          console.log(err)
        })
    },
    addNewitem() {
      this.currentItem[this.index] = JSON.parse(JSON.stringify(this.treatments[0]))
      this.currentItem[this.index].index = this.index
      if (!this.prescription.items) {
        this.prescription.items = [this.currentItem[this.index++]]
        return
      }
      this.prescription.items.push(this.currentItem[this.index++])
    },
    searchItem(event) {
      if (!event.query.trim().length) {
        this.suggestions = this.treatments
      } else {
        this.suggestions = this.treatments.filter(item => item && item.name && item.name.indexOf(event.query) >= 0)
      }
    },
    deleteItem(item) {
      this.prescription.items = lodash.remove(this.prescription.items, element => element !== item)
    },
    pickItem(item) {
      console.log(item)
      item.name = this.currentItem[item.index].name
      item.price = this.currentItem[item.index].price
      item.remark = this.currentItem[item.index].remark
      item.id = this.currentItem[item.index].id
    }
  }
}
</script>

<template>
  <div style="padding: 30px 0;">
    <div style="border-bottom: 1px solid grey; padding: 20px;">
      <span class="basic-item">总费用￥：{{ cost }} 元</span>
      <span label="保存" v-if="!update" @click="save" class="button" style="margin-left: 20px;">保存</span>
      <span label="更新" v-else @click="updateData" class="button" style="margin-left: 20px;">保存</span>
      <span @click="addNewitem" class="button green" style="margin-left: 20px;">添加费用项</span>
    </div>
    <div ref="prescription">
      <div class="basic">
        <InputText placeholder="患者姓名" v-model="prescription.name" class="basic-item" />
        <InputText placeholder="出生日期" v-model="prescription.age" class="basic-item" />
        <div class="basic-item" style="display: flex">
          <div style="padding: 5px;    font-size: 1rem;font-weight: normal;">性别</div>
          <SelectButton v-model="prescription.gender" :options="['男', '女']" aria-labelledby="basic" />
        </div>
        <InputText placeholder="科别" v-model="prescription.department" class="basic-item" />
        <InputText placeholder="诊断" v-model="prescription.diagnosis" class="basic-item" />
        <InputText placeholder="备注" v-model="prescription.remarks" class="basic-item2" />
      </div>
      <div class="fee">
        <DataTable :value="prescription.items" tableStyle="min-width: 50rem">
          <Column header="治疗项目">
            <template #body="slotProps">
              <Dropdown v-model.sync="currentItem[slotProps.data.index]" :options="treatments" filter optionLabel="name"
                placeholder="治疗项目选择" style="width: 300px" @change="pickItem(slotProps.data)">
              </Dropdown>
            </template>
          </Column>
          <Column header="项目单价￥">
            <template #body="slotProps">
              <InputNumber v-model="slotProps.data.price" inputId="minmaxfraction" :minFractionDigits="2"
                :maxFractionDigits="5" />
            </template>
          </Column>
          <Column header="数量" field="quantity">
            <template #body="slotProps">
              <InputNumber v-model="slotProps.data.quantity" />
            </template>
          </Column>
          <Column header="备注" field="remark">

            <template #body="slotProps">
              <InputText v-model="slotProps.data.remark" />
            </template>
          </Column>
          <Column header="操作">
            <template #body="slotProps">
              <span @click="deleteItem(slotProps.data)" class="button" style="margin-left: 20px;">删除</span>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
::v-deep .p-button {
  padding: 5px 5px;
}

.button {
  margin: 10px 10px;
  cursor: pointer;
  background-color: aquamarine;
  border-radius: 5px;
  padding: 6px;
}

.basic {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.basic-item {
  width: 33%;
}

.basic-item-2 {
  width: 66%;
}

#footer {
  width: 100%;
  position: relative;
  bottom: 0px;
  padding-bottom: 40px;
  margin: 10px
}

.whitespace {
  display: inline-block;
  width: 50px;
}

.green {
  background-color: greenyellow !important;
}

.fee {
  border-top: 1px solid black;
  margin-top: 10px;
  padding-top: 20px;
}</style>
