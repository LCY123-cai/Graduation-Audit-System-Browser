<template>
  <div class="app-container">
    <div style="padding-bottom: 10px">
      <el-input v-model="listQuery.student_id" placeholder="学号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.classname" placeholder="班级" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="syncData">
        从教务系统同步数据
      </el-button>
      最近一次同步:<i class="el-icon-time" />
      <span>{{ update_time }}</span>
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
      <el-table-column label="课程代码" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.course_id" class="link-type">{{ row.course_id }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名称" align="center" width="100">
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
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
/* eslint-disable */

  import { fetchList, createScore } from '@/api/score'
  import waves from '@/directive/waves/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import { parseTime } from '@/utils'

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
          student_id: undefined,
          classname: undefined,
          sort: '+id'
        },
        temp: {
          id:undefined,
          student_id: '1841920200',
          classname: 'B',
          name: '测试',
          academic_year: '2019-2020',
          term: '2',
          course_id: '5100713',
          course_name: '操作系统',
          credit: '3',
          score: '90',
          makeup: '',
          relearn: ''
        },
        sortOptions: [{ label: '按序号顺序', key: '+id' }, { label: '按序号逆序', key: '-id' }],
        calendarTypeOptions,
        textMap: {
          update: 'Update'
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
          this.list = response.data.items
          this.total = response.data.total
          this.update_time = response.data.update_time
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
      syncData() {
            this.listLoading = true
            setTimeout(() => {
              this.listLoading = false
            }, 0.8 * 1000)
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            this.update_time = parseTime(new Date())
            createScore(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.$notify({
                title: 'Success',
                message: '数据同步成功',
                type: 'success',
                duration: 2000
              })
            })
      },
      getSortClass: function(key) {
        const sort = this.listQuery.sort
        return sort === `+${key}` ? 'ascending' : 'descending'
      }
    }
  }
</script>
