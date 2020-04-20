<template>
  <div class="app-container">
    <div style="padding-bottom: 10px">
      <el-input v-model="listQuery.username" placeholder="账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加用户
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
      <el-table-column label="账号" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" align="center" min-width="170px">
        <template slot-scope="{row}">
          <span>{{ row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.roles }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="dialogStatus==='create'?'创建':'更新'" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="账号" prop="username">
          <el-input v-model="temp.username" :disabled="dialogStatus!=='create'" style="width: 150px"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" style="width: 170px"/>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-radio-group v-model="temp.roles">
            <el-radio label="admin" />
            <el-radio label="auditor" />
            <el-radio label="student" />
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /* eslint-disable */

  import { fetchList, createUser, updateUser ,deleteUser} from '@/api/user'
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
          username:undefined,
        },
        temp: {
        },
        dialogFormVisible: false,
        dialogStatus: '',
        rules: {
          username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
          password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
          roles: [{ required: true, message: '角色不能为空', change: 'blur' }]
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
          //若该用户存在
          if(response.items[0]!=null){
            if (response.items[0].length>1){
              this.list = response.items[0]
              this.total = response.items[0].length
            }else if (response.items.length===1){
              this.list = response.items
              this.total = response.items.length
            }
          }
          else {
            this.list=null
            this.total=0
          }
          // 模拟请求的时间
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
          id: undefined,
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createUser(this.temp).then((response) => {
              this.temp.password=this.$md5(this.temp.password);
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
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
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // const tempData = Object.assign({}, this.temp)
            updateUser(this.temp).then((response) => {
              const index = this.list.findIndex(v => v.username === this.temp.username)
              this.temp.password=this.$md5(this.temp.password)
              this.list.splice(index, 1, this.temp)
              this.dialogFormVisible = false
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
          }
        })
      },
      handleDelete(row, index) {
        deleteUser(row).then((response) => {
          if (response.code===200){
            this.$notify({
              title: '删除成功',
              message: response.message,
              type: 'success',
              duration: 2000
            })
          }
          else{
            this.$notify({
              title: '删除失败',
              message: response.message,
              type: 'error',
              duration: 2000
            })
          }
          this.list.splice(index, 1)
        })
      }
    }
  }
</script>
