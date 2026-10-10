import { useEffect, useState } from 'react';
import { Sparkles, Users, Award, ChevronRight } from 'lucide-react';
import { usePageSEO } from '../lib/usePageSEO';

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  photo: string;
  bio: string;
}

const storySections: { title: string; paragraphs: string[] }[] = [
  {
    title: 'Where Legacy Finds New Light',
    paragraphs: [
      'The word NOVA represents a star that shines with renewed brilliance. For us, it symbolises the beginning of a new chapter—one that carries traditional values into a contemporary world.',
      'NOVA was created to make genuine silver jewellery more relevant, desirable and accessible for today’s generation. Our collections bring together 92.5% sterling silver, Indian artistry and modern design, offering distinctive jewellery that evolves with changing trends without losing its timeless character.',
    ],
  },
  {
    title: 'More Than Fashion',
    paragraphs: [
      'NOVA’s purpose extends beyond creating fashionable silver jewellery. We want people to recognise silver as a precious metal that carries both emotional and material significance.',
      'At a time when rising gold prices have made precious jewellery difficult for many people to afford, silver offers a more accessible alternative. Its market value may change over time, but genuine silver retains the inherent worth of a precious metal—making it different from ordinary fashion accessories.',
      'A gift of silver is never just an object. It becomes part of someone’s story—a celebration remembered, a relationship cherished, or a moment preserved forever. As time passes, the memories it holds grow deeper, while its material value may also grow with the silver market. If it is ever needed, it can offer practical value as well.',
      'This union of beauty, emotion and enduring worth is what makes every NOVA creation meaningful.',
    ],
  },
  {
    title: 'Our Collections',
    paragraphs: [
      'Every NOVA collection is thoughtfully created for people who value individuality, quality and contemporary style. From Indian-inspired artistry to modern everyday designs, our jewellery is made to complement different personalities, occasions and stories.',
      'We aim to offer jewellery that feels special when it is purchased, personal when it is worn, and valuable when it is passed on.',
    ],
  },
];

