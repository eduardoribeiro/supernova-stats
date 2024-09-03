const counter = (file: {[key: string]: number;}) => Object.values(file).reduce((acc, value) => acc + value, 0);

export default counter;