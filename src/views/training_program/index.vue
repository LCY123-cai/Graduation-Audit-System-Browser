<template>
  <div class="app-container">
    <div style="padding-bottom: 10px">
      <el-input v-model="listQuery.enrollment_year" placeholder="年级" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="序号" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.trainingId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入学年份" align="center" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.enrollment_year }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学院" align="center" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.college }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专业名称" align="center" min-width="190px">
        <template slot-scope="{row}">
          <span>{{ row.major }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程代码" align="center" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.courseId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名称" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.course_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学分" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.credit">{{ row.credit }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="课程性质" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.course_nature }}</span>
        </template>
      </el-table-column>
      <el-table-column label="建议修读学期" align="center" width="120">
        <template slot-scope="{row}">
          <span v-if="row.recommend_term">{{ row.recommend_term }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
/* eslint-disable */

  import { fetchList, importData } from '@/api/training_program'
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
        importDataText: '导入Excel文件(.xlsx)',
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
          this.total = response.total
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
        }
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
        this.importDataText = '导入Excel文件(.xlsx)';
        this.importDataIcon = 'el-icon-upload2';
        this.importDisabled = false;
        this.getList();
        this.$message.error("导入失败！");
      },
      // 导入文件成功后回调
      onSuccess() {
        // 成功后文本修改为原来的导入数据
        this.importDataText = '导入Excel文件(.xlsx)';
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
