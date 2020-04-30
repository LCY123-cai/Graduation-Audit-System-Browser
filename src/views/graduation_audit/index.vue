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
      <el-table-column label="详情" align="center" width="150">
        <template slot-scope="{row}">
          <el-link type="primary" @click="handleDetail(row)">查看详情</el-link>
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

    <el-dialog
      title="详情"
      :visible.sync="dialogVisible"
    >
      <el-table :data="info" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="studentId" label="学号" align="center"/>
        <el-table-column prop="studentName" label="姓名" align="center"/>
        <el-table-column prop="studentClass" label="班级" align="center"/>
        <el-table-column prop="college" label="所在分院" align="center"/>
        <el-table-column prop="major" label="专业" align="center"/>
      </el-table>
      <el-divider>不及格课程列表</el-divider>
      <el-table :data="failed" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="academic_year" label="学年" align="center" width="100"/>
        <el-table-column prop="term" label="学期" align="center" width="50"/>
        <el-table-column prop="college" label="开课学院" align="center"/>
        <el-table-column prop="courseId" label="不及格课程代码" align="center" width="150"/>
        <el-table-column prop="course_name" label="不及格课程名称" align="center" width="150"/>
        <el-table-column prop="credit" label="课程学分" align="center"/>
        <el-table-column prop="course_nature" label="课程性质" align="center"/>
        <el-table-column prop="maxscore" label="最高成绩" align="center"/>
      </el-table>
      <el-divider>未修读的必修课列表</el-divider>
      <el-table :data="unchosen" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="college" label="开课学院" align="center"/>
        <el-table-column prop="courseId" label="未修必修课课程代码" width="150" align="center"/>
        <el-table-column prop="course_name" label="未修必修课课程名称"  width="150" align="center"/>
        <el-table-column prop="credit" label="课程学分" align="center"/>
        <el-table-column prop="course_nature" label="课程性质" align="center"/>
      </el-table>
      <el-divider>修读的选修课列表</el-divider>
      <el-table :data="elective" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="academic_year" label="学年" align="center" width="100"/>
        <el-table-column prop="term" label="学期" align="center" width="50"/>
        <el-table-column prop="college" label="开课学院" align="center"/>
        <el-table-column prop="courseId" label="选修课课程代码" width="150" align="center"/>
        <el-table-column prop="course_name" label="选修课课程名称"  width="150" align="center"/>
        <el-table-column prop="credit" label="课程学分" align="center"/>
        <el-table-column prop="course_nature" label="课程性质" align="center" width="120"/>
        <el-table-column prop="score" label="成绩" align="center"/>
        <el-table-column prop="retry_score" label="补考成绩" align="center"/>
        <el-table-column prop="relearn_score" label="重修成绩" align="center"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList()" />

  </div>
</template>

<script>
/* eslint-disable */

  import { fetchList , getDetail } from '@/api/graduation_audit'
  import waves from '@/directive/waves/waves' // waves directive
  import Pagination from '@/components/Pagination'
import score from "../../../mock/score"; // secondary package based on el-pagination

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
        //选修课课程信息
        elective:[],
        //不及格课程信息
        failed: [],
        //未修的必修课信息
        unchosen:[],
        //学生信息
        info:[],
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
        dialogVisible:false,
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
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          })
      },
      handleDetail(row){
        //初始化学生信息
        this.info=[]
        //将对象添加进数组
        this.info=this.info.concat(row)
        //获取学号
        let studentId=row.studentId
        //获取不及格课程、未修必修课课程、选修的选修课
        getDetail({studentId}).then((response)=>{
          this.failed=response.items[0]
          this.unchosen=response.items[1]
          this.elective=response.items[2]
          this.failed[0].maxscore=Math.max(Number(this.failed[0].score),Number(this.failed[0].retry_score),Number(this.failed[0].relearn_score))
        })
        this.dialogVisible=true
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
