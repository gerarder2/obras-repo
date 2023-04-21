// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  hmr: false,
  STATIC: {
    avatar: ''
  },
  appLogo: 'assets/img/app-logo.png',
  haveMenu: false,
  idFoliage: 3,
  version: '1.0.0',
  ambiente: 'develop',
  configFile: 'assets/settings.json',
  webApi: 'http://74.208.25.33:86/api'
};
