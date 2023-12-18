import { ABCWidgetFactory, DocumentRegistry } from '@jupyterlab/docregistry';
import { Contents } from '@jupyterlab/services';
//ver4//import { IModelDB } from '@jupyterlab/observables';

import { AnkusDocModel } from './docModel';
import { AnkusDocWidget, AnkusCodeEditor } from '../component/ankusCodeEditor';

export class AnkusWidgetFactory extends ABCWidgetFactory<
  AnkusDocWidget,
  AnkusDocModel
> {
  constructor(options: DocumentRegistry.IWidgetFactoryOptions) {
    super(options);
  }

  protected createNewWidget(
    context: DocumentRegistry.IContext<AnkusDocModel>
  ): AnkusDocWidget {
    return new AnkusDocWidget({
      context,
      content: new AnkusCodeEditor(context.model)
    });
  }
}

export class AnkusDocModelFactory
  implements DocumentRegistry.IModelFactory<AnkusDocModel>
{
  /**
   * The name of the model.
   *
   * @returns The name
   */
  get name(): string {
    return 'ankus-model';
  }

  /**
   * The content type of the file.
   *
   * @returns The content type
   */
  get contentType(): Contents.ContentType {
    return 'file';
  }

  /**
   * The format of the file.
   *
   * @returns the file format
   */
  get fileFormat(): Contents.FileFormat {
    return 'text';
  }

  /**
   * Get whether the model factory has been disposed.
   *
   * @returns disposed status
   */
  get isDisposed(): boolean {
    return this._disposed;
  }

  /**
   * Dispose the model factory.
   */
  dispose(): void {
    this._disposed = true;
  }

  /**
   * Get the preferred language given the path on the file.
   *
   * @param path path of the file represented by this document model
   * @returns The preferred language
   */
  preferredLanguage(path: string): string {
    return '';
  }

  /**
   * Create a new instance of ExampleDocModel.
   *
   * @param languagePreference Language
   * @param modelDB Model database
   * @returns The model
   */

  //ver4//createNew(languagePreference?: string, modelDB?: IModelDB): AnkusDocModel {
  createNew(modelOpt?: DocumentRegistry.IModelOptions): AnkusDocModel {
    return new AnkusDocModel();
  }

  private _disposed = false;
}
