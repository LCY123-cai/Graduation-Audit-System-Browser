<template>
  <div class="app-container">
    <div style="padding-bottom: 10px">
      <el-input v-model="listQuery.student_id" placeholder="学号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
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
      @sort-change="sortChange"
    >
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号" min-width="100px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.student_id }}</span>
          <el-tag>{{ row.classroom }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.name" class="link-type">{{ row.name }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="所获荣誉或突出表现" align="center" width="500">
        <template slot-scope="{row}">
          <span v-if="row.honour" class="link-type">{{ row.honour }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="达成日期" class-name="status-col" width="200">
        <template slot-scope="{row}">
          <span v-if="row.obtain_time" class="link-type">{{ row.obtain_time }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" class-name="status-col" width="200">
        <template slot-scope="{row}">
          <span v-if="row.update_time" class="link-type">{{ row.update_time }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="'创建'" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="学号" prop="student_id">
          <el-input v-model="temp.student_id" style="width: 120px"/>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" style="width: 100px"/>
        </el-form-item>
        <el-form-item label="荣誉/表现" prop="honour">
          <el-input v-model="temp.honour" type="textarea" style="width: 400px"/>
        </el-form-item>
        <el-form-item label="达成日期">
          <el-date-picker v-model="temp.obtain_time" type="date" placeholder="选择日期" style="width: 200px" />
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
          student_id: undefined,
          sort: '+id'
        },
        sortOptions: [{ label: '按序号顺序', key: '+id' }, { label: '按序号逆序', key: '-id' }],
        temp: {
          id: undefined,
          update_time:'',
          obtain_time:''
        },
        dialogFormVisible: false,
        textMap: {
          create: 'Create'
        },
        rules: {
          student_id: [{ required: true, message: '学号不能为空', trigger: 'blur' }],
          name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
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
          this.list = response.data.items
          this.total = response.data.total
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
          id: undefined,
          year: '',
        }
      },
      handleCreate() {
        this.resetTemp()
        // this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            this.temp.update_time = parseTime(new Date())
            createHonour(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      // handleUpdate(row) {
      //   this.temp = Object.assign({}, row) // copy obj
      //   this.temp.update_time = parseTime(new Date())
      //   this.dialogStatus = 'update'
      //   this.dialogFormVisible = true
      //   this.$nextTick(() => {
      //     this.$refs['dataForm'].clearValidate()
      //   })
      // },
      // updateData() {
      //   this.$refs['dataForm'].validate((valid) => {
      //     if (valid) {
      //       const tempData = Object.assign({}, this.temp)
      //       updatePunishment(tempData).then(() => {
      //         const index = this.list.findIndex(v => v.id === this.temp.id)
      //         this.list.splice(index, 1, this.temp)
      //         this.dialogFormVisible = false
      //         this.$notify({
      //           title: 'Success',
      //           message: '更新成功',
      //           type: 'success',
      //           duration: 2000
      //         })
      //       })
      //     }
      //   })
      // },
      // handleDelete(row, index) {
      //   this.$notify({
      //     title: 'Success',
      //     message: '删除成功',
      //     type: 'success',
      //     duration: 2000
      //   })
      //   this.list.splice(index, 1)
      // },
      getSortClass: function(key) {
        const sort = this.listQuery.sort
        return sort === `+${key}` ? 'ascending' : 'descending'
      }
    }
  }
</script>
