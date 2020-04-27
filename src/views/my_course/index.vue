<template>
  <div class="app-container">
    <div style="padding-bottom: 10px">
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
          <span>{{ row.studentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学年" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.academic_year }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学期" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.term }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名称" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.course_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学分" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.credit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成绩" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="补考成绩" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.retry_score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重学成绩" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.relearn_score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <span v-if="row.relearn_score<60&&row.relearn_score!==0">
            <el-button size="mini" type="success" @click="handleForm(row)">
              学分替代申请
            </el-button>
          </span>
          <span v-else-if="row.relearn_score===0&&row.retry_score<60&&row.retry_score!==0">
            <el-button size="mini" type="success" @click="handleForm(row)">
              学分替代申请
            </el-button>
          </span>
          <span v-else-if="row.relearn_score===0&&row.retry_score===0&&row.score<60">
            <el-button size="mini" type="success" @click="handleForm(row)">
              学分替代申请
            </el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="创建" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="学号">
          <el-input disabled v-model="temp.studentId" style="width: 120px"/>
        </el-form-item>
        <el-form-item label="原课程">
          <el-input disabled v-model="temp.original_course" style="width: 160px"/>
        </el-form-item>
        <el-form-item label="替代课程A" prop="replacement_course_a">
          <el-input v-model="temp.replacement_course_a" style="width: 160px"/>
        </el-form-item>
        <el-form-item label="替代课程B">
          <el-input v-model="temp.replacement_course_b" style="width: 160px"/>
        </el-form-item>
        <el-form-item label="替代课程C">
          <el-input v-model="temp.replacement_course_c" style="width: 160px"/>
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


    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
/* eslint-disable */

  import { fetchList, createReplacement } from '@/api/my_course'
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
        },
        rules: {
          replacement_course_a: [{ required: true, message: '至少要有一个课程A', trigger: 'blur' }]
        },
        dialogFormVisible:false,
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
        this.listQuery.studentId=this.username
        fetchList(this.listQuery).then(response => {
          this.list = response.items[0]
          this.total = response.items[0].length
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleForm(row){
        this.temp.studentId=this.username
        this.temp.original_course=row.course_name
        this.dialogFormVisible=true
      },
      createData(){
        createReplacement(this.temp).then((response)=>{
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
          this.dialogFormVisible=false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      }
    }
  }
</script>
