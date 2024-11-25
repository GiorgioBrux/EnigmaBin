<script lang="ts">
	import '../app.css';
	import { cn } from '$lib/utils';
	let { children } = $props();
	import { Toaster } from "$lib/components/ui/sonner/index.js";

</script>

<div class="relative min-h-screen flex flex-col">
	<div class="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 py-2 text-center text-sm">
		🚧 Development Preview: Features and data are not final and may be reset at any time
	</div>
	<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
		<div class="container flex h-14 items-center">
			<a href="/" class="flex items-center space-x-2">
				<span class="font-bold text-xl">EnigmaBin</span>
			</a>
			<div class="flex flex-1 items-center justify-end space-x-4">
				<nav class="flex items-center space-x-4">
					<a 
						href="/about"
						class={cn(
							"text-sm font-medium transition-colors hover:text-primary",
							"text-muted-foreground"
						)}
					>
						About
					</a>
					<a 
						href="/new"
						class={cn(
							"text-sm font-medium transition-colors hover:text-primary",
							"text-muted-foreground"
						)}
					>
						New Paste
					</a>
				</nav>
			</div>
		</div>
	</header>

	<Toaster />

	<main class="flex-1 container py-6">
		{@render children()}
	</main>

	<footer class="border-t py-6 md:py-0">
		<div class="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
			<p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
				Built with privacy in mind. All pastes are encrypted end-to-end.
			</p>
			<p class="text-center text-sm text-muted-foreground md:text-left">
				<a 
					href="https://github.com/giorgiobrux/enigmabin" 
					target="_blank"
					rel="noreferrer"
					class="font-medium underline underline-offset-4"
				>
					GitHub
				</a>
			</p>
		</div>
	</footer>
</div>