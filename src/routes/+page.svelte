<script lang="ts">
	import { Shield, Lock, Code2, Zap } from 'lucide-svelte';
</script>


<div class="flex flex-col items-center justify-center space-y-12">
	<!-- Hero Section -->
	<div class="text-center space-y-4">
		<h1 class="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
			Share Code <span class="text-primary">Securely</span>
		</h1>
		<p class="max-w-[700px] text-lg text-muted-foreground">
			Zero-knowledge pastebin with flexible end-to-end encryption options.
		</p>
		<div class="flex gap-4 justify-center pt-4">
			<a
				href="/new"
				class="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1"
			>
				Create New Paste
			</a>
			<a
				href="/about"
				class="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1"
			>
				Learn More
			</a>
		</div>
	</div>

	<!-- Features Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl px-4">
		<div class="flex flex-col items-center text-center space-y-2 p-6 rounded-lg border bg-card">
			<Shield class="h-12 w-12 text-primary" />
			<h3 class="font-semibold">Flexible Security</h3>
			<p class="text-sm text-muted-foreground">Choose between fast classical or enhanced dual-layer encryption</p>
		</div>

		<div class="flex flex-col items-center text-center space-y-2 p-6 rounded-lg border bg-card">
			<Lock class="h-12 w-12 text-primary" />
			<h3 class="font-semibold">Zero Knowledge</h3>
			<p class="text-sm text-muted-foreground">We can't read your data, even if we wanted to</p>
		</div>

		<div class="flex flex-col items-center text-center space-y-2 p-6 rounded-lg border bg-card">
			<Code2 class="h-12 w-12 text-primary" />
			<h3 class="font-semibold">Syntax Highlighting</h3>
			<p class="text-sm text-muted-foreground">Support for many popular programming languages</p>
		</div>

		<div class="flex flex-col items-center text-center space-y-2 p-6 rounded-lg border bg-card">
			<Zap class="h-12 w-12 text-primary" />
			<h3 class="font-semibold">Fast & Simple</h3>
			<p class="text-sm text-muted-foreground">No account needed, just paste and share</p>
		</div>
	</div>

	<!-- Quick Stats: Updated with responsive classes -->
	<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 justify-center text-center max-w-[900px] px-4">
		<div class="space-y-1">
			<p class="text-2xl lg:text-3xl font-bold">X25519</p>
			<p class="text-xs lg:text-sm text-muted-foreground">Default Security</p>
		</div>
		
		<div class="space-y-1">
			<p class="text-2xl lg:text-3xl font-bold">ML-KEM</p>
			<p class="text-xs lg:text-sm text-muted-foreground">Optional Quantum Layer</p>
		</div>
		
		<div class="space-y-1">
			<p class="text-2xl lg:text-3xl font-bold">ChaCha20</p>
			<p class="text-xs lg:text-sm text-muted-foreground">Encryption</p>
		</div>
		
		<div class="space-y-1">
			<p class="text-2xl lg:text-3xl font-bold">Poly1305</p>
			<p class="text-xs lg:text-sm text-muted-foreground">Authentication</p>
		</div>
	</div>
</div>