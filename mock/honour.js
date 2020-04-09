import Mock from 'mockjs'

const List = []
const count = 1

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    student_id: '1841920300',
    'classroom|1': ['计科18A', '计科18B', '计科18C'],
    name: '@cname',
    honour: '考取研究生(收到正式录取通知书)',
    obtain_time: '@datetime',
    update_time: '@datetime'
  }))
}

export default [
  {
    url: '/review/honour/list',
    type: 'get',
    response: config => {
      const { student_id, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (student_id && (item.student_id.toString()).indexOf(student_id) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/review/honour/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/review/honour/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
  //
  // {
  //   url: '/review/honour/update',
  //   type: 'post',
  //   response: _ => {
  //     return {
  //       code: 20000,
  //       data: 'success'
  //     }
  //   }
  // }
]
