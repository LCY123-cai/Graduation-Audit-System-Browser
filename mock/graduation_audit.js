import Mock from 'mockjs'

const List = []
const count = 30

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    name: '@cname',
    reviewer: '@cname',
    student_id: '@integer(1841920101,1841920399)',
    'type|1': ['A', 'B', 'C'],
    credit: '@integer(143, 154)',
    average: '@integer(69, 95)',
    relearn: '@integer(0, 4)',
    punish: '@integer(0, 1)',
    consideration: '',
    platforms: ['a-platform']
  }))
}

export default [
  {
    url: '/review/audit/list',
    type: 'get',
    response: config => {
      const { type, student_id, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (type && item.type !== type) return false
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
    url: '/review/audit/result',
    type: 'get',
    response: config => {
      const { type, student_id, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (type && item.type !== type) return false
        if (student_id && (item.student_id.toString()).indexOf(student_id) < 0) return false
        if (item.credit >= 144 && item.average >= 70 && item.relearn < 4 && item.punish === 0) return false
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
    url: '/review/audit/detail',
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
    url: '/review/audit/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/review/audit/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/review/audit/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
