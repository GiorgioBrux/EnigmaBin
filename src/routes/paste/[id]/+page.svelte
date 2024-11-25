<script lang="ts">
    import { onMount } from 'svelte';
    import MonacoEditor from "$lib/components/custom-ui/monaco-editor/monaco-editor.svelte";
    import { decrypt } from '$lib/util/decryption';
    import type { PageData } from './$types';
    import { Button } from "$lib/components/ui/button";
    import { Copy } from 'lucide-svelte';
	import type { EncryptedData } from '$lib/util/encryption';
	import { toast } from "svelte-sonner";

    export let data: PageData;

    let decryptedContent: { content: string; burnOnView: boolean } | null = null;
    let error: string | null = null;
    let loading = true;

    async function copyContent() {
        if (decryptedContent) {
            await navigator.clipboard.writeText(decryptedContent.content);
            toast.success('Content copied to clipboard!');
        }
    }

    async function decryptPaste(decryptionKey: string) {
        if(!data.id) {
            return;
        }

        try {
            decryptedContent = await decrypt(
                data.id,
                data.encrypted as unknown as EncryptedData,
                decryptionKey
            );
            error = null;
        } catch (e) {
            error = 'Failed to decrypt paste. The decryption key might be invalid.';
            console.error(e);
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        if (!data.encrypted) {
            error = 'Paste not found';
            loading = false;
            return;
        }

        const key = window.location.hash.slice(1);
        if (!key) {
            error = 'No decryption key provided. The URL might be incomplete.';
            loading = false;
            return;
        }
        decryptPaste(key);
    });
</script>


<div class="px-6 space-y-8">

    {#if loading || !decryptedContent}
    <div class="max-w-4xl">
        <h1 class="text-3xl font-bold tracking-tighter">Encrypted Paste</h1>
        </div>
    {/if}

    {#if loading}
        <div class="flex items-center justify-center h-[600px] border rounded-md bg-muted/50">
            <div class="text-muted-foreground">Decrypting paste...</div>
        </div>
    {:else if error}
        <div class="flex flex-col items-center justify-center h-[600px] border rounded-md bg-destructive/10 text-destructive space-y-2">
            <p class="font-medium">⚠️ {error}</p>
            {#if error.includes('decryption key')}
                <p class="text-sm">Make sure you're using the complete URL including the part after the #</p>
            {/if}
            {#if error === 'Paste not found'}
                <p class="text-sm">The paste you're looking for doesn't exist or has been deleted</p>
            {/if}
        </div>
    {:else if decryptedContent}
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <div class="max-w-4xl">
                    <h1 class="text-3xl font-bold tracking-tighter">Encrypted Paste</h1>
                </div>
                <Button variant="outline" size="sm" onclick={copyContent}>
                    <Copy class="h-4 w-4 mr-2" />
                    Copy Content
                </Button>
            </div>
            
            <div class="relative h-[600px]">
                <MonacoEditor 
                    value={decryptedContent.content} 
                    readOnly={true}
                />
            </div>

            <div class="flex justify-between items-start">
                <div class="text-muted-foreground flex flex-col gap-1">
                    {#if data.createdAt}
                        <p>Created {new Date(data.createdAt).toLocaleString()}</p>
                    {/if}
                    {#if data.expiresAt}
                        <p>Expires {new Date(data.expiresAt).toLocaleString()}</p>
                    {/if}
                </div>

                {#if decryptedContent.burnOnView}
                    <div class="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm flex items-center gap-2">
                        <span>🔥</span>
                        <div>
                            <p class="font-medium">For your eyes only</p>
                            <p class="text-destructive/80">This paste will be permanently deleted after viewing</p>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>