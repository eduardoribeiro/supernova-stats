import db from '../db'
import { GenericObject, UsageDetails } from '../types';
import components from './components';
import packages from './packages';
import projects from './projects'

async function updateStats(packageName: string, projectName: string, data: GenericObject<number>) {
  const projectId = await projects.getProjectByName(projectName);
  const packageId = await packages.getPackageByName(packageName);
  const date = new Date();
  return new Promise<void>((resolve, reject) => {
    Object.keys(data).forEach(component => {
        db.run('INSERT INTO components (packageId, projectId, name, amount, date) VALUES (?, ?, ?, ?, ?)', packageId, projectId, component, data[component], date, (err: Error | null) => {
            if (err) reject(err)
            else resolve()
        })
        
    });
  })
}

async function updateUsage(projectName: string, data: UsageDetails) {
  const projectId = await projects.getProjectByName(projectName);
  const componentsUsage = Object.keys(data);
  return new Promise<void>((resolve, reject) => {
    componentsUsage.forEach(component => {
        data[component].instances.forEach(async (details) => {
            const file = details.location.file;
            const propsSpread = details.propsSpread;
            const moduleName = details.importInfo.moduleName;
            const importedType = details.importInfo.importType;
            const props = details.props;
            const componentId = await components.getComponentByName(details.importInfo.imported)
            db.run('INSERT INTO usage (componentId, projectId, file, propsSpread, moduleName, importedType, props) VALUES (?, ?, ?, ? , ?, ?, ?)', [componentId, projectId, file, propsSpread, moduleName, importedType, props], (err: Error | null) => {
                if (err) reject(err)
                else resolve()
            })
        })
        
    })
  })
}

export default {
    updateStats,
    updateUsage,
}