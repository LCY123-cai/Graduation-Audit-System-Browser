<template>
  <div class="app-container">
    <div style="padding-bottom: 10px">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="syncData">
        获取学生信息
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
      <el-table-column label="学号" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.studentId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专业名称" align="center" width="500">
        <template slot-scope="{row}">
          <span>{{ row.major }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入学年份" class-name="status-col" width="200">
        <template slot-scope="{row}">
          <span>{{ row.enrollment_year }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学制" class-name="status-col" width="200">
        <template slot-scope="{row}">
          <span>{{ row.system }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
  /* eslint-disable */

  import { fetchList, createStudent ,getStudent} from '@/api/student'
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
          studentId: undefined,
        }
      },
      syncData(){
        getStudent().then((r)=>{
          createStudent(r.data).then((response)=>{
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
