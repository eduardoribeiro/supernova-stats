CREATE TABLE projects (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO projects (name)
VALUES ('ICN'),
       ('SI'),
       ('Annuitties'),
       ('GDM');

CREATE TABLE packages (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO packages (name)
VALUES ('Supernova'),
       ('RCL'),
       ('Shared'),
       ('React Bootstrap');

CREATE TABLE packagesInProjects (
  id INTEGER PRIMARY KEY,
  packageId INTEGER NOT NULL,
  projectId INTEGER NOT NULL,
  FOREIGN KEY(packageId) REFERENCES packages(id),
  FOREIGN KEY(projectId) REFERENCES projects(id)
);

CREATE TABLE components (
  id INTEGER PRIMARY KEY,
  packageId INTEGER NOT NULL,
  projectId INTEGER NOT NULL,
  name TEXT NOT NULL,
  amount NUMBER NOT NULL,
  date CURRENT_DATE NOT NULL,
  FOREIGN KEY(packageId) REFERENCES packages(id),
  FOREIGN KEY(projectId) REFERENCES projects(id)
);

CREATE TABLE usage (
  id INTEGER PRIMARY KEY,
  componentId INTEGER NOT NULL,
  projectId INTEGER NOT NULL,
  file TEXT NOT NULL,
  propsSpread INTEGER NOT NULL,
  moduleName TEXT NOT NULL,
  importedType TEXT NOT NULL,
  props BLOB,
  FOREIGN KEY(componentId) REFERENCES components(id),
  FOREIGN KEY(projectId) REFERENCES packages(id)
);