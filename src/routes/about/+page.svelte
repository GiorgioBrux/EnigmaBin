<script lang="ts">
	import { Shield, Lock, Key, Server, Code2, Cpu } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
</script>

<div class="max-w-4xl mx-auto space-y-12">
	<!-- Hero Section -->
	<div class="space-y-4">
		<h1 class="text-4xl font-bold tracking-tighter">About EnigmaBin</h1>
		<p class="text-lg text-muted-foreground">
			EnigmaBin is a secure, privacy-focused pastebin service built with end-to-end encryption at its core.
			We believe code sharing shouldn't compromise security.
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
						Your content is encrypted in your browser using a hybrid system: ML-KEM (post-quantum) and X25519 
						(classical), both protecting the ChaCha20-Poly1305 encryption.
					</Card.Description>
				</Card.Header>
			</Card.Root>

			<Card.Root class="hover:shadow-lg transition-shadow duration-200 pb-4">
				<Card.Header>
					<Card.Title>2. Secure Storage</Card.Title>
					<Card.Description>
						We store only encrypted data and temporary burn tokens. Even with direct database access, your
						content remains protected.
					</Card.Description>
				</Card.Header>
			</Card.Root>

			<Card.Root class="hover:shadow-lg transition-shadow duration-200 pb-4">
				<Card.Header>
					<Card.Title>3. Secure Sharing</Card.Title>
					<Card.Description>
						Share links contain the ML-KEM decryption key in the URL fragment, which never reaches our
						servers.
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
					<h3 class="font-semibold">Hybrid Cryptography</h3>
					<p class="text-sm text-muted-foreground">
						ML-KEM-1024 (Kyber) for quantum resistance combined with X25519 for classical security.
					</p>
				</div>
			</div>

			<div class="flex gap-4">
				<Lock class="h-6 w-6 text-primary flex-shrink-0" />
				<div>
					<h3 class="font-semibold">Authenticated Encryption</h3>
					<p class="text-sm text-muted-foreground">
						ChaCha20-Poly1305 AEAD using libsodium for high-security symmetric encryption.
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
						Monaco Editor (VS Code's editor) with support for 100+ programming languages.
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
						Decryption keys are transmitted via URL fragments, never touching our servers.
					</p>
				</div>
			</div>

			<div class="flex gap-4">
				<Server class="h-6 w-6 text-primary flex-shrink-0" />
				<div>
					<h3 class="font-semibold">No Logs Policy</h3>
					<p class="text-sm text-muted-foreground">
						Zero logs of paste content, IP addresses, or user activity. Minimal metadata retention.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Privacy Commitment -->
	<div class="space-y-4 border-t pt-8">
		<h2 class="text-2xl font-bold tracking-tighter">Our Privacy Commitment</h2>
		<p class="text-muted-foreground">
			EnigmaBin was built with privacy as its foundation. We use a hybrid cryptographic system combining 
			post-quantum (ML-KEM) and classical (X25519) algorithms to ensure your data remains secure against 
			both quantum and classical attacks. Our zero-knowledge architecture means we never have access to 
			your unencrypted data.
		</p>
	</div>
</div>