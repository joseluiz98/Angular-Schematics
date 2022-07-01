import {
  Rule,
  SchematicsException,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { applyToUpdateRecorder } from '@schematics/angular/utility/change';

import * as ts from 'typescript';

// Just return the tree
export function ngAdd(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Iniciando execução do schematics...');
    context.logger.info(`Seu nome é: ${options.name}`);

    if (!!options.includeOnAppModule) {
      context.logger.info('Adicionando ao AppModule');
      const modulePath = '/src/app/app.module.ts';
      if (!tree.exists(modulePath)) {
        throw new SchematicsException('Module not found');
      }

      const recorder = tree.beginUpdate(modulePath);
      const text = tree.read(modulePath);

      if (!text) {
        throw new SchematicsException('Module not found');
      }

      const source = ts.createSourceFile(
        modulePath,
        text.toString(),
        ts.ScriptTarget.Latest,
        true
      );

      applyToUpdateRecorder(
        recorder,
        addImportToModule(source, modulePath, 'MyLibModule', 'my-lib')
      );

      tree.commitUpdate(recorder);
      context.logger.info('Finalizei a importação no AppModule');
    }
    context.addTask(new NodePackageInstallTask());
    return tree;
  };
}
