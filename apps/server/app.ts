import express from 'express'
import cors from 'cors'
import { projects, packages } from './routes'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (_req: unknown, reply: { send: (arg0: string) => void }) => {
  reply.send('Supernova Stats ~~')
})

app.get('/packages', async function (_req, res) {
  const allPackages = await packages.getPackages()
  res.send(allPackages)
})

app.get('/package/:id', async function (req, res) {
  const id = Number(req.params.id)
  const singlePackage = await packages.getPackageById(id)
  res.send(singlePackage)
})

app.post('/package', async function (req, res) {
  const name = req.body.name
  await packages.addPackage(name)
  res.send({ message: 'Success' })
})

app.put('/package/:id', async function (req, res) {
  const id = Number(req.params.id)
  const name = req.body.name
  await packages.editPackage(id, name)
  res.send({ message: 'Success' })
})

app.delete('/package/:id', async function (req, res) {
  const id = Number(req.params.id)
  await packages.deletePackage(id)
  res.send({ message: 'Success' })
})

app.get('/projects', async function (_req, res) {
  const allProjects = await projects.getProjects()
  res.send(allProjects)
})

app.get('/project/:id', async function (req, res) {
  const id = Number(req.params.id)
  const singleProject = await projects.getProjectById(id)
  res.send(singleProject)
})

app.post('/project', async function (req, res) {
  const name = req.body.name
  await projects.addProject(name)
  res.send({ message: 'Success' })
})

app.put('/project/:id', async function (req, res) {
  const id = Number(req.params.id)
  const name = req.body.name
  await projects.editProject(id, name)
  res.send({ message: 'Success' })
})

app.delete('/project/:id', async function (req, res) {
  const id = Number(req.params.id)
  await projects.deleteProject(id)
  res.send({ message: 'Success' })
})

export default app