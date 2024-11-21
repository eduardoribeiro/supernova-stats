import db from '../db'

function getProjects() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM projects', (err: Error | null, rows: unknown) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

function getProjectById(id: number) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM projects where id=(?)', id, (err: Error | null, rows: unknown) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

function getProjectByName(projectName: string) {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM projects where name=(?)',
      projectName,
      (err: Error | null, rows: unknown) => {
        if (err) reject(err)
        else resolve(rows)
      },
    )
  })
}

function addProject(name: string) {
  return new Promise<void>((resolve, reject) => {
    db.run('INSERT INTO projects (name) VALUES (?, ?)', name, (err: Error | null) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

function editProject(id: number, name: string) {
  return new Promise<void>((resolve, reject) => {
    db.run('UPDATE projects SET name = (?) where id = (?)', [name, id], (err: Error | null) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

function deleteProject(id: number) {
  return new Promise<void>((resolve, reject) => {
    db.run('DELETE FROM projects WHERE id = (?)', id, (err: Error | null) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export default {
  getProjects,
  getProjectById,
  getProjectByName,
  addProject,
  editProject,
  deleteProject,
}
