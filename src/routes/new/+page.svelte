<script lang="ts">
	import MonacoEditor from '$lib/components/custom-ui/monaco-editor/monaco-editor.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { Switch } from '$lib/components/ui/switch';
	import { Clock, Copy, Flame, Loader2, Shield } from 'lucide-svelte';
	import { encrypt } from '$lib/util/encryption';
	import { toast } from 'svelte-sonner';

	const MAX_CHARS = 2000000; // 2MB limit
	let content = $state('');
	let expiration = $state('7d'); // Default to 7 days
	let burnOnView = $state(false);
	let useQuantum = $state(false);
	let generatedUrl = $state('');
	let generatedBurnUrl = $state('');
	let isLoading = $state(false);

	const expirationOptions = [
		{ value: '1h', label: '1 Hour' },
		{ value: '1d', label: '1 Day' },
		{ value: '7d', label: '1 Week' },
		{ value: '30d', label: '30 Days' },
		{ value: '', label: 'Never' }
	];

	const expirationTrigger = $derived(
		expirationOptions.find((option) => option.value === expiration)?.label ?? 'Select Expiration'
	);
	async function handleSubmit() {
		if (isLoading) return;
		isLoading = true;

		try {
			const initResponse = await fetch('/api/paste/init', {
				method: 'POST'
			});

			const { pasteId, burnToken } = await initResponse.json();
			// Encrypt the content with burnOnView flag
			const { encrypted, decryptionKey } = await encrypt(
				content,
				burnOnView ? burnToken : undefined,
				useQuantum
			);

			// Send to server
			const response = await fetch('/api/paste', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: pasteId,
					encrypted,
					expiration,
					burnToken
				})
			});

			const { url } = await response.json();

			// Generate the full URL with the decryption key in the fragment
			generatedUrl = `${window.location.origin}${url}#${decryptionKey}`;
			generatedBurnUrl = `${window.location.origin}${url}/delete#${burnToken}`;

			toast.success('Paste created successfully!');
		} catch (error) {
			console.error('Failed to create paste:', error);
			toast.error('Failed to create paste. Please try again.');
		} finally {
			isLoading = false;
		}
	}

	// Add a function to handle copying
	async function copyUrl(content: string) {
		if (content) {
			try {
				await navigator.clipboard.writeText(content);
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
										<Select.Item value={option.value} label={option.label}
											>{option.label}</Select.Item
										>
									{/each}
								</Select.Content>
							</Select.Root>
							{#if expiration === ''}
								<div class="mt-1 text-xs text-amber-500 dark:text-amber-400">
									⚠️ Warning: Setting no expiration means the paste will be stored indefinitely unless:
									<ul class="list-disc pl-4 mt-1">
										<li>You manually delete it using the deletion URL</li>
										<li>It's accessed with burn-after-reading enabled</li>
									</ul>
									Consider setting an expiration time as a safety measure.
								</div>
							{/if}
						</div>

						<div>
							<label class="mb-1.5 flex items-center gap-2 text-sm font-medium">
								<Shield class="h-4 w-4" />
								Quantum Resistance
							</label>
							<div class="flex items-center space-x-2">
								<Switch bind:checked={useQuantum} />
								<span class="text-sm text-muted-foreground"
									>Enable quantum-resistant encryption</span
								>
							</div>
							<p class="mt-1 text-xs text-muted-foreground">
								Adds an extra layer of quantum-resistant encryption. Provides additional security
								but results in longer URLs (up to ~4.5k characters).
							</p>
						</div>

						<div>
							<label class="mb-1.5 flex items-center gap-2 text-sm font-medium">
								<Flame class="h-4 w-4" />
								Burn after reading
							</label>
							<div class="flex items-center space-x-2">
								<Switch bind:checked={burnOnView} />
								<span class="text-sm text-muted-foreground">Delete after first successful decryption</span>
							</div>
							<p class="mt-1 text-xs text-muted-foreground">
								Note: The paste is deleted only when someone successfully decrypts and reads the content. 
								Simply viewing the encrypted data without the correct decryption key won't trigger deletion. 
								While this provides an additional security layer, it's still enforced client-side and should 
								be treated as a convenience feature rather than a security guarantee.
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

						<!-- Decryption URL Box -->
						<div class="space-y-3 rounded-lg border bg-primary/5 p-3">
							<div class="flex items-center gap-2">
								<input
									type="text"
									readonly
									class="h-10 flex-1 rounded-md border bg-background/50 px-3"
									placeholder="Paste URL will appear here"
									value={generatedUrl}
								/>
								<Button
									variant="outline"
									class="aspect-square h-10 w-10 min-w-[2.5rem] p-0"
									title="Copy URL"
									onclick={() => copyUrl(generatedUrl)}
								>
									<Copy class="h-4 w-4" />
								</Button>
							</div>
							<div class="space-y-2">
								<p class="text-sm text-muted-foreground">
									🔐 <strong>Decryption URL</strong> - Share this with people who need to view the content:
								</p>
								<ul class="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
									<li>Contains the decryption key needed to view the content</li>
									<li>Share securely - anyone with this URL can access the paste</li>
									<li>Store safely if you need to access the content later</li>
									<li class="text-amber-500 dark:text-amber-400">
										If you lose this URL, the content will be lost forever.
									</li>
								</ul>
							</div>
						</div>

						<!-- Burn URL Box -->
						<div class="space-y-3 rounded-lg border bg-destructive/5 p-3">
							<div class="flex items-center gap-2">
								<input
									type="text"
									readonly
									class="h-10 flex-1 rounded-md border bg-background/50 px-3"
									placeholder="Burn URL will appear here"
									value={generatedBurnUrl}
								/>
								<Button
									variant="outline"
									class="aspect-square h-10 w-10 min-w-[2.5rem] p-0"
									title="Copy URL"
									onclick={() => copyUrl(generatedBurnUrl)}
								>
									<Copy class="h-4 w-4" />
								</Button>
							</div>
							<div class="space-y-2">
								<p class="text-sm text-muted-foreground">
									🔥 <strong>Deletion URL</strong> - Keep this private:
								</p>
								<ul class="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
									<li>Allows permanent deletion of the paste</li>
									<li>Keep this URL private and secure</li>
									<li>Cannot be recovered if lost</li>
									{#if !expiration}
										<li class="text-amber-500 dark:text-amber-400">
											Since no expiration is set, this URL {burnOnView ? 'and the burn-after-reading feature' : ''} is the only way to delete the paste.
										</li>
									{/if}
								</ul>
							</div>
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
