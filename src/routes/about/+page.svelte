<script lang="ts">
	import { Shield, Lock, Key, Server, Code2, Cpu } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
</script>

<div class="max-w-4xl mx-auto space-y-12">
	<!-- Hero Section -->
	<div class="space-y-4">
		<h1 class="text-4xl font-bold tracking-tighter">About EnigmaBin</h1>
		<p class="text-lg text-muted-foreground">
			EnigmaBin is a secure, privacy-focused pastebin service built with flexible end-to-end encryption options.
			We believe code sharing shouldn't compromise security or usability.
		</p>
	</div>

	<!-- How it Works -->
	<div class="space-y-6">
		<h2 class="text-2xl font-bold tracking-tighter">How It Works</h2>
		<div class="grid gap-6 md:grid-cols-2">
			<Card.Root class="hover:shadow-lg transition-shadow duration-200 pb-4">
				<Card.Header>
					<Card.Title>1. Client-Side Encryption</Card.Title>
					<Card.Description>
						Your content is encrypted in your browser using either fast classical encryption (X25519) or enhanced 
						dual-layer protection that adds ML-KEM for quantum resistance.
					</Card.Description>
				</Card.Header>
			</Card.Root>

			<Card.Root class="hover:shadow-lg transition-shadow duration-200 pb-4">
				<Card.Header>
					<Card.Title>2. Secure Storage</Card.Title>
					<Card.Description>
						We store only encrypted data and temporary burn tokens. Even with direct database access, your
						content remains protected by your chosen encryption method.
					</Card.Description>
				</Card.Header>
			</Card.Root>

			<Card.Root class="hover:shadow-lg transition-shadow duration-200 pb-4">
				<Card.Header>
					<Card.Title>3. Secure Sharing</Card.Title>
					<Card.Description>
						Share links contain the decryption keys in the URL fragment. Classical mode generates shorter URLs,
						while quantum mode adds extra protection with longer URLs (about ~4k characters).
					</Card.Description>
				</Card.Header>
			</Card.Root>

			<Card.Root class="hover:shadow-lg transition-shadow duration-200 pb-4">
				<Card.Header>
					<Card.Title>4. Automatic Expiration</Card.Title>
					<Card.Description>
						Pastes automatically expire after your chosen duration, with secure deletion from our database.
					</Card.Description>
				</Card.Header>
			</Card.Root>
		</div>
	</div>

	<!-- Technical Stack -->
	<div class="space-y-6">
		<h2 class="text-2xl font-bold tracking-tighter">Technical Stack</h2>
		<div class="grid gap-6 sm:grid-cols-2">
			<div class="flex gap-4">
				<Shield class="h-6 w-6 text-primary flex-shrink-0" />
				<div>
					<h3 class="font-semibold">Flexible Encryption</h3>
					<p class="text-sm text-muted-foreground">
						Choose between fast X25519 classical encryption or enhanced security with both X25519 and ML-KEM-1024 working together.
					</p>
				</div>
			</div>

			<div class="flex gap-4">
				<Lock class="h-6 w-6 text-primary flex-shrink-0" />
				<div>
					<h3 class="font-semibold">Authenticated Encryption</h3>
					<p class="text-sm text-muted-foreground">
						ChaCha20-Poly1305 AEAD using libsodium provides fast, secure symmetric encryption for your content.
					</p>
				</div>
			</div>

			<div class="flex gap-4">
				<Code2 class="h-6 w-6 text-primary flex-shrink-0" />
				<div>
					<h3 class="font-semibold">Modern Tech Stack</h3>
					<p class="text-sm text-muted-foreground">
						Built with SvelteKit, TypeScript, and Prisma for type-safe, full-stack development.
					</p>
				</div>
			</div>

			<div class="flex gap-4">
				<Cpu class="h-6 w-6 text-primary flex-shrink-0" />
				<div>
					<h3 class="font-semibold">Editor Integration</h3>
					<p class="text-sm text-muted-foreground">
						Monaco Editor (VS Code's editor) with support for many popular programming languages.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Security Features -->
	<div class="space-y-6">
		<h2 class="text-2xl font-bold tracking-tighter">Security Features</h2>
		<div class="grid gap-6 sm:grid-cols-2">
			<div class="flex gap-4">
				<Key class="h-6 w-6 text-primary flex-shrink-0" />
				<div>
					<h3 class="font-semibold">Secure Key Management</h3>
					<p class="text-sm text-muted-foreground">
						Decryption keys are transmitted via URL fragments, never touching our servers. Choose between shorter
						classical keys or enhanced quantum-resistant keys.
					</p>
				</div>
			</div>

			<div class="flex gap-4">
				<Server class="h-6 w-6 text-primary flex-shrink-0" />
				<div>
					<h3 class="font-semibold">No Logs Policy</h3>
					<p class="text-sm text-muted-foreground">
						Zero logs of paste content, IP addresses, or user activity. We use Vercel Analytics for minimal metrics.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Privacy Commitment -->
	<div class="space-y-4 border-t pt-8">
		<h2 class="text-2xl font-bold tracking-tighter">Our Privacy Commitment</h2>
		<p class="text-muted-foreground">
			EnigmaBin was built with privacy as its foundation. By default, we use fast and secure classical encryption (X25519). 
			For enhanced security, you can enable our dual-layer encryption that combines both ML-KEM and X25519, protecting against 
			both current and future quantum threats. This flexibility lets you choose the right balance of security and usability 
			for your needs. Our zero-knowledge architecture means we never have access to your unencrypted data.
		</p>
	</div>
</div>