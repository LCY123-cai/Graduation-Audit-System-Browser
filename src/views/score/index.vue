<template>
  <div class="app-container">
    <div style="padding-bottom: 10px">
      <el-input v-model="listQuery.studentId" placeholder="学号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
<!--      <el-select v-model="listQuery.studentClass" placeholder="班级" clearable class="filter-item" style="width: 130px">-->
<!--        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />-->
<!--      </el-select>-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="syncData">
        从教务系统同步数据
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
          <span>{{ row.scoreId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.studentId }}</span>
          <el-tag>{{ row.studentClass}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.studentName">{{ row.studentName }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="学年" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.academic_year">{{ row.academic_year }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="学期" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.term">{{ row.term }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="学院" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.college">{{ row.college }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名称" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.course_name">{{ row.course_name }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="学分" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.credit">{{ row.credit }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="成绩" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.score">{{ row.score }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="补考成绩" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.retry_score">{{ row.retry_score }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="重学成绩" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.relearn_score">{{ row.relearn_score }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
/* eslint-disable */

  import { fetchList, getScore ,createScore} from '@/api/score'
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
        update_time:'',
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
        },
        temp: {
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
      syncData() {
            //模拟从教务网获取数据
            getScore().then((r) => {
              //添加进自己的数据库
              createScore(r.data).then((response)=>{
                // this.list.unshift(this.temp)
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
            })
      }
    }
  }
</script>
