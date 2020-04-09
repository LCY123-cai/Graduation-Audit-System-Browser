<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="年级">
        <el-select v-model="form.region" placeholder="请选择年级">
          <el-option label="2018级" value="2018a" />
          <el-option label="2018级-专升本" value="2018b" />
        </el-select>
      </el-form-item>
      <el-form-item label="学分">
        <el-col :span="2">
          <el-input v-model="form.name" />
        </el-col>
      </el-form-item>
      <el-form-item label="加权平均成绩">
        <el-col :span="2">
          <el-input v-model="form.name"/>
        </el-col>
      </el-form-item>
      <el-form-item label="重学次数">
        <el-col :span="2">
          <el-input v-model="form.name"/>
        </el-col>
      </el-form-item>
      <el-form-item label="行政处分">
        <el-radio-group v-model="form.resource">
          <el-radio label="可以有" />
          <el-radio label="必须无" />
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('已提交!')
    },
    onCancel() {
      this.$message({
        message: '已取消!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

