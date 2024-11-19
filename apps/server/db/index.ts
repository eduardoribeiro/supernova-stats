// import { Database } from 'sqlite3';
import sqlite from 'sqlite3'

const db = new sqlite.Database('./db/stats.db', sqlite.OPEN_READWRITE, err => {
  if (err) {
    console.error(err.message)
  }
  console.log('Connected to the statistics database.')
})

export default db
