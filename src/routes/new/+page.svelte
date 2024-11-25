<script lang="ts">
	import MonacoEditor from '$lib/components/custom-ui/monaco-editor/monaco-editor.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { Switch } from '$lib/components/ui/switch';
	import { Clock, Copy, Flame, Loader2 } from 'lucide-svelte';
	import { encrypt } from '$lib/util/encryption';
	import { toast } from 'svelte-sonner';

	const MAX_CHARS = 2000000; // 2MB limit
	let content = $state('');
	let expiration = $state('7d'); // Default to 7 days
	let burnOnView = $state(false);
	let generatedUrl = $state('');
	let isLoading = $state(false);

	const expirationOptions = [
		{ value: '1h', label: '1 Hour' },
		{ value: '1d', label: '1 Day' },
		{ value: '7d', label: '1 Week' },
		{ value: '30d', label: '30 Days' },
		{ value: '', label: 'Never' }
	];

	const expirationTrigger = $derived(expirationOptions.find(option => option.value === expiration)?.label ?? 'Select Expiration');
	async function handleSubmit() {
		if (isLoading) return;
		isLoading = true;

		try {
			// Encrypt the content with burnOnView flag
			const { encrypted, decryptionKey, pasteId } = await encrypt(content, burnOnView);

			// Send to server
			const response = await fetch('/api/paste', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: pasteId,
					encrypted,
					expiration
				})
			});

			const { url } = await response.json();

			// Generate the full URL with the decryption key in the fragment
			generatedUrl = `${window.location.origin}${url}#${decryptionKey}`;

			toast.success('Paste created successfully!');
		} catch (error) {
			console.error('Failed to create paste:', error);
			toast.error('Failed to create paste. Please try again.');
		} finally {
			isLoading = false;
		}
	}

	// Add a function to handle copying
	async function copyUrl() {
		if (generatedUrl) {
			try {
				await navigator.clipboard.writeText(generatedUrl);
				toast.success('URL copied to clipboard!');
			} catch (error) {
				toast.error('Failed to copy URL');
			}
		}
	}

	const charsRemaining = $derived(MAX_CHARS - content.length);
	const remainingSize = $derived(() => {
		const bytes = charsRemaining;
		if (bytes >= 1000000) {
			return `${(bytes / 1000000).toFixed(1)} MB`;
		}
		return `${(bytes / 1000).toFixed(1)} KB`;
	});
	const isValid = $derived(content.length > 0 && content.length <= MAX_CHARS);
</script>

<div class="space-y-8 px-6">
	<div class="max-w-4xl space-y-2">
		<h1 class="text-3xl font-bold tracking-tighter">Create New Paste</h1>
		<p class="text-muted-foreground">
			All pastes are encrypted end-to-end. Only people with the link can access your content.
		</p>
	</div>

	<form
		class="space-y-6"
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
	>
		<!-- Code Editor -->
		<div class="space-y-2">
			<div class="relative h-[600px]">
				<MonacoEditor bind:value={content} />
			</div>
			<p class="text-right text-sm text-muted-foreground">
				{remainingSize()} remaining
			</p>
		</div>

		<!-- Settings and Action Buttons -->
		<div class="mx-auto max-w-4xl space-y-4">
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Security Settings Box -->
				<div class="rounded-lg border bg-muted/50 p-4">
					<h3 class="mb-4 font-medium">Security Settings</h3>
					<div class="space-y-4">
						<div>
							<label class="mb-1.5 flex items-center gap-2 text-sm font-medium">
								<Clock class="h-4 w-4" />
								Expiration
							</label>
							<Select.Root type="single" bind:value={expiration}>
								<Select.Trigger class="w-full">
									{expirationTrigger}
								</Select.Trigger>
								<Select.Content>
									{#each expirationOptions as option}
										<Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>

						<div>
							<label class="mb-1.5 flex items-center gap-2 text-sm font-medium">
								<Flame class="h-4 w-4" />
								Burn after reading
							</label>
							<div class="flex items-center space-x-2">
								<Switch bind:checked={burnOnView} />
								<span class="text-sm text-muted-foreground">Delete after first view</span>
							</div>
							<p class="mt-1 text-xs text-muted-foreground">
								Note: Burn after reading is enforced by the viewing client. A modified or malicious
								client could choose not to delete the content after viewing.
							</p>
						</div>
					</div>
				</div>

				<!-- Action Box -->
				<div class="rounded-lg border bg-muted/50 p-4">
					<h3 class="mb-4 font-medium">Create & Share</h3>
					<div class="space-y-4">
						<Button type="submit" disabled={!isValid || isLoading} class="w-full">
							{#if isLoading}
								<Loader2 class="mr-2 h-4 w-4 animate-spin" />
								Creating...
							{:else}
								Create Encrypted Paste
							{/if}
						</Button>

						<div class="flex items-center gap-2">
							<input
								type="text"
								readonly
								class="h-10 flex-1 rounded-md border bg-muted px-3"
								placeholder="Paste URL will appear here"
								value={generatedUrl || ''}
							/>
							<Button variant="outline" class="h-10 w-10 p-0" title="Copy URL" onclick={copyUrl}>
								<Copy class="h-4 w-4" />
							</Button>
						</div>
						{#if !isValid && content.length > MAX_CHARS}
							<p class="text-sm text-destructive">
								Content exceeds maximum length of {MAX_CHARS.toLocaleString()} characters
							</p>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</form>
</div>
