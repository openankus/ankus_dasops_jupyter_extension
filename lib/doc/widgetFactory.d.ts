import { ABCWidgetFactory, DocumentRegistry } from '@jupyterlab/docregistry';
import { Contents } from '@jupyterlab/services';
import { AnkusDocModel } from './docModel';
import { AnkusDocWidget } from '../component/ankusCodeEditor';
export declare class AnkusWidgetFactory extends ABCWidgetFactory<AnkusDocWidget, AnkusDocModel> {
    constructor(options: DocumentRegistry.IWidgetFactoryOptions);
    protected createNewWidget(context: DocumentRegistry.IContext<AnkusDocModel>): AnkusDocWidget;
}
export declare class AnkusDocModelFactory implements DocumentRegistry.IModelFactory<AnkusDocModel> {
    /**
     * The name of the model.
     *
     * @returns The name
     */
    get name(): string;
    /**
     * The content type of the file.
     *
     * @returns The content type
     */
    get contentType(): Contents.ContentType;
    /**
     * The format of the file.
     *
     * @returns the file format
     */
    get fileFormat(): Contents.FileFormat;
    /**
     * Get whether the model factory has been disposed.
     *
     * @returns disposed status
     */
    get isDisposed(): boolean;
    /**
     * Dispose the model factory.
     */
    dispose(): void;
    /**
     * Get the preferred language given the path on the file.
     *
     * @param path path of the file represented by this document model
     * @returns The preferred language
     */
    preferredLanguage(path: string): string;
    /**
     * Create a new instance of ExampleDocModel.
     *
     * @param languagePreference Language
     * @param modelDB Model database
     * @returns The model
     */
    createNew(modelOpt?: DocumentRegistry.IModelOptions): AnkusDocModel;
    private _disposed;
}
