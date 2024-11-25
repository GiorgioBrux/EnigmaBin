<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import * as monaco from 'monaco-editor';
    import { cn } from "$lib/utils.js";
    
    // We only need the editor worker for basic functionality
    import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

    let {
        value = $bindable(''),
        language = $bindable('javascript'),
        class: className = '',
        theme = $bindable<'vs' | 'vs-dark' | 'hc-black'>('vs-dark'),
        readOnly = false,
        automaticLayout = true,
    } = $props();

    let editorElement: HTMLElement;
    let editor: monaco.editor.IStandaloneCodeEditor;

    onMount(() => {
        // Simple worker setup for basic functionality
        self.MonacoEnvironment = {
            getWorker: function () {
                return new editorWorker();
            }
        };

        editor = monaco.editor.create(editorElement, {
            value,
            language,
            theme,
            automaticLayout,
            readOnly,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            roundedSelection: true,
            padding: { top: 8, bottom: 8 },
        });

        editor.onDidChangeModelContent(() => {
            const newValue = editor.getValue();
            if (newValue !== value) {
                value = newValue;
            }
        });
    });

    onDestroy(() => {
        monaco?.editor.getModels().forEach((model) => model.dispose());
        editor?.dispose();
    });

    $effect(() => {
        if (editor) {
            if (editor.getValue() !== value) {
                editor.setValue(value);
            }
            // Update language when it changes
            const model = editor.getModel();
            if (model && model.getLanguageId() !== language) {
                monaco.editor.setModelLanguage(model, language);
            }
        }
    });
</script>

<div
    bind:this={editorElement}
    class={cn(
        "h-full w-full rounded-md border",
        className
    )}
>
</div>