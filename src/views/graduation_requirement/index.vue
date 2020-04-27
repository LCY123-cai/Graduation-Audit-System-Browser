<template>
  <div class="app-container">
    <div style="padding-bottom: 10px">
      <el-input v-model="listQuery.enrollment_year" placeholder="入学年份" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        毕业需求
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
      @sort-change="sortChange"
    >
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.requirementId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入学年份" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.enrollment_year }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专业名称" align="center" min-width="170px">
        <template slot-scope="{row}">
          <span>{{ row.major }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学制" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.system }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总学分" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.accum_credit">{{ row.accum_credit }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="加权平均分" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.average_score">{{ row.average_score }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="重学次数" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.relearn_time">{{ row.relearn_time }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="处分记录" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.punishment_time">{{ row.punishment_time }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="修改日期" align="center" class-name="status-col" width="200">
        <template slot-scope="{row}">
          <span v-if="row.update_time">{{ row.update_time }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="dialogStatus==='create'?'创建':'更新'" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="入学年份" prop="enrollment_year">
          <el-input v-model="temp.enrollment_year" style="width: 100px"/>
        </el-form-item>
        <el-form-item label="专业名称" prop="major">
          <el-input v-model="temp.major" style="width: 170px"/>
        </el-form-item>
        <el-form-item label="学制" prop="system">
          <el-radio-group v-model="temp.system">
            <el-radio label="2" />
            <el-radio label="4" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="总学分" prop="accum_credit">
          <el-input v-model="temp.accum_credit" style="width: 100px"/> (毕业需要的学分总数)
        </el-form-item>
        <el-form-item label="加权平均分" prop="average_score">
          <el-input v-model="temp.average_score" style="width: 100px"/> (学位需要的加权平均成绩)
        </el-form-item>
        <el-form-item label="重学次数" prop="relearn_time">
          <el-input v-model="temp.relearn_time" style="width: 100px"/> (不影响学位的重学课程数)
        </el-form-item>
        <el-form-item label="处分记录" prop="punishment_time">
          <el-input v-model="temp.punishment_time" style="width: 100px"/> (不影响学位的行政处分的次数)
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */

  import { fetchList, createRequirement, updateRequirement, deleteRequirement } from '@/api/graduation_requirement'
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
          sort: '+id'
        },
        sortOptions: [{ label: '按序号顺序', key: '+id' }, { label: '按序号逆序', key: '-id' }],
        temp: {

        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        rules: {
          enrollment_year: [{ required: true, message: '入学年份不能为空', trigger: 'blur' }],
          major: [{ required: true, message: '专业名称不能为空', trigger: 'blur' }],
          system: [{ required: true, message: '学制不能为空', trigger: 'blur' }],
          accum_credit: [{ required: true, message: '学分不能为空', trigger: 'blur' }],
          average_score: [{ required: true, message: '加权平均成绩不能为空', trigger: 'blur' }],
          relearn_time: [{ required: true, message: '重修次数不能为空', trigger: 'blur' }],
          punishment_time: [{ required: true, message: '处分记录不能为空', trigger: 'blur' }]
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
      sortChange(data) {
        const { prop, order } = data
        if (prop === 'id') {
          this.sortByID(order)
        }
      },
      sortByID(order) {
        if (order === 'ascending') {
          this.listQuery.sort = '+id'
        } else {
          this.listQuery.sort = '-id'
        }
        this.handleFilter()
      },
      resetTemp() {
        this.temp = {
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            console.log(this.temp)
            createRequirement(this.temp).then((response) => {
              console.log(response)
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
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.update_time = parseTime(new Date())
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // const tempData = Object.assign({}, this.temp)
            updateRequirement(this.temp).then((response) => {
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
          }
        })
      },
      handleDelete(row, index) {
        deleteRequirement(row).then((response) => {
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
          this.list.splice(index, 1)
        })
      },
      getSortClass: function(key) {
        const sort = this.listQuery.sort
        return sort === `+${key}` ? 'ascending' : 'descending'
      }
    }
  }
</script>
