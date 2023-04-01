<script lang="ts">
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { PrescriptionService } from '../service/PrescriptionService'
import lodash from 'lodash'

const prescriptionService = new PrescriptionService()
export default {
  components: {
    Button,
    Divider,
    DataTable,
    Column
  },
  data() {
    return {
      users: [],
      prescription: {},
    }
  },
  computed: {
    code() {
      return lodash.padStart(this.prescription.id, 8, '0')
    }
  },
  created() {
    this.loadPrescription()
  },
  methods: {
    print() {
      this.$print({ printable: this.$refs.prescription, header: '皓齿思睿口腔诊所', css: '../src/assets/print.css', type: 'html' })
    },
    loadPrescription() {
      prescriptionService
        .find(parseInt(this.$route.params.id))
        .then(res => {
          console.log(res)
          this.prescription = res
        })
    },
  }
}
</script>

<template>
  <div style="padding: 20px 300px">
    <div>
      <Button label="打印" @click="print" icon="pi pi-print" style="margin: 10px 10px" severity="success" size="small" />
    </div>
    <div ref="prescription">
      <div class="title">
        <h2>口腔治疗出处置单</h2>
      </div>
      <div class="divider"></div>
      <div class="basic">
        <div class="basic-item">处方编号: {{ code }}</div>
        <div class="basic-item">日期: {{ prescription.createAt }}</div>
      </div>
      <div class="divider"></div>
      <div class="basic">
        <div class="basic-item">姓名: {{ prescription.name }}</div>
        <div class="basic-item">出生日期: {{ prescription.age }}</div>
        <div class="basic-item">性别: {{ prescription.gender }}</div>
      </div>
      <div class="basic">
        <div class="basic-item">科别: {{ prescription.department }}</div>
        <div class="basic-item-2">备注: {{ prescription.remark }}</div>
      </div>
      <div class="divider"></div>
      <h3 style="margin-top: 20px">治疗项目</h3>
      <div class="basic-item-3 item" style="padding: 10px 30px;" v-for="(item, index) in prescription.items">
        {{ index + 1 }}、 {{ item.name }} , {{ item.remark }}
      </div>
      <div id="footer">
        <div class="basic">
          <div class="basic-item"></div>
          <div class="basic-item"></div>
          <div class="basic-item cost" style="float:right">总费用￥: {{ prescription.cost }}元</div>
        </div>
        <div class="basic">
          医生已向我解释治疗方案，我已清楚并接受该方案及收费价格。
        </div>
        <div class="divider"></div>
        <div class="basic">
          <div class="basic-item">患者/监护人签字:</div>
          <div class="basic-item"></div>
          <div class="basic-item">医生签字:</div>
        </div>

        <div class="basic">
          <div class="basic-item">
            <div class="whitespace"></div>年
            <div class="whitespace"></div>月
            <div class="whitespace"></div>日
          </div>
          <div class="basic-item"></div>
          <div class="basic-item">
            <div class="whitespace"></div>年
            <div class="whitespace"></div>月
            <div class="whitespace"></div>日
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  text-align: center;
}

.basic {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.basic-item {
  width: 33.333%;
}

.basic-item-2 {
  width: 66.666%;
}

.basic-item-3 {
  width: 100%;
}

#footer {
  width: 100%;
  position: fixed;
  bottom: 0px;
  padding-bottom: 40px;
  margin: 10px
}

.whitespace {
  display: inline-block;
  width: 50px;
}
</style>
