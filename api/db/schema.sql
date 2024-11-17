CREATE TABLE projects (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE packages (
  id INTEGER PRIMARY KEY,
  projectId INTEGER NOT NULL,
  name TEXT NOT NULL,
  FOREIGN KEY(projectId) REFERENCES projects(id)
);

CREATE TABLE components (
    id INTEGER PRIMARY KEY,
    packageId INTEGER NOT NULL,
    name TEXT NOT NULL,
    amount NUMBER,
    FOREIGN KEY(packageId) REFERENCES packages(id)
);