<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import { ExternalLink } from 'lucide-svelte';
</script>

<div class="max-w-4xl mx-auto space-y-8 px-4">
	<div class="space-y-4">
		<h1 class="text-4xl font-bold tracking-tighter">Frequently Asked Questions</h1>
		<p class="text-lg text-muted-foreground">
			Common questions about EnigmaBin's security, features, and policies
		</p>
	</div>

	<!-- Getting Started Section -->
	<div class="space-y-4">
		<h2 class="text-2xl font-semibold">Getting Started</h2>
		<Accordion.Root type="multiple" class="w-full">
			<Accordion.Item value="why-enigmabin">
				<Accordion.Trigger>Why should I use EnigmaBin?</Accordion.Trigger>
				<Accordion.Content>
					<div class="space-y-2 text-muted-foreground">
						<p>
							EnigmaBin stands out by offering true end-to-end encryption with flexible security options:
						</p>
						<ul class="list-disc pl-6 space-y-1">
							<li>Your content is encrypted in your browser before being sent to our servers</li>
							<li>Choose between fast classical encryption or enhanced quantum-resistant protection</li>
							<li>We never have access to your unencrypted data</li>
							<li>No account required, just paste and share</li>
							<li>Optional burn-after-reading feature</li>
							<li>Automatic paste expiration</li>
							<li>Secure deletion URLs for manual removal</li>
						</ul>
					</div>
				</Accordion.Content>
			</Accordion.Item>

			<Accordion.Item value="urls">
				<Accordion.Trigger>How do the URLs work?</Accordion.Trigger>
				<Accordion.Content>
					<div class="space-y-2 text-muted-foreground">
						<p>When you create a paste, you'll receive two types of URLs:</p>
						<ul class="list-disc pl-6 space-y-2">
							<li>
								<strong>Decryption URL</strong>: Contains the decryption key in the URL fragment (after the #).
								This key never reaches our servers and is required to view the content.
							</li>
							<li>
								<strong>Deletion URL</strong>: Contains a secure burn token that allows you to permanently
								delete the paste from our servers. Keep this URL private.
							</li>
						</ul>
					</div>
				</Accordion.Content>
			</Accordion.Item>

			<Accordion.Item value="limits">
				<Accordion.Trigger>Are there any limitations?</Accordion.Trigger>
				<Accordion.Content>
					<div class="space-y-2 text-muted-foreground">
						<ul class="list-disc pl-6 space-y-1">
							<li>Maximum paste size: 2MB</li>
							<li>
								Quantum-resistant mode generates URLs up to ~4.5k characters (classical mode URLs are much
								shorter)
							</li>
							<li>
								Burn-after-reading is enforced client-side and should not be relied upon for critical
								security
							</li>
						</ul>
					</div>
				</Accordion.Content>
			</Accordion.Item>
            <Accordion.Item value="contact">
                <Accordion.Trigger>How can I contact you?</Accordion.Trigger>
                <Accordion.Content>
                    <div class="space-y-2 text-muted-foreground">
                        <p>
                            For general inquiries and security concerns, you can reach us at <a href="mailto:enigmabin@reizouko.eu" class="text-primary hover:underline">contact@yourdomain.com</a>
                        </p>
                        <p>For bug reports, feature requests, and code-related discussions, please use our 
                            <a
                                href="https://github.com/giorgiobrux/enigmabin/issues"
                                class="text-primary hover:underline inline-flex items-center gap-1"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                GitHub Issues
                                <ExternalLink class="h-3 w-3" />
                            </a>
                            page.
                        </p>
                    </div>
                </Accordion.Content>
            </Accordion.Item>
		</Accordion.Root>
	</div>

	<!-- Security & Privacy Section -->
	<div class="space-y-4">
		<h2 class="text-2xl font-semibold">Security & Privacy</h2>
		<Accordion.Root type="multiple" class="w-full">
			<Accordion.Item value="encryption">
				<Accordion.Trigger>How does the encryption work?</Accordion.Trigger>
				<Accordion.Content>
					<div class="space-y-2 text-muted-foreground">
						<p>EnigmaBin offers two encryption modes:</p>
						<ul class="list-disc pl-6 space-y-2">
							<li>
								<strong>Classical Mode (Default)</strong>: Uses X25519 for key exchange and
								ChaCha20-Poly1305 for symmetric encryption. Generates shorter URLs and is suitable for most
								use cases.
							</li>
							<li>
								<strong>Quantum-Resistant Mode</strong>: Adds ML-KEM-1024 encryption on top of the
								classical layer. This provides protection against future quantum computers but results in
								longer URLs (~4.5k characters).
							</li>
						</ul>
						<p>
							All encryption operations happen in your browser - we only store the already-encrypted data.
						</p>
					</div>
				</Accordion.Content>
			</Accordion.Item>

			<Accordion.Item value="data-retention">
				<Accordion.Trigger>What data do you collect?</Accordion.Trigger>
				<Accordion.Content>
					<div class="space-y-2 text-muted-foreground">
						<p>We maintain a strict minimal data collection policy:</p>
						<ul class="list-disc pl-6 space-y-1">
							<li>We only store the encrypted content and its expiration time</li>
							<li>No IP addresses or user metadata is collected</li>
							<li>No cookies are used except for essential site functionality</li>
							<li>Basic anonymous analytics through Vercel Analytics</li>
							<li>All pastes are automatically deleted after their expiration period</li>
						</ul>
					</div>
				</Accordion.Content>
			</Accordion.Item>

			<Accordion.Item value="trust">
				<Accordion.Trigger>Why should I trust EnigmaBin?</Accordion.Trigger>
				<Accordion.Content>
					<div class="space-y-2 text-muted-foreground">
						<p>We believe in complete transparency and verifiable security:</p>
						<ul class="list-disc pl-6 space-y-1">
							<li>
								Our entire codebase is open source and available on
								<a
									href="https://github.com/giorgiobrux/enigmabin"
									class="text-primary hover:underline inline-flex items-center gap-1"
									target="_blank"
									rel="noopener noreferrer"
								>
									GitHub
									<ExternalLink class="h-3 w-3" />
								</a>
							</li>
							<li>All encryption happens client-side using well-vetted libraries</li>
							<li>You can inspect the code and verify the security measures yourself</li>
							<li>
								Self-hosting is supported - check out the
								<a
									href="https://kit.svelte.dev/docs/adapters"
									class="text-primary hover:underline inline-flex items-center gap-1"
									target="_blank"
									rel="noopener noreferrer"
								>
									SvelteKit adapters
									<ExternalLink class="h-3 w-3" />
								</a>
								for deployment options
							</li>
						</ul>
					</div>
				</Accordion.Content>
			</Accordion.Item>

			<Accordion.Item value="burn-after-reading">
				<Accordion.Trigger>How does burn-after-reading work?</Accordion.Trigger>
				<Accordion.Content>
					<div class="space-y-2 text-muted-foreground">
						<p>Burn-after-reading automatically deletes a paste after its first view:</p>
						<ul class="list-disc pl-6 space-y-1">
							<li>Once viewed, the paste is immediately and permanently deleted</li>
							<li>The same URL cannot be used to view the content again</li>
							<li>Ideal for sharing sensitive information that should only be viewed once</li>
						</ul>
						<p class="mt-2">Important security note:</p>
						<ul class="list-disc pl-6 space-y-1">
							<li>This feature is enforced client-side and shouldn't be relied upon for critical security</li>
							<li>The recipient should save any needed information before closing the page</li>
							<li>For sensitive content, combine with shorter expiration times</li>
						</ul>
					</div>
				</Accordion.Content>
			</Accordion.Item>

			<Accordion.Item value="quantum-choice">
				<Accordion.Trigger>Should I use quantum-resistant encryption?</Accordion.Trigger>
				<Accordion.Content>
					<div class="space-y-2 text-muted-foreground">
						<p>The choice depends on your security needs:</p>
						<ul class="list-disc pl-6 space-y-2">
							<li>
								<strong>Classical Mode (Default)</strong>:
								<ul class="list-disc pl-6 mt-1">
									<li>Perfect for most everyday use</li>
									<li>Shorter, more manageable URLs</li>
									<li>Strong security against current threats</li>
								</ul>
							</li>
							<li>
								<strong>Quantum-Resistant Mode</strong>:
								<ul class="list-disc pl-6 mt-1">
									<li>Protection against future quantum computers</li>
									<li>Longer URLs (~4.5k characters)</li>
									<li>Best for highly sensitive or long-term data</li>
								</ul>
							</li>
						</ul>
					</div>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</div>

	<!-- Features & Usage Section -->
	<div class="space-y-4">
		<h2 class="text-2xl font-semibold">Features & Usage</h2>
		<Accordion.Root type="multiple" class="w-full">
			<Accordion.Item value="delete-paste">
				<Accordion.Trigger>Can I delete a paste I created?</Accordion.Trigger>
				<Accordion.Content>
					<div class="space-y-2 text-muted-foreground">
						<p>
							Yes! When you create a paste, you'll receive two URLs:
						</p>
						<ul class="list-disc pl-6 space-y-1">
							<li>A decryption URL to view and share the content</li>
							<li>A deletion URL that allows you to permanently remove the paste</li>
						</ul>
						<p class="mt-2">Additional security measures include:</p>
						<ul class="list-disc pl-6 space-y-1">
							<li>All pastes automatically expire based on your chosen duration</li>
							<li>Without the decryption key (contained in the URL), the data remains unreadable</li>
							<li>For sensitive content, consider using the burn-after-reading feature</li>
						</ul>
					</div>
				</Accordion.Content>
			</Accordion.Item>

			<Accordion.Item value="lost-urls">
				<Accordion.Trigger>What if I lose my URLs?</Accordion.Trigger>
				<Accordion.Content>
					<div class="space-y-2 text-muted-foreground">
						<p>Due to our zero-knowledge architecture, we cannot help recover lost URLs:</p>
						<ul class="list-disc pl-6 space-y-2">
							<li>
								<strong>Lost Content URL</strong>: Since the decryption key is only stored in the URL fragment and never reaches our servers, we cannot decrypt or recover your content. This is a fundamental security feature of our end-to-end encryption.
							</li>
							<li>
								<strong>Lost Deletion URL</strong>: For security reasons, we cannot verify paste ownership without the deletion URL. This prevents unauthorized deletion attempts and ensures only those with the correct deletion URL can remove content.
							</li>
						</ul>
						<p class="mt-2">Important to understand:</p>
						<ul class="list-disc pl-6 space-y-2">
							<li>
								If you lose the content URL, we <strong>cannot</strong> help you decrypt or recover your content - it's permanently inaccessible. This isn't a limitation, but a core security feature that ensures only those with the decryption key can access the data.
							</li>
							<li>
								If you lose the deletion URL, we <strong>cannot</strong> verify your ownership or help delete the paste. This strict policy prevents unauthorized deletion attempts and maintains the security of our zero-knowledge system.
							</li>
						</ul>
						<p class="mt-2">What you can do:</p>
						<ul class="list-disc pl-6 space-y-2">
							<li>
								<strong>Lost deletion URL but want to make content inaccessible?</strong> Simply delete or don't share the decryption URL. Without the decryption key, the data remains permanently encrypted and unreadable, even if it's still stored on our servers.
							</li>
							<li>
								<strong>Lost content URL?</strong> If you need the content, you'll need to create a new paste. There is no way to recover or bypass the encryption - this is an intentional security feature.
							</li>
							<li>
								<strong>Prevention tips:</strong>
								<ul class="list-disc pl-6 mt-1 space-y-1">
									<li>Save both URLs securely if you'll need them later</li>
									<li>Set appropriate expiration times as a fallback</li>
									<li>For sensitive content, use shorter expiration times or burn-after-reading</li>
									<li>Consider storing URLs in a password manager</li>
								</ul>
							</li>
						</ul>
						<p class="mt-2">Remember: All pastes will automatically expire after their set duration, providing a natural cleanup mechanism regardless of URL availability.</p>
					</div>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</div>

	<!-- Visual separator between sections -->
	<style>
		h2 {
			padding-top: 1rem;
			border-top: 1px solid hsl(var(--border));
		}
		/* Remove top border from first section */
		h2:first-of-type {
			border-top: none;
			padding-top: 0;
		}
	</style>
</div>