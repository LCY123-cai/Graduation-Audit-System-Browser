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
      <el-table-column label="学院" align="center" width="80">
        <template slot-scope="{row}">
          <span v-if="row.college" class="link-type">{{ row.college }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="原课程" align="center" width="150">
        <template slot-scope="{row}">
          <span v-if="row.original_course" class="link-type">{{ row.original_course }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="原课程学分" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.oc_credit" class="link-type">{{ row.oc_credit }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="替代课程" align="center" width="150">
        <template slot-scope="{row}">
          <span v-if="row.replace_course" class="link-type">{{ row.replace_course }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="替代课程学分" align="center" width="110">
        <template slot-scope="{row}">
          <span v-if="row.rc_credit" class="link-type">{{ row.rc_credit }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="提交日期" align="center" class-name="status-col" width="160">
        <template slot-scope="{row}">
          <span v-if="row.report_time" class="link-type">{{ row.report_time }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="审核" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="success" size="mini" @click="handleUpdate(row)">
            同意
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            否决
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
/* eslint-disable */

  import { fetchList, createHandle, updateHandle } from '@/api/handle_replacement'
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
          update_time:''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
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
            const tempData = Object.assign({}, this.temp)
            updateHandle(tempData).then(() => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row, index) {
        this.$notify({
          title: 'Success',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      },
      getSortClass: function(key) {
        const sort = this.listQuery.sort
        return sort === `+${key}` ? 'ascending' : 'descending'
      }
    }
  }
</script>
