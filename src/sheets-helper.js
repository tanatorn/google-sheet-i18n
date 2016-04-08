import Promise from 'bluebird'

export const getInfo = (doc) => new Promise((resolve, reject) => {
  doc.getInfo((err, info) => {
    if (info) {
      resolve(info)
    } else {
      reject(err)
    }
  })
})

export const getRows = (worksheet) => new Promise((resolve, reject) => {
  worksheet.getRows((err, rows) => {
    if (rows) {
      resolve(rows)
    } else {
      reject(err)
    }
  })
})
