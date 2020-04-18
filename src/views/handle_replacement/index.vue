<template>
  <div class="app-container">
    <div style="padding-bottom: 10px">
      <el-input v-model="listQuery.studentId" placeholder="学号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
          <span>{{ row.replacementId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.studentId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原课程" align="center" width="150">
        <template slot-scope="{row}">
          <span v-if="row.original_course">{{ row.original_course }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="原课程学分" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.original_course_credit">{{ row.original_course_credit }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="替代课程A" align="center" width="150">
        <template slot-scope="{row}">
          <span v-if="row.replacement_course_a">{{ row.replacement_course_a }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="替代课程学分A" align="center" width="110">
        <template slot-scope="{row}">
          <span v-if="row.replacement_course_a_credit">{{ row.replacement_course_a_credit }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="替代课程B" align="center" width="150">
        <template slot-scope="{row}">
          <span v-if="row.replacement_course_b">{{ row.replacement_course_b }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="替代课程学分B" align="center" width="110">
        <template slot-scope="{row}">
          <span v-if="row.replacement_course_b_credit">{{ row.replacement_course_b_credit }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="替代课程C" align="center" width="150">
        <template slot-scope="{row}">
          <span v-if="row.replacement_course_c">{{ row.replacement_course_c }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="替代课程学分C" align="center" width="110">
        <template slot-scope="{row}">
          <span v-if="row.replacement_course_c_credit">{{ row.replacement_course_c_credit }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="提交日期" align="center" class-name="status-col" width="160">
        <template slot-scope="{row}">
          <span v-if="row.report_time">{{ row.report_time }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="审核结果" align="center" class-name="status-col" width="160">
        <template slot-scope="{row}">
          <span v-if="row.audit_result">{{ row.audit_result }}</span>
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

    <el-dialog :visible.sync="dialogPvVisible" title="替代课程">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确定</el-button>
      </span>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
/* eslint-disable */

  import { fetchList, fetchPv, createHandle, updateHandle } from '@/api/handle_replacement'
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
          studentId: undefined,
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
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
      },
      handleFetchPv(id) {
        fetchPv(id).then(response => {
          this.pvData = response.data.pvData
          this.dialogPvVisible = true
        })
      }
    }
  }
</script>
