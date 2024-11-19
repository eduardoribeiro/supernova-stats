# React Scanner Config scripts

## How to use it
1. Copy the script `generator.js` to your project inside of a folder called `reports`;
2. Then using you terminal, execute the following command:
   ```
   npx react-scanner -c reports/generator.js --from <sourceDir> --package <packageName>
   ```

### `<sourceDir>`
Should be the path, relative to `reports` package, where the source code lives (usually a `src` folder), for instance, if you create the `reports` folder in the root of ICN project then the `<sourceDir>` should be `../icn_react/src`

### `<packageName>`
The `packageName` is a set of predifined packages and the options are the following:
- `rcl` - for the `@icapitalnetwork/react-component-library`
- `shared` - for components being used from `shared` folder inside ICN Project
- `bootstrap` - for components being imported from `react-bootstrap`
- `supernova`- for components being imported from `@icapitalnetwork/supernova-*`
