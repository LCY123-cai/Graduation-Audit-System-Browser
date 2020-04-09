import Mock from 'mockjs'

const List = []
const count = 1

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    year: '2018',
    major: '计算机科学与技术',
    system: '2',
    credit: '@integer(140, 150)',
    average: '@integer(60, 70)',
    relearn: '@integer(3, 6)',
    punishment: '0',
    update_time: '@datetime'
  }))
}

export default [
  {
    url: '/review/requirement/list',
    type: 'get',
    response: config => {
      const { year, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (year && (item.year.toString()).indexOf(year) < 0) return false
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
    url: '/review/requirement/detail',
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
    url: '/review/requirement/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/review/requirement/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
