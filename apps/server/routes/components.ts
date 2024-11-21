import db from '../db'
function getComponentByName(componentName: string) {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM components where name=(?)',
      componentName,
      (err: Error | null, rows: unknown) => {
        if (err) reject(err)
        else resolve(rows)
      },
    )
  })
}

export default {
  getComponentByName,
}
