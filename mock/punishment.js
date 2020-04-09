import Mock from 'mockjs'

const List = []
const count = 1

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    student_id: '1841920300',
    name: '@cname',
    'punishment|1': ['警告', '严重警告', '记过', '留校察看', '开除学籍'],
    reason: '省略',
    update_time: '@datetime'
  }))
}

export default [
  {
    url: '/review/punishment/list',
    type: 'get',
    response: config => {
      const { title, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (title && (item.title.toString()).indexOf(title) < 0) return false
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
    url: '/review/punishment/detail',
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
    url: '/review/punishment/create',
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
  //   url: '/review/punishment/update',
  //   type: 'post',
  //   response: _ => {
  //     return {
  //       code: 20000,
  //       data: 'success'
  //     }
  //   }
  // }
]
