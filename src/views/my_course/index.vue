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
      @sort-change="sortChange"
    >
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号" min-width="100px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.student_id }}</span>
          <el-tag>{{ row.classname | typeFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.name" class="link-type">{{ row.name }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="学年" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.academic_year" class="link-type">{{ row.academic_year }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="学期" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.term" class="link-type">{{ row.term }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名称" align="center" width="160">
        <template slot-scope="{row}">
          <span v-if="row.course_name" class="link-type">{{ row.course_name }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="学分" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.credit" class="link-type">{{ row.credit }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="成绩" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.score" class="link-type">{{ row.score }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="补考成绩" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.makeup" class="link-type">{{ row.makeup }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="重学成绩" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.relearn" class="link-type">{{ row.relearn }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width">
        <template>
          <el-button size="mini" type="success">
            学分替代申请
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
/* eslint-disable */

  import { fetchList, createScore } from '@/api/my_course'
  import waves from '@/directive/waves/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import { parseTime } from '@/utils'
  import {mapGetters} from 'vuex'

  const calendarTypeOptions = [
    { key: 'A', display_name: '计科18A' },
    { key: 'B', display_name: '计科18B' },
    { key: 'C', display_name: '计科18C' }
  ]
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
        update_time:'',
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          sort: '+id'
        },
        temp: {
          id:undefined,
          student_id: '',
        },
        sortOptions: [{ label: '按序号顺序', key: '+id' }, { label: '按序号逆序', key: '-id' }],
        calendarTypeOptions,
        textMap: {
          update: 'Update'
        },
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
        this.listQuery.username=this.username
        console.log(this.listQuery)
        fetchList(this.listQuery).then(response => {
          this.list = response.items
          this.total = response.total
          this.update_time = response.update_time
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
      getSortClass: function(key) {
        const sort = this.listQuery.sort
        return sort === `+${key}` ? 'ascending' : 'descending'
      }
    }
  }
</script>
