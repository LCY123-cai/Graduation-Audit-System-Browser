<template>
  <div class="app-container">
    <div style="padding-bottom: 10px">
      <el-input v-model="listQuery.studentId" placeholder="学号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加处分记录
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
          <span>{{ row.punishmentId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号" min-width="100px">
        <template slot-scope="{row}">
          <span >{{ row.studentId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所受处分" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.punishment">{{ row.punishment }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="原因" align="center" width="650">
        <template slot-scope="{row}">
          <span v-if="row.reason">{{ row.reason }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" class-name="status-col" width="200">
        <template slot-scope="{row}">
          <span v-if="row.record_time">{{ row.record_time }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="创建" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="temp.studentId" style="width: 120px"/>
        </el-form-item>
        <el-form-item label="所受处分" prop="punishment">
          <el-select v-model="temp.punishment" class="filter-item" placeholder="Please select">
            <el-option v-for="item in punishmentOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="原因" prop="reason">
          <el-input v-model="temp.reason" type="textarea" style="width: 400px"/>
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

  import { fetchList, createPunishment } from '@/api/punishment'
  import waves from '@/directive/waves/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import { parseTime } from '@/utils'

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
          studentId: undefined,
        },
        sortOptions: [{ label: '按序号顺序', key: '+punishmentId' }, { label: '按序号逆序', key: '-punishmentId' }],
        punishmentOptions:['警告', '严重警告', '记过', '留校察看', '开除学籍'],
        temp: {
          record_time:'',
        },
        dialogFormVisible: false,
        rules: {
          studentId: [{ required: true, message: '学号不能为空', trigger: 'blur' }],
          studentName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
          punishment: [{ required: true, message: '请选择处分', trigger: 'change' }],
          reason: [{ required: true, message: '原因不能为空', trigger: 'blur' }]
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
            console.log(this.temp)
            createPunishment(this.temp).then((response) => {
              this.list.unshift(this.temp)
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
          }
        })
      }
    }
  }
</script>
