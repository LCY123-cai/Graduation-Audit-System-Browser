<template>
  <div class="app-container">
    <div style="padding-bottom: 10px">
      <el-input v-model="listQuery.studentId" placeholder="学号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="学号"  align="center" width="130px">
        <template slot-scope="{row}">
          <span>{{ row.studentId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" width="110px">
        <template slot-scope="{row}">
          <span>{{ row.studentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学院" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.college }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专业" align="center" min-width="190">
        <template slot-scope="{row}">
          <span>{{ row.major }}</span>
        </template>
      </el-table-column>
      <el-table-column label="行政班" align="center" width="120">
        <template slot-scope="{row}">
          <span><el-tag>{{ row.studentClass }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="必修课已获学分" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.gained_required_course_credit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="选修课已获学分" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.gained_elective_course_credit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="不及格学分" align="center" width="130">
        <template slot-scope="{row}">
          <span>{{ row.failed_credit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="必修课应修学分" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.required_course_credit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="选修课应修学分" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.elective_course_credit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="通过情况" align="center" min-width="110">
        <template slot-scope="{row}">
          <span v-if="row.gained_required_course_credit>=row.required_course_credit&&row.gained_elective_course_credit>=row.elective_course_credit&&row.failed_credit==='0.0'">
            <svg-icon icon-class="right"></svg-icon>
          </span>
          <span v-else>
            <svg-icon icon-class="wrong"></svg-icon>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList()" />

  </div>
</template>

<script>
/* eslint-disable */

  import { fetchList , doAudit } from '@/api/graduation_audit'
  import { createVote } from '@/api/vote'
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
          college: '',
          studentId: '',
        },
        temp: {
          studentId: '',
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
            this.total = response.items[0].length
            // Just to simulate the time of the request
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          })
      },
      handleFilter() {
        console.log(this.listQuery)
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
