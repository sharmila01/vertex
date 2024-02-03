// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  endPoints: {
    getNews: 'https://cryptopanic.com/api/posts/?auth_token=cb270510acdb861ae260d6f5b9f4916b4742c934&public=true'
  }

};