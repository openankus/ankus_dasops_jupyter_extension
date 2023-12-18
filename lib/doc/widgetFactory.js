import { ABCWidgetFactory } from '@jupyterlab/docregistry';
//ver4//import { IModelDB } from '@jupyterlab/observables';
import { AnkusDocModel } from './docModel';
import { AnkusDocWidget, AnkusCodeEditor } from '../component/ankusCodeEditor';
export class AnkusWidgetFactory extends ABCWidgetFactory {
    constructor(options) {
        super(options);
    }
    createNewWidget(context) {
        return new AnkusDocWidget({
            context,
            content: new AnkusCodeEditor(context.model)
        });
    }
}
export class AnkusDocModelFactory {
    constructor() {
        this._disposed = false;
    }
    /**
     * The name of the model.
     *
     * @returns The name
     */
    get name() {
        return 'ankus-model';
    }
    /**
     * The content type of the file.
     *
     * @returns The content type
     */
    get contentType() {
        return 'file';
    }
    /**
     * The format of the file.
     *
     * @returns the file format
     */
    get fileFormat() {
        return 'text';
    }
    /**
     * Get whether the model factory has been disposed.
     *
     * @returns disposed status
     */
    get isDisposed() {
        return this._disposed;
    }
    /**
     * Dispose the model factory.
     */
    dispose() {
        this._disposed = true;
    }
    /**
     * Get the preferred language given the path on the file.
     *
     * @param path path of the file represented by this document model
     * @returns The preferred language
     */
    preferredLanguage(path) {
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
    createNew(modelOpt) {
        return new AnkusDocModel();
    }
}
//# sourceMappingURL=widgetFactory.js.map