export function About() {
  usePageSEO({
    title: 'About Us',
    description: 'NOVA is a contemporary silver jewellery brand from Utkarsh Jewellers, established in 1995. A legacy of trust, and a story of you.',
  });
  const [activeLeaderIndex, setActiveLeaderIndex] = useState(0);
  const [photoFailed, setPhotoFailed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const teamMembers: TeamMember[] = [
    {
      name: 'Utkarsh Pathak',
      role: 'Founder & Chief Executive Officer',
      initials: 'UP',
      photo: '',
      bio: 'An MBBS graduate with an entrepreneurial vision, Utkarsh Pathak chose to take his family’s jewellery legacy towards a new and ambitious future. His financial understanding, disciplined leadership and long-term outlook form the strategic foundation of NOVA. He represents the brand’s commitment to responsible growth while preserving the values established by Utkarsh Jewellers.',
    },
    {
      name: 'Akanksha Jain',
      role: 'Co-Founder & Creative Director',
      initials: 'AJ',
      photo: '',
      bio: 'With a Bachelor’s degree in Architecture, Akanksha Jain brings creativity, structure and a refined design perspective to NOVA. Her thoughtful approach has played an important role in shaping the brand’s visual identity and contemporary character. Dedicated and detail-oriented, she ensures that NOVA communicates elegance and meaning through every creative expression.',
    },
    {
      name: 'Gaurav Gurjar',
      role: 'Co-Founder & Technology Head',
      initials: 'GG',
      photo: '/gaurav_gurjar.png',
      bio: 'A BCA and MCA graduate, Gaurav Gurjar brings technical expertise and a forward-looking digital vision to the brand. His calm, solution-driven approach strengthens NOVA’s online foundation and supports its ambition to offer customers a reliable and seamless digital experience.',
    },
    {
      name: 'Rishi Yadav',
      role: 'Co-Founder & Media Head',
      initials: 'RY',
      photo: '',
      bio: 'With an academic background in Journalism and Mass Communication, and a Master’s specialisation in Men’s Still Photography, Rishi Yadav brings a strong understanding of storytelling, photography and digital media to NOVA. His creative perspective helps the brand connect with modern audiences and present its collections through memorable visual stories.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-nova-darker font-sans">
      <section className="container mx-auto px-6 md:px-12 max-w-3xl pt-16 md:pt-24 pb-4">
        <div className="text-center mb-10">
          <span className="text-nova-dark text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] block mb-3">About NOVA</span>
          <h1 className="text-3xl md:text-5xl font-serif tracking-wide font-light text-nova-darker">
            A Legacy of Trust. A Story of You.
          </h1>
          <div className="w-20 h-px bg-nova-gold mx-auto mt-5"></div>
        </div>

        <div className="space-y-5 text-nova-dark/80 text-sm md:text-base leading-relaxed font-light">
          <p>
            Some jewellery is chosen for its beauty. Some is treasured for its memories. At NOVA, we believe it can be both—a reflection of your personal style and something meaningful that stays with you through life.
          </p>
          <p>
            NOVA is a contemporary silver jewellery brand backed by the trusted heritage of Utkarsh Jewellers, established in 1995. For more than three decades, Utkarsh Jewellers has served generations of customers through gold and silver jewellery. This enduring foundation of experience, integrity and customer relationships now finds a modern expression through NOVA.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 md:px-12 max-w-3xl py-12 md:py-16 space-y-14">
        {storySections.map((section) => (
          <article key={section.title}>
            <h2 className="text-2xl md:text-3xl font-serif tracking-wide font-light text-nova-darker mb-4">
              {section.title}
            </h2>
            <div className="w-12 h-px bg-nova-gold mb-6"></div>
            <div className="space-y-4 text-nova-dark/80 text-sm md:text-base leading-relaxed font-light">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="bg-nova-light py-16 md:py-24 border-y border-nova-gold/15">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-nova-gold/25 bg-nova-gold/5 mb-4">
              <Users className="w-4 h-4 text-nova-gold-dark" />
              <span className="text-[10px] text-nova-gold-dark font-semibold uppercase tracking-wider">Leadership</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif tracking-wide font-light text-nova-darker mb-4">
              The Minds Behind NOVA
            </h2>
            <div className="w-12 h-px bg-nova-gold mx-auto mb-5"></div>
            <p className="text-nova-dark/75 text-sm md:text-base font-light leading-relaxed">
              NOVA was brought to life by four individuals from different professional backgrounds, united by one shared vision: to build a modern jewellery brand rooted in trust, creativity and purpose.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-4 flex flex-col gap-4">
              {teamMembers.map((member, index) => {
                const isActive = activeLeaderIndex === index;
                return (
                  <button
                    key={member.name}
                    type="button"
                    onClick={() => {
                      setPhotoFailed(false);
                      setActiveLeaderIndex(index);
                    }}
                    className={`text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 cursor-pointer relative overflow-hidden group w-full ${
                      isActive
                        ? 'bg-white border-nova-gold/50 shadow-md'
                        : 'bg-white/70 border-nova-dark/10 hover:border-nova-gold/30'
                    }`}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-nova-gold"></div>}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                        isActive ? 'border-nova-gold bg-nova-gold/10' : 'border-nova-dark/10 bg-white'
                      }`}
                    >
                      <span className={`text-xs font-semibold font-serif ${isActive ? 'text-nova-gold-dark' : 'text-nova-dark/70'}`}>
                        {member.initials}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-serif font-light tracking-wide ${isActive ? 'text-nova-darker' : 'text-nova-dark/80'}`}>
                        {member.name}
                      </h3>
                      <p className="text-[10px] text-nova-dark/55 uppercase tracking-wider mt-0.5 font-medium leading-snug">
                        {member.role}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-nova-gold-dark' : 'text-nova-dark/25'}`} />
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl border border-nova-dark/10 p-6 md:p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-stretch h-full">
                <div className="w-full max-w-[240px] md:w-[240px] aspect-square md:aspect-auto md:min-h-[280px] rounded-xl overflow-hidden border border-nova-dark/10 bg-nova-light flex items-center justify-center shrink-0">
                  {teamMembers[activeLeaderIndex].photo && !photoFailed ? (
                    <img
                      src={teamMembers[activeLeaderIndex].photo}
                      alt={teamMembers[activeLeaderIndex].name}
                      className="w-full h-full object-cover"
                      onError={() => setPhotoFailed(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6">
                      <div className="w-24 h-24 rounded-full bg-white border border-nova-gold/30 flex items-center justify-center shadow-sm">
                        <span className="text-4xl font-serif text-nova-gold-dark font-semibold tracking-wide">
                          {teamMembers[activeLeaderIndex].initials}
                        </span>
                      </div>
                      <span className="text-[9px] text-nova-gold-dark tracking-[0.25em] uppercase font-semibold mt-4">
                        Since 1995
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-center py-2" key={activeLeaderIndex}>
                  <span className="text-[10px] text-nova-gold-dark font-semibold uppercase tracking-[0.2em] block mb-1">
                    {teamMembers[activeLeaderIndex].role}
                  </span>
                  <h3 className="text-2xl font-serif text-nova-darker tracking-wide font-light mb-4">
                    {teamMembers[activeLeaderIndex].name}
                  </h3>
                  <div className="w-12 h-px bg-nova-gold/70 mb-6"></div>
                  <p className="text-nova-dark/80 text-sm md:text-base leading-relaxed font-light">
                    {teamMembers[activeLeaderIndex].bio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 md:px-12 max-w-3xl py-16 md:py-20">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-5 h-5 text-nova-gold-dark" />
          <h2 className="text-2xl md:text-3xl font-serif tracking-wide font-light text-nova-darker">Our Vision</h2>
        </div>
        <div className="w-12 h-px bg-nova-gold mb-6"></div>
        <div className="space-y-4 text-nova-dark/80 text-sm md:text-base leading-relaxed font-light">
          <p>
            We envision NOVA becoming a trusted jewellery name across India—first through our online platform, then through dedicated NOVA stores, and eventually through a strong presence at selected retail jewellery outlets.
          </p>
          <p>
            Our ambition is to make NOVA accessible wherever people search for genuine, contemporary and meaningful silver jewellery. We want every customer to recognise the NOVA name as a symbol of dependable quality, modern design and lasting trust.
          </p>
          <p>
            We are not building NOVA only for today. We are building it for the moments, memories and generations yet to come.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-nova-gold/15 bg-nova-light">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <Sparkles className="w-5 h-5 text-nova-gold-dark mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-serif tracking-wide font-light text-nova-darker mb-4">Our Promise</h2>
          <div className="w-12 h-px bg-nova-gold mx-auto mb-6"></div>
          <p className="text-lg md:text-xl font-serif text-nova-darker font-light mb-6">
            Tradition is our foundation. Innovation is our path. Trust is our promise.
          </p>
          <p className="text-nova-dark/80 text-sm md:text-base leading-relaxed font-light mb-8">
            Every NOVA creation is designed to become part of your journey—celebrating who you are today, preserving the moments you cherish and carrying their meaning into tomorrow.
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-nova-gold-dark">NOVA</p>
          <p className="mt-2 font-serif text-nova-darker text-lg font-light">A Legacy of Trust. A Story of You.</p>
        </div>
      </section>
    </div>
  );
}
