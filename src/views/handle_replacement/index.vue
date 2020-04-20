<template>
  <div class="app-container">
    <div style="padding-bottom: 10px">
      <el-input v-model="listQuery.studentId" placeholder="学号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
          <span>{{ row.original_course }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原课程学分" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.original_course_credit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="替代课程A" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.replacement_course_a }}</span>
        </template>
      </el-table-column>
      <el-table-column label="替代课程A学分" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.replacement_course_a_credit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="替代课程B" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.replacement_course_b }}</span>
        </template>
      </el-table-column>
      <el-table-column label="替代课程B学分" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.replacement_course_b_credit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="替代课程C" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.replacement_course_c }}</span>
        </template>
      </el-table-column>
      <el-table-column label="替代课程C学分" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.replacement_course_c_credit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交日期" align="center" class-name="status-col" width="160">
        <template slot-scope="{row}">
          <span>{{ row.report_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <span v-if="row.audit_result==='0'">
            <el-button type="success" size="mini" @click="handleAudit(row,'1')">
              同意
            </el-button>
            <el-button size="mini" type="danger" @click="handleAudit(row,'2')">
              否决
            </el-button>
          </span>
          <span v-if="row.audit_result==='1'" style="color: #67C23A">通过</span>
          <span v-if="row.audit_result==='2'" style="color: #F56C6C">未通过</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
/* eslint-disable */

  import { fetchList, updateReplacement } from '@/api/handle_replacement'
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
      handleAudit(row,num){
        row.audit_result=num
        updateReplacement(row).then((response)=>{
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
        }
      }
    }
  }
</script>
