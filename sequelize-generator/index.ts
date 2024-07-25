import * as Inquirer from 'inquirer';
import * as SyncModel from './sync-model';
import * as AutoGenerateCrud from './auto-generate-crud';
import * as Chalk from 'chalk';

enum Options {
  SYNC_MODELS_FROM_DB = 'sync models from database',
  AUTO_GENERATE_CRUD_FOR_MODEL = 'auto generate crud for model',
}
(async () => {
  const options = [
    Options.SYNC_MODELS_FROM_DB,
    Options.AUTO_GENERATE_CRUD_FOR_MODEL,
  ];
  const { option } = await Inquirer.prompt({
    name: 'option',
    type: 'list',
    choices: options,
    message: 'Please choose a option',
  });
  if (option === Options.SYNC_MODELS_FROM_DB) {
    await SyncModel.run();
  } else if (option === Options.AUTO_GENERATE_CRUD_FOR_MODEL) {
    await AutoGenerateCrud.run();
  } else {
    console.log(Chalk.red('Unkown option!!!'));
  }
})();
