import { ContentWrapper } from './Wrapper';
import type { ProjectProps, TabItem } from '../../shared/types';

export const CryptohiphopCard: React.FC<ProjectProps> = ({ isActive: _isActive = true }) => {
  // Define tabs for the crypto hip hop platform
  const tabs: TabItem[] = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-6 pt-8">
              <h1 className="heading-main mb-6">Crypto Hip Hop</h1>
              <p className="text-xl text-white opacity-100 leading-relaxed max-w-4xl mx-auto">
                My ambitious vision for a revolutionary NFT collection that would kickstart a fair
                music platform where blockchain meets beats, connecting artists, collectors, and
                fans in a decentralized ecosystem.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-glass p-8 space-y-4">
                <h3 className="heading-card text-lg mb-4 text-center">The Journey</h3>
                <div className="space-y-3 text-sm opacity-90 leading-relaxed">
                  <div
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: 'var(--brand-anthracite)' }}
                  >
                    <p>Started with an NFT collection idea to revolutionize music distribution</p>
                  </div>
                  <div
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: 'var(--brand-anthracite)' }}
                  >
                    <p>Quickly grew to a team of 9 passionate members</p>
                  </div>
                  <div
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: 'var(--brand-anthracite)' }}
                  >
                    <p>Attracted VC interest and investment opportunities</p>
                  </div>
                  <div
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: 'var(--brand-anthracite)' }}
                  >
                    <p>Built a Discord community of 1000+ members in just 2 weeks</p>
                  </div>
                  <div
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: 'var(--brand-anthracite)' }}
                  >
                    <p>Hired lawyers to ensure FMA compliance</p>
                  </div>
                </div>
              </div>

              <div className="card-glass p-8 space-y-4">
                <h3 className="heading-card text-lg mb-4 text-center">The Learning</h3>
                <div className="space-y-3 text-sm opacity-90 leading-relaxed">
                  <div
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: 'var(--brand-anthracite)' }}
                  >
                    <p>Decided to drop the project despite early success</p>
                  </div>
                  <div
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: 'var(--brand-anthracite)' }}
                  >
                    <p>Market timing wasn&apos;t right for the vision</p>
                  </div>
                  <div
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: 'var(--brand-anthracite)' }}
                  >
                    <p>Team dynamics needed refinement</p>
                  </div>
                  <div
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: 'var(--brand-anthracite)' }}
                  >
                    <p>Pre-AI development era made tech complexity challenging</p>
                  </div>
                  <div
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: 'var(--brand-anthracite)' }}
                  >
                    <p>Learned invaluable lessons running a tech startup</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-anthracite p-8 space-y-4 text-center">
              <h3 className="heading-card text-lg mb-4">Gratitude</h3>
              <p className="text-sm opacity-90 mb-4 leading-relaxed">
                Immensely grateful to everyone who joined this journey and contributed their passion
                and expertise.
              </p>
              <div className="text-sm opacity-75">
                <strong>Team Members:</strong> Ana, Kris, Noni, Corey, Luka, Jules, Rohan, Selim
              </div>
            </div>

            <div className="text-center mt-10 pb-8">
              <div className="inline-flex items-center space-x-3 px-6 py-3 border border-gray-600 rounded-lg">
                <span className="text-sm font-medium">
                  Startup Experience • Tech Leadership • Blockchain Innovation
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'whitepaper',
      title: 'Whitepaper',
      content: (
        <div className="h-full w-full p-12 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="heading-main text-2xl mb-6">Complete Whitepaper</h2>
              <p className="text-lg opacity-90 max-w-3xl mx-auto">
                The full technical and business documentation for the CryptoHipHop platform
              </p>
            </div>

            {/* Value Proposition */}
            <div className="card-glass p-10 space-y-8">
              <h3 className="heading-card text-xl mb-8">Value Proposition</h3>
              <div className="space-y-6 text-sm opacity-90 leading-relaxed">
                <p>
                  CryptoHipHop was designed as a fun means of fully decentralizing music
                  distribution, promotion, collection and incubation. The platform would act as a
                  distribution and finance bridge between music and art lovers and music artists,
                  ultimately making the middle-men obsolete.
                </p>
                <p>
                  Instead of production companies, stores, artist management profiting from fans and
                  artists, we planned to build a digital infrastructure for distribution and
                  promotion while making digital music items collectible through
                  &quot;tokenization&quot;.
                </p>
                <div
                  className="p-6 rounded-lg mt-6 text-center"
                  style={{ backgroundColor: 'var(--brand-anthracite)' }}
                >
                  <h4 className="font-semibold mb-3 text-base">CryptoRappers NFT Concept:</h4>
                  <p className="text-sm opacity-80 leading-relaxed">
                    Non-fungible tokens acting as membership cards to the CryptoHipHop space.
                    NFT-Subscriptions making holders eligible to receive limited hip hop artworks
                    through &quot;Artdrops&quot;.
                  </p>
                </div>
              </div>
            </div>

            {/* Problems & Solutions */}
            <div className="grid md:grid-cols-2 gap-10">
              <div className="card-glass p-8 space-y-6">
                <h3 className="heading-card text-lg mb-6">For Fans</h3>
                <div className="space-y-4 text-sm opacity-90">
                  <p>
                    <strong>First-time access</strong> to limited, cryptographically secure artworks
                    from artists in the Hip Hop space
                  </p>
                  <p>
                    <strong>Community rewards</strong> for being part of the ecosystem
                  </p>
                  <p>
                    <strong>Digital ownership</strong> of limited releases, similar to owning vinyl
                    but in the digital realm
                  </p>
                </div>
              </div>

              <div className="card-glass p-8 space-y-6">
                <h3 className="heading-card text-lg mb-6">For Artists</h3>
                <div className="space-y-4 text-sm opacity-90">
                  <p>
                    <strong>New distribution channel</strong> for gaining exposure and selling art
                  </p>
                  <p>
                    <strong>Innovative funding</strong> opportunities for music production
                  </p>
                  <p>
                    <strong>NFT market creation</strong> or extension of existing NFT presence
                  </p>
                </div>
              </div>
            </div>

            {/* System Architecture */}
            <div className="card-anthracite p-10 space-y-8">
              <h3 className="heading-card text-xl mb-8">System Architecture</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center space-y-4">
                  <div
                    className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--brand-anthracite)' }}
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-base">Ownership</h4>
                  <p className="text-sm opacity-80 leading-relaxed">
                    Tokenized hip hop artworks in partnership with established artists, making them
                    ownable on blockchains
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div
                    className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--brand-anthracite)' }}
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-base">Matchmaking</h4>
                  <p className="text-sm opacity-80 leading-relaxed">
                    Creating perfect matches between fans, collectors and artists through a
                    passionate community platform
                  </p>
                </div>
                <div className="text-center space-y-4">
                  <div
                    className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--brand-anthracite)' }}
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-base">Decentralization</h4>
                  <p className="text-sm opacity-80 leading-relaxed">
                    Transition from centralized launch to decentralized DAO governance once
                    marketplace is established
                  </p>
                </div>
              </div>
            </div>

            {/* CryptoRappers Details */}
            <div className="card-glass p-10 space-y-8">
              <h3 className="heading-card text-xl mb-8">CryptoRappers NFT Collection</h3>
              <div className="space-y-6 text-sm opacity-90 leading-relaxed">
                <p>
                  10,000 unique computer-generated artworks created by graphics artists and coded
                  with different rarities. Inspired by the original CryptoPunks concept but focused
                  on Hip Hop culture as a tribute to the pioneers of NFT pixel art series.
                </p>

                <div
                  className="p-6 rounded-lg text-center"
                  style={{ backgroundColor: 'var(--brand-anthracite)' }}
                >
                  <h4 className="font-semibold mb-4 text-base">Five Utility Features:</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <span className="text-gray-400 font-mono">1.</span>
                      <div>
                        <strong>Regular Artdrops:</strong> Distributed to every holder based on
                        collection size
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-400 font-mono">2.</span>
                      <div>
                        <strong>Random Artdrops:</strong> Raffle system, max 50 entries per holder
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-400 font-mono">3.</span>
                      <div>
                        <strong>Special Artdrops:</strong> Unique collaborations and special
                        releases
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-400 font-mono">4.</span>
                      <div>
                        <strong>VR Concert Tickets:</strong> Access to exclusive Virtual Reality Hip
                        Hop shows
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-400 font-mono">5.</span>
                      <div>
                        <strong>DAO Voting Rights:</strong> Future governance participation
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Airdrop Mechanics */}
            <div className="card-glass p-10 space-y-8">
              <h3 className="heading-card text-xl mb-8">Artdrop Mechanics</h3>
              <div className="space-y-8">
                <div
                  className="p-6 rounded-lg text-center"
                  style={{ backgroundColor: 'var(--brand-anthracite)' }}
                >
                  <h4 className="font-semibold mb-4 text-base">Claiming Process:</h4>
                  <p className="text-sm opacity-90 leading-relaxed">
                    Send CryptoRappers + small ADA amount to platform wallet → Receive back
                    CryptoRappers + Artdrops within minutes
                  </p>
                </div>

                <div
                  className="p-6 rounded-lg text-center"
                  style={{ backgroundColor: 'var(--brand-anthracite)' }}
                >
                  <h4 className="font-semibold mb-4 text-base">Revenue Distribution:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      <span>50% → Artist</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      <span>30% → DAO Treasury</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      <span>10% → Incubator Wallet</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      <span>10% → Team</span>
                    </div>
                  </div>
                </div>

                <div
                  className="p-6 rounded-lg text-center"
                  style={{ backgroundColor: 'var(--brand-anthracite)' }}
                >
                  <h4 className="font-semibold mb-4 text-base">Regular Artdrop Tiers:</h4>
                  <div className="space-y-2 text-sm font-mono">
                    <div className="flex justify-between">
                      <span>1-9 Rappers</span>
                      <span>1 Artdrop</span>
                    </div>
                    <div className="flex justify-between">
                      <span>10-19 Rappers</span>
                      <span>2 Artdrops</span>
                    </div>
                    <div className="flex justify-between">
                      <span>20-29 Rappers</span>
                      <span>3 Artdrops</span>
                    </div>
                    <div className="flex justify-between">
                      <span>30-39 Rappers</span>
                      <span>4 Artdrops</span>
                    </div>
                    <div className="flex justify-between">
                      <span>40-49 Rappers</span>
                      <span>5 Artdrops</span>
                    </div>
                    <div className="flex justify-between">
                      <span>50+ Rappers</span>
                      <span>6 Artdrops (maximum)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Roadmap */}
            <div className="card-anthracite p-10 space-y-8">
              <h3 className="heading-card text-xl mb-8">Development Roadmap</h3>
              <div className="space-y-8">
                <div className="border-l-4 border-gray-600 pl-8">
                  <h4 className="font-semibold mb-3 text-base">Phase 1: Launch</h4>
                  <p className="text-sm opacity-90 leading-relaxed">
                    Distribution of CryptoRappers with community building activities. Holders
                    receive Artdrops from initial partnerships. Target: 10,000 community members.
                  </p>
                </div>

                <div className="border-l-4 border-gray-600 pl-8">
                  <h4 className="font-semibold mb-3 text-base">Phase 2: Marketplace</h4>
                  <p className="text-sm opacity-90 leading-relaxed">
                    Launch dedicated Hip Hop NFT marketplace. Direct trading of Artdrops and
                    CryptoRappers. Discovery platform for Hip Hop projects.
                  </p>
                </div>

                <div className="border-l-4 border-gray-600 pl-8">
                  <h4 className="font-semibold mb-3 text-base">Phase 3: DAO</h4>
                  <p className="text-sm opacity-90 leading-relaxed">
                    Transition to full decentralization. Community governance through DAO
                    mechanisms. Complete community control over platform future.
                  </p>
                </div>
              </div>
            </div>

            {/* Market Context */}
            <div className="card-glass p-10 space-y-8">
              <h3 className="heading-card text-xl mb-8">Market Analysis</h3>
              <div className="space-y-8 text-sm opacity-90">
                <div className="space-y-3">
                  <h4 className="font-semibold mb-3 text-base">Current State of Music Industry:</h4>
                  <p className="leading-relaxed">
                    Music consumption has evolved from vinyl/tapes → CDs → mp3s → streaming. Despite
                    universal digital accessibility, fans still desire unique, ownable pieces from
                    beloved artists, as evidenced by the vinyl revival.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold mb-3 text-base">Digital Collectors Market:</h4>
                  <p className="leading-relaxed">
                    Previous blockchain efforts in Hip Hop touched distribution but missed the
                    crucial aspects of ownership and community. Platforms like Apple, YouTube,
                    Spotify addressed consumption, while Audius explored blockchain integration.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold mb-3 text-base">Our Unique Approach:</h4>
                  <p className="leading-relaxed">
                    CryptoHipHop aimed to be the first comprehensive solution combining
                    distribution, ownership, and community building specifically for Hip Hop culture
                    through innovative NFT mechanics and DAO governance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'artists',
      title: 'Artists',
      content: (
        <div className="h-full w-full px-12 pt-12 pb-20 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="heading-main text-2xl mb-6">For Artists</h2>
              <p className="text-lg opacity-90 max-w-3xl mx-auto">
                Empower your creativity with blockchain technology
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="card-glass p-8 space-y-6 text-center">
                <h3 className="heading-card text-lg mb-6">Monetize Your Music</h3>
                <p className="text-sm opacity-90 leading-relaxed mb-6">
                  Tokenize your tracks and connect directly with fans through NFTs and exclusive
                  releases. Keep more of your earnings with smart contract royalties.
                </p>
                <div className="space-y-3 text-sm opacity-75">
                  <div className="flex items-center justify-center gap-2">
                    <span>Direct fan engagement</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span>Smart contract royalties</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span>Exclusive NFT drops</span>
                  </div>
                </div>
              </div>

              <div className="card-glass p-8 space-y-6 text-center">
                <h3 className="heading-card text-lg mb-6">Build Your Brand</h3>
                <p className="text-sm opacity-90 leading-relaxed mb-6">
                  Create limited edition content, collaborate with other artists, and build a loyal
                  community around your music.
                </p>
                <div className="space-y-3 text-sm opacity-75">
                  <div className="flex items-center justify-center gap-2">
                    <span>Limited edition releases</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span>Artist collaborations</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span>Community building tools</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-anthracite p-10 space-y-8">
              <h3 className="heading-card text-xl mb-8">Artist Tools</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center space-y-4">
                  <div
                    className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--brand-anthracite)' }}
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2zM12 6v.01M12 10v.01M12 14v.01"
                      />
                    </svg>
                  </div>
                  <h4 className="heading-card text-base">Studio Integration</h4>
                  <p className="text-sm opacity-75">Upload directly from your DAW</p>
                </div>
                <div className="text-center space-y-4">
                  <div
                    className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--brand-anthracite)' }}
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h4 className="heading-card text-base">Analytics</h4>
                  <p className="text-sm opacity-75">Track performance & earnings</p>
                </div>
                <div className="text-center space-y-4">
                  <div
                    className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--brand-anthracite)' }}
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="heading-card text-base">Collaboration</h4>
                  <p className="text-sm opacity-75">Connect with other artists</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'collectors',
      title: 'Collectors',
      content: (
        <div className="h-full w-full px-12 pt-12 pb-20 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="heading-main text-2xl mb-6">For Collectors</h2>
              <p className="text-lg opacity-90 max-w-3xl mx-auto">
                Discover and collect unique musical experiences
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="card-glass p-8 space-y-6 text-center">
                <h3 className="heading-card text-lg mb-6">Rare Finds</h3>
                <p className="text-sm opacity-90 leading-relaxed mb-6">
                  Discover unique musical NFTs, rare tracks, and exclusive artist collaborations on
                  the blockchain. Be the first to own limited drops.
                </p>
                <div className="space-y-3 text-sm opacity-75">
                  <div className="flex items-center justify-center gap-2">
                    <span>Limited edition tracks</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span>Artist collaborations</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span>Exclusive content access</span>
                  </div>
                </div>
              </div>

              <div className="card-glass p-8 space-y-6 text-center">
                <h3 className="heading-card text-lg mb-6">Investment Potential</h3>
                <p className="text-sm opacity-90 leading-relaxed mb-6">
                  Build a valuable collection of music NFTs. Support emerging artists and
                  potentially profit as their careers grow.
                </p>
                <div className="space-y-3 text-sm opacity-75">
                  <div className="flex items-center justify-center gap-2">
                    <span>Portfolio tracking</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span>Artist career support</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span>Resale marketplace</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-anthracite p-10 space-y-8">
              <h3 className="heading-card text-xl mb-8">Collection Features</h3>
              <div className="space-y-6 text-sm opacity-90">
                <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'var(--brand-anthracite)' }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold">Music NFTs</div>
                      <div className="text-xs opacity-75">Original tracks & remixes</div>
                    </div>
                  </div>
                  <span
                    className="text-gray-400 px-3 py-1 rounded text-xs"
                    style={{ backgroundColor: 'var(--brand-anthracite)' }}
                  >
                    Premium
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'var(--brand-anthracite)' }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold">Live Recordings</div>
                      <div className="text-xs opacity-75">Exclusive concert captures</div>
                    </div>
                  </div>
                  <span
                    className="text-gray-400 px-3 py-1 rounded text-xs"
                    style={{ backgroundColor: 'var(--brand-anthracite)' }}
                  >
                    Rare
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'var(--brand-anthracite)' }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold">Studio Sessions</div>
                      <div className="text-xs opacity-75">Behind-the-scenes content</div>
                    </div>
                  </div>
                  <span
                    className="text-gray-400 px-3 py-1 rounded text-xs"
                    style={{ backgroundColor: 'var(--brand-anthracite)' }}
                  >
                    Limited
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'community',
      title: 'Community',
      content: (
        <div className="h-full w-full px-12 pt-12 pb-20 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="heading-main text-2xl mb-6">Community</h2>
              <p className="text-lg opacity-90 max-w-3xl mx-auto">
                Join the movement reshaping the music industry
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="card-glass p-8 text-center space-y-4">
                <div
                  className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'var(--brand-anthracite)' }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 919-9"
                    />
                  </svg>
                </div>
                <h4 className="heading-card text-base">Global Network</h4>
                <p className="text-sm opacity-75">Hip hop enthusiasts worldwide</p>
              </div>
              <div className="card-glass p-8 text-center space-y-4">
                <div
                  className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'var(--brand-anthracite)' }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                </div>
                <h4 className="heading-card text-base">Producers Hub</h4>
                <p className="text-sm opacity-75">Beats, samples, and collaboration</p>
              </div>
              <div className="card-glass p-8 text-center space-y-4">
                <div
                  className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'var(--brand-anthracite)' }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h4 className="heading-card text-base">Crypto Natives</h4>
                <p className="text-sm opacity-75">Blockchain music pioneers</p>
              </div>
            </div>

            <div className="card-anthracite p-10 space-y-8">
              <h3 className="heading-card text-xl mb-8 text-left">Platform Features</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <span className="text-sm">NFT Music Drops</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <span className="text-sm">Artist Royalties</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <span className="text-sm">Community Governance</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <span className="text-sm">Exclusive Content</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <span className="text-sm">Fan Engagement</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <span className="text-sm">Blockchain Integration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Loading configuration for the crypto hip hop platform
  const loadingConfig = {
    tabs: [
      { id: 'overview', title: 'Overview', priority: 'immediate' as const },
      { id: 'whitepaper', title: 'Whitepaper', priority: 'preload' as const },
      { id: 'artists', title: 'Artists', priority: 'preload' as const },
      {
        id: 'collectors',
        title: 'Collectors',
        hasGallery: true,
        imageCount: 8,
        priority: 'preload' as const,
      },
      { id: 'community', title: 'Community', priority: 'lazy' as const },
    ],
    images: [
      // Placeholder image configs for potential future NFT gallery integration
      {
        id: 'nft-1',
        src: '/placeholder/nft-track-1.jpg',
        alt: 'Hip Hop NFT Track',
        priority: 'high' as const,
        tabId: 'collectors',
      },
      {
        id: 'nft-2',
        src: '/placeholder/nft-track-2.jpg',
        alt: 'Exclusive Beat Drop',
        priority: 'medium' as const,
        tabId: 'collectors',
      },
      {
        id: 'artist-1',
        src: '/placeholder/artist-collab-1.jpg',
        alt: 'Artist Collaboration',
        priority: 'medium' as const,
        tabId: 'artists',
      },
      {
        id: 'community-1',
        src: '/placeholder/community-event-1.jpg',
        alt: 'Community Event',
        priority: 'low' as const,
        tabId: 'community',
      },
    ],
  };

  return (
    <ContentWrapper
      id="crypto-hiphop-platform"
      tabs={tabs}
      className="h-full w-full"
      loadingConfig={loadingConfig}
    />
  );
};
