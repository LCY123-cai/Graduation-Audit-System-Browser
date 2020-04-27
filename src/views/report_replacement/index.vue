<template>
  <div class="app-container">
    <div style="padding-bottom: 10px"></div>

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
<!--      <el-table-column label="原课程学分" align="center" width="100">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.original_course_credit }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="替代课程A" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.replacement_course_a }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="替代课程A学分" align="center" width="120">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.replacement_course_a_credit }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="替代课程B" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.replacement_course_b }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="替代课程B学分" align="center" width="120">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.replacement_course_b_credit }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="替代课程C" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.replacement_course_c }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="替代课程C学分" align="center" width="120">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.replacement_course_c_credit }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="提交日期" align="center" class-name="status-col" width="160">
        <template slot-scope="{row}">
          <span>{{ row.report_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核结果" align="center" class-name="status-col" width="160">
        <template slot-scope="{row}">
          <span v-if="row.audit_result==='0'" style="color: #E6A23C">审核中</span>
          <span v-else-if="row.audit_result==='1'" style="color: #67C23A">通过</span>
          <span v-else-if="row.audit_result==='2'" style="color: #F56C6C">未通过</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
/* eslint-disable */

  import { fetchList } from '@/api/report_replacement'
  import waves from '@/directive/waves/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import {mapGetters} from 'vuex'

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
        downloadLoading: false
      }
    },
    computed:{
      ...mapGetters({username:'username'})
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        this.listQuery.studentId = this.username
        fetchList(this.listQuery).then(response => {
          this.list = response.items[0]
          this.total = response.items[0].length
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
          id: undefined,
          year: '',
        }
      }
    }
  }
</script>
