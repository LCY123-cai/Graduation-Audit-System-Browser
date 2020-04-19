<template>
  <div class="app-container">
    <div style="padding-bottom: 10px">
      <el-input v-model="listQuery.studentId" placeholder="学号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
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
      @sort-change="sortChange"
    >
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.voteId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.studentId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所获荣誉或突出表现" align="center" min-width="150px">
        <template slot-scope="{row}">
          <el-link type="primary" @click="handleFetchHonour(row.studentId,1,100)">点击查看详情</el-link>
        </template>
      </el-table-column>
      <el-table-column label="同意人数" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.agree">{{ row.agree }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="否决人数" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.disagree">{{ row.disagree }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="参与人数" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.participant">{{ row.participant }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="投票结果" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.voting_results==='1'" style="color: #E6A23C">审核中</span>
          <span v-else-if="row.voting_results==='2'" style="color: #67C23A">通过</span>
          <span v-else-if="row.voting_results==='-1'" style="color: #F56C6C">未通过</span>
        </template>
      </el-table-column>
      <el-table-column label="发起时间" align="center" width="170">
        <template slot-scope="{row}">
          <span v-if="row.publish_time">{{ row.publish_time }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="结束时间" align="center" class-name="status-col" width="170">-->
<!--        <template slot-scope="{row}">-->
<!--          <span v-if="row.deadline">{{ row.deadline }}</span>-->
<!--          <span v-else>0</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <span v-if="row.voting_results=='1'">
            <el-button type="success" size="mini" @click="handleUpdate(row,1)">
              同意
            </el-button>
            <el-button size="mini" type="danger" @click="handleUpdate(row,2)">
              否决
            </el-button>
          </span>
          <span style="color: #909399">该投票已结束</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogHonourVisible" title="所获荣誉或突出表现">
      <el-table :data="honourData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="honour" label="所获荣誉获突出表现" />
        <el-table-column prop="obtain_time" label="达成日期" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogHonourVisible = false">确定</el-button>
      </span>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
/* eslint-disable */

  import { fetchList, updateVote } from '@/api/vote'
  import { fetchList as fetchHonour } from '@/api/honour'
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
          sort: '+id'
        },
        sortOptions: [{ label: '按序号顺序', key: '+id' }, { label: '按序号逆序', key: '-id' }],
        temp: {
        },
        dialogHonourVisible: false,
        honourData: [],
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
        }
      },
      //处理投票
      handleUpdate(row,num) {
        updateVote({
          voteId:row.voteId,
          username:this.username,
          num:num
        }).then((response) => {
          const index = this.list.findIndex(v => v.voteId === row.voteId)
          //判断是同意还是拒绝
          if(num===1){
            row.agree=row.agree+1
          }
          else{
            row.disagree=row.disagree+1
          }
          //判断参与人员是否全都已投票
          if(row.agree+row.disagree==row.participant){
            //超过半数人员同意则通过
              if(row.agree/row.participant>0.5){
                row.voting_results='2'
              }
              //否则不通过
              else{
                row.voting_results='-1'
              }
          }
          //更新表格数据
          this.list.splice(index, 1, row)
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
        })
      },
      getSortClass: function(key) {
        const sort = this.listQuery.sort
        return sort === `+${key}` ? 'ascending' : 'descending'
      },
      handleFetchHonour(studentId,page,limit) {
        //获取该学生所获的荣誉或突出表现
        fetchHonour({
          studentId,
          page,
          limit
        }).then(response => {
          this.honourData = response.items[0]
          this.dialogHonourVisible = true
        })
      }
    }
  }
</script>
