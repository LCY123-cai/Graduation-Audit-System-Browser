<template>
  <div class="app-container">
    <div style="padding-bottom: 10px">
      <el-input v-model="listQuery.studentId" placeholder="学号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加记录
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
      <el-table-column label="序号" align="center" width="80" >
        <template slot-scope="{row}">
          <span>{{ row.honourId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.studentId }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="姓名" align="center" width="100">-->
<!--        <template slot-scope="{row}">-->
<!--          <span v-if="row.studentName">{{ row.studentName }}</span>-->
<!--          <span v-else>0</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="所获荣誉或突出表现" align="center" width="500">
        <template slot-scope="{row}">
          <span>{{ row.honour }}</span>
        </template>
      </el-table-column>
      <el-table-column label="达成日期" class-name="status-col" width="200">
        <template slot-scope="{row}">
          <span>{{ row.obtain_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" class-name="status-col" width="200">
        <template slot-scope="{row}">
          <span>{{ row.record_time }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="'创建'" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="temp.studentId" style="width: 120px"/>
        </el-form-item>
<!--        <el-form-item label="姓名" prop="studentName">-->
<!--          <el-input v-model="temp.studentName" style="width: 100px"/>-->
<!--        </el-form-item>-->
        <el-form-item label="荣誉/表现" prop="honour">
          <el-input v-model="temp.honour" type="textarea" style="width: 400px"/>
        </el-form-item>
        <el-form-item label="达成日期">
          <el-date-picker v-model="temp.obtain_time" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 200px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */

  import { fetchList, createHonour, updateHonour } from '@/api/honour'
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
        },
        temp: {
          studentId: undefined,
        },
        dialogFormVisible: false,
        rules: {
          studentId: [{ required: true, message: '学号不能为空', trigger: 'blur' }],
          studentName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
          honour: [{ required: true, message: '荣誉或表现不能为空', trigger: 'blur' }]
        },
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
          this.list = response.items[0]
          this.total = response.items[0].length
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      resetTemp() {
        this.temp = {
          studentId: undefined,
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createHonour(this.temp).then((response) => {
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
              this.getList()
            })
          }
        })
      }
    }
  }
</script>
