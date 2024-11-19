import db from '../db'

function getPackages() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM packages', (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

function getPackagesByProjectId(id: number) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM packages where projectId=(?)', id, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

function getPackageById(id: number) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM packages where id=(?)', id, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

function addPackage(name: string) {
  return new Promise<void>((resolve, reject) => {
    db.run('INSERT INTO packages (name) VALUES (?, ?)', name, err => {
      if (err) reject(err)
      else resolve()
    })
  })
}

function editPackage(id: number, name: string) {
  return new Promise<void>((resolve, reject) => {
    db.run('UPDATE packages SET name = (?) where id = (?)', [name, id], err => {
      if (err) reject(err)
      else resolve()
    })
  })
}

function deletePackage(id: number) {
  return new Promise<void>((resolve, reject) => {
    db.run('DELETE FROM packages WHERE id = (?)', id, err => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export default {
  getPackages,
  getPackageById,
  getPackagesByProjectId,
  addPackage,
  editPackage,
  deletePackage,
}
