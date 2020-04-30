<template>
  <div class="app-container">
    <div style="padding-bottom: 10px">
      <el-input v-model="listQuery.studentId" placeholder="学号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-upload
        action=""
        :show-file-list="false"
        :before-upload="beforeUpload"
        :on-success="onSuccess"
        :on-error="onError"
        :disabled="importDisabled"
        style="display: inline-flex;margin-right: 10px;"
        :http-request=uploadExcel>
        <el-button :disabled="importDisabled" type="success" :icon="importDataIcon">
          {{importDataText}}
        </el-button>
      </el-upload>
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
      <el-table-column label="学号" min-width="180px">
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
      <el-table-column label="年级" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.enrollment_year">{{ row.enrollment_year }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="学院" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.college">{{ row.college }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="专业" align="center" width="190">
        <template slot-scope="{row}">
          <span v-if="row.major">{{ row.major }}</span>
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
      <el-table-column label="课程代码" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.courseId">{{ row.courseId }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名称" align="center" width="150">
        <template slot-scope="{row}">
          <span v-if="row.course_name">{{ row.course_name }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="课程性质" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.course_nature">{{ row.course_nature }}</span>
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
      <el-table-column label="重学标记" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.relearn_mark">{{ row.relearn_mark }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
/* eslint-disable */

  import { fetchList, importData} from '@/api/score'
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
        },
        downloadLoading: false,
        // 导入按钮的文本
        importDataText: '导入数据(Excel文件)',
        // 导入按钮的图标
        importDataIcon: 'el-icon-upload2',
        // 导入按钮是否被禁用
        importDisabled: false
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
      uploadExcel(param){
        const formData = new FormData()
        formData.append('file', param.file)
        importData(formData).then((response)=>{
          if(response.code===200){
            this.onSuccess()
          }
          else {
            this.onError()
          }
        })
      },
      // 导入文件失败后回调
      onError() {
        this.importDataText = '导入数据(Excel文件)';
        this.importDataIcon = 'el-icon-upload2';
        this.importDisabled = false;
        this.getList();
        this.$message.error("导入失败！");
      },
      // 导入文件成功后回调
      onSuccess() {
        // 成功后文本修改为原来的导入数据
        this.importDataText = '导入数据(Excel文件)';
        // 图标修改
        this.importDataIcon = 'el-icon-upload2';
        // 将上传组件改为允许使用
        this.importDisabled = false;
        // 调用刷新数据的方法
        this.getList();
        // message 弹出消息
        this.$message.success("导入成功！");
      },
      // 上传文件调用
      beforeUpload() {
        // 将文本修改为正在导入
        this.importDataText = '正在导入';
        // 修改其图标
        this.importDataIcon = 'el-icon-loading';
        // 将其上传组件暂时禁用
        this.importDisabled = true;
      }
    }
  }
</script>
