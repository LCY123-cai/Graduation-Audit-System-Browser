<template>
  <div class="app-container">
    <div style="padding-bottom: 10px">
      <el-input v-model="listQuery.student_id" placeholder="学号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="班级" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="filterData">
        筛选两证不齐的学生
      </el-button>
<!--      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">-->
<!--        审核人-->
<!--      </el-checkbox>-->
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
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号" min-width="170px">
        <template slot-scope="{row}">
          <span class="link-type" >{{ row.student_id }}</span>
          <el-tag>{{ row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column v-if="showReviewer" label="审核人" width="110px" align="center">-->
<!--        <template slot-scope="{row}">-->
<!--          <span style="color:red;">{{ row.reviewer }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="总学分" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.credit" class="link-type">{{ row.credit }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="加权平均分" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.average" class="link-type">{{ row.average }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="重学次数" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.relearn" class="link-type">{{ row.relearn }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="处分记录" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.punish" class="link-type">{{ row.punish }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="学位评定委员会" align="center" width="140">
        <template slot-scope="{row}">
          <span v-if="row.consideration" class="link-type">通过</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="毕业证书" align="center" width="110">
        <template slot-scope="{row}">
          <span v-if="row.credit>=144" class="link-type"><svg-icon icon-class="right" /></span>
          <span v-else><svg-icon icon-class="wrong" /></span>
        </template>
      </el-table-column>
      <el-table-column label="学位证书" align="center" width="110">
        <template slot-scope="{row}">
          <span v-if="row.credit>=144&&row.punish===0&&row.relearn<4&&row.average>=70" class="link-type"><svg-icon icon-class="right" /></span>
          <span v-else-if="row.credit>=144&&row.punish!==0&&row.relearn<4&&row.average>=70&&row.consideration==='1'"><svg-icon icon-class="right" /></span>
          <span v-else><svg-icon icon-class="wrong" /></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.credit>=144&&row.punish!==0&&row.relearn<4&&row.average>=70&&row.consideration===''" size="mini" type="success" @click="handleModifyStatus(row,'1')">
            审议通过
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList(0)" />

  </div>
</template>

<script>
/* eslint-disable */

  import { fetchList, fetchPv , fetchResultList } from '@/api/graduation_audit'
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
          student_id: undefined,
          type: undefined,
          credit:undefined,
          average:undefined,
          relearn:undefined,
          punish:undefined,
          sort: '+id'
        },
        calendarTypeOptions,
        sortOptions: [{ label: '按序号顺序', key: '+id' }, { label: '按序号逆序', key: '-id' }],
        showReviewer: false,
        temp: {
          id: undefined,
          student_id: '',
          type: '',
        },
        dialogPvVisible: false,
        pvData: [],
        downloadLoading: false
      }
    },
    created() {
      this.getList(0)
    },
    methods: {
      getList(num) {
        this.listLoading = true
        if(num===0){
          fetchList(this.listQuery).then(response => {
            this.list = response.data.items
            this.total = response.data.total
            // Just to simulate the time of the request
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          })
        }
        else{
          fetchResultList(this.listQuery).then(response => {
            this.list = response.data.items
            this.total = response.data.total
            // Just to simulate the time of the request
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          })
        }


      },
      filterData() {
        this.listQuery.student_id=undefined
        this.listQuery.type=undefined
        this.listQuery.page = 1
        this.getList(1)
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList(0)
      },
      handleModifyStatus(row, status) {
        row.consideration=status
        this.$message({
          message: '操作成功',
          type: 'success'
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
          id: undefined,
          student_id: undefined,
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
