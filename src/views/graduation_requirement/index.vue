<template>
  <div class="app-container">
    <div style="padding-bottom: 10px">
      <el-input v-model="listQuery.enrollment_year" placeholder="年级" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.college" clearable placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.requirementId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年级" align="center">
        <template slot-scope="{row}">
          <span>{{ row.enrollment_year }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="学院" align="center">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.college }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="专业" align="center">
        <template slot-scope="{row}">
          <span>{{ row.major }}</span>
        </template>
      </el-table-column>
      <el-table-column label="必修课应修学分" align="center">
        <template slot-scope="{row}">
          <span>{{ row.required_course_credit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="选修课应修学分" align="center">
        <template slot-scope="{row}">
          <span>{{ row.elective_course_credit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
            <el-button type="success" size="mini" @click="handleUpdate(row)">
              编辑选修课学分
            </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="130px" style="width: 250px; margin-left:50px;">
        <el-form-item label="年级">
          <el-input disabled v-model="temp.enrollment_year" style="width: 120px"/>
        </el-form-item>
<!--        <el-form-item label="学院">-->
<!--          <el-input disabled v-model="temp.college" style="width: 120px"/>-->
<!--        </el-form-item>-->
        <el-form-item label="专业">
          <el-input disabled v-model="temp.major" style="width: 220px"/>
        </el-form-item>
        <el-form-item label="必修课应修学分">
          <el-input disabled v-model="temp.required_course_credit" style="width: 100px"/>
        </el-form-item>
        <el-form-item label="选修课应修学分">
          <el-input v-model="temp.elective_course_credit" style="width: 100px"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="doUpdate()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList()" />

  </div>
</template>

<script>
  /* eslint-disable */

  import { fetchList , updateRequirement} from '@/api/graduation_requirement'
  import waves from '@/directive/waves/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          enrollment_year:'',
          college:''
        },
        options: [{
          value: '理工分院',
          label: '理工分院'
        }, {
          value: '管理分院',
          label: '管理分院'
        }, {
          value: '人文分院',
          label: '人文分院'
        }, {
          value: '外语分院',
          label: '外语分院'
        }, {
          value: '经法分院',
          label: '经法分院'
        }],
        temp: {
        },
        dialogFormVisible:false,
        downloadLoading: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          console.log(response.items[0])
          this.list = response.items[0]
          this.total = response.total
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleUpdate(row){
        this.dialogFormVisible=true
        this.temp=row
      },
      doUpdate(){
        updateRequirement(this.temp).then((response)=>{
          const index = this.list.findIndex(v => v.requirementId === this.temp.requirementId)
          this.list.splice(index, 1, this.temp)
          this.dialogFormVisible = false
          if (response.code===200){
            this.$notify({
              title: 'Success',
              message: response.message,
              type: 'success',
              duration: 2000
            })
          }
          else{
            this.$notify({
              title: 'Error',
              message: response.message,
              type: 'error',
              duration: 2000
            })
          }
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      resetTemp() {
        this.temp = {
          studentId: undefined,
          type: undefined,
        }
      }
    }
  }
</script>
