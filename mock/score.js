import Mock from 'mockjs'

const List = []
const count = 1

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    student_id: '1841920300',
    'classname|1': ['A', 'B', 'C'],
    name: '@cname',
    academic_year: '2019-2020',
    term: '2',
    course_id: '5100713',
    course_name: '操作系统',
    credit: '3',
    score: '90',
    makeup: '',
    relearn: ''
  }))
}

export default [
  {
    url: '/review/score/list',
    type: 'get',
    response: config => {
      const { classname ,student_id, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (classname && item.classname !== classname) return false
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
          items: pageList,
          update_time: '@datetime'
        }
      }
    }
  },

  {
    url: '/review/score/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const score of List) {
        if (score.id === +id) {
          return {
            code: 20000,
            data: score
          }
        }
      }
    }
  },

  {
    url: '/review/score/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
