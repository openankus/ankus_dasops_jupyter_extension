export declare namespace NotebookPlugin {
    type CellData = {
        cell_type: string;
        source: string;
    };
    function insertCompletionText(text: string, replace: boolean): void;
    function updateCodeWithCell(): void;
}
