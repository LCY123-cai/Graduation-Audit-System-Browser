import Mock from 'mockjs'

const List = []
const count = 1

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    student_id: '1841920300',
    name: '@cname',
    'classroom|1': ['计科18A', '计科18B', '计科18C'],
    college: '理工',
    original_course: '原课程',
    oc_credit: '1',
    replace_course: '替代课程',
    rc_credit: '2',
    report_time: '@datetime'
  }))
}

export default [
  {
    url: '/review/replacement/report/list',
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
    url: '/review/replacement/report/detail',
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
    url: '/review/replacement/report/create',
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
  //   url: '/review/replacement/report/update',
  //   type: 'post',
  //   response: _ => {
  //     return {
  //       code: 20000,
  //       data: 'success'
  //     }
  //   }
  // }
]
