<template>
  <div class="app-container">
    <div style="padding-bottom: 10px">
      <el-input v-model="listQuery.studentId" placeholder="学号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="班级" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAudit">
        审核毕业条件
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
      <el-table-column label="学号" sortable="custom" min-width="170px" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span class="link-type" >{{ row.studentId }}</span>
          <el-tag>{{ row.studentClass }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.studentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总学分" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.accum_credit" class="link-type">{{ row.accum_credit }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="加权平均分" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.average_score" class="link-type">{{ row.average_score }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="重学次数" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.relearn_time" class="link-type">{{ row.relearn_time }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="处分记录" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.punishment_time" class="link-type">{{ row.punishment_time }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="学位评定委员会" align="center" width="140">
        <template slot-scope="{row}">
          <span v-if="row.voting_results=='1'" style="color: #E6A23C">审核中</span>
          <span v-else-if="row.voting_results=='2'" style="color: #67C23A">通过</span>
          <span v-else-if="row.voting_results=='-1'" style="color: #F56C6C">未通过</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="毕业证书" align="center" width="110">
        <template slot-scope="{row}">
          <span v-if="row.graduation==='1'" class="link-type"><svg-icon icon-class="right" /></span>
          <span v-else-if="row.graduation==='0'"><svg-icon icon-class="wrong" /></span>
        </template>
      </el-table-column>
      <el-table-column label="学位证书" align="center" width="110">
        <template slot-scope="{row}">
          <span v-if="row.degree==='1'" class="link-type"><svg-icon icon-class="right" /></span>
          <span v-else-if="row.degree==='0'"><svg-icon icon-class="wrong" /></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="130" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.graduation==='1'&&row.degree==='0'&&row.voting_results==null" size="mini" type="success" @click="handleVote(row)">
            发起审核投票
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="创建" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="学号">
          <el-input :disabled="true" v-model="temp.studentId" style="width: 130px"/>
        </el-form-item>
        <el-form-item label="参与人数" prop="participant">
          <el-input v-model="temp.participant" style="width: 70px"/>
        </el-form-item>
        <el-form-item label="截止时间" prop="deadline">
          <el-date-picker v-model="temp.deadline"
                          size="small"
                          type="datetime"
                          placeholder="选择截止时间" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="publishVote()">
          确定
        </el-button>
      </div>
    </el-dialog>


    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList()" />

  </div>
</template>

<script>
/* eslint-disable */

  import { fetchList , doAudit } from '@/api/graduation_audit'
  import { createVote } from '@/api/vote'
  import waves from '@/directive/waves/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  const calendarTypeOptions = [
    { key: 'A', display_name: '计科18A' },
    { key: 'B', display_name: '计科18B' },
    { key: 'C', display_name: '计科18C' }
  ]
  // arr to obj, such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})
  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    filters: {
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
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
        calendarTypeOptions,
        sortOptions: [{ label: '按序号顺序', key: '+id' }, { label: '按序号逆序', key: '-id' }],
        showReviewer: false,
        temp: {
          studentId: '',
        },
        dialogFormVisible: false,
        rules: {
          deadline: [{ required: true, message: '截止时间不能为空', trigger: 'blur' }],
          participant:[{ required:true,message:'参与人数不能为空',trigger:'blur' }],
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
        this.listQuery.page = 1
        this.getList()
      },
      handleAudit(){
        doAudit().then((response)=>{
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
      },
      handleVote(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      publishVote() {
        createVote({
          studentId:this.temp.studentId,
          participant:this.temp.participant,
          deadline:this.temp.deadline
        }).then((response)=>{
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
          studentId: undefined,
          type: undefined,
        }
      },
      getSortClass: function(key) {
        const sort = this.listQuery.sort
        return sort === `+${key}` ? 'ascending' : 'descending'
      }
    }
  }
</script>
