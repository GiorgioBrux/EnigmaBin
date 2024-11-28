<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Loader2, Shield, Trash2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let isDeleted = $state(false);

	// Get the burn token from the URL fragment
	const burnToken = window.location.hash.slice(1);

	async function handleDelete() {
		if (isLoading || !burnToken) return;
		isLoading = true;
		error = null;

		try {
			const response = await fetch('/api/paste/delete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: $page.params.id,
					burnToken
				})
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message || 'Failed to delete paste');
			}

			isDeleted = true;
			toast.success('Paste deleted successfully');
		} catch (e: any) {
			console.error('Failed to delete paste:', e);
			error = e.message || 'Failed to delete paste';
			if (error) toast.error(error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="space-y-8 px-6">
	<div class="max-w-4xl space-y-2">
		<h1 class="text-3xl font-bold tracking-tighter">Delete Paste</h1>
		<p class="text-muted-foreground">
			This action will permanently delete the paste and cannot be undone.
		</p>
	</div>

	<div class="mx-auto max-w-4xl">
		<div class="rounded-lg border bg-muted/50 p-6 space-y-6">
			{#if !burnToken}
				<div class="flex flex-col items-center justify-center text-center space-y-4 py-4">
					<Shield class="h-12 w-12 text-muted-foreground" />
					<div class="space-y-2">
						<h3 class="text-lg font-semibold">Invalid Deletion URL</h3>
						<p class="text-sm text-muted-foreground max-w-md">
							This URL appears to be missing the burn token. Make sure you're using the complete deletion
							URL, including the part after the #
						</p>
					</div>
				</div>
			{:else if isDeleted}
				<div class="flex flex-col items-center justify-center text-center space-y-4 py-4">
					<div class="size-12 rounded-full bg-primary/10 flex items-center justify-center">
						<Trash2 class="h-6 w-6 text-primary" />
					</div>
					<div class="space-y-2">
						<h3 class="text-lg font-semibold">Paste Deleted</h3>
						<p class="text-sm text-muted-foreground">
							The paste has been permanently deleted from our servers.
						</p>
					</div>
				</div>
			{:else}
				<div class="space-y-4">
					<div class="space-y-2">
						<h3 class="font-medium">Confirm Deletion</h3>
						<p class="text-sm text-muted-foreground">
							You are about to delete paste <code class="text-primary">{$page.params.id}</code>. This
							action cannot be undone.
						</p>
					</div>

					{#if error}
						<div class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
							{error}
						</div>
					{/if}

					<div class="flex justify-end">
						<Button
							variant="destructive"
							disabled={isLoading}
							onclick={handleDelete}
							class="min-w-[100px]"
						>
							{#if isLoading}
								<Loader2 class="mr-2 h-4 w-4 animate-spin" />
								Deleting...
							{:else}
								Delete Paste
							{/if}
						</Button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>