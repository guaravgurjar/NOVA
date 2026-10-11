import { useEffect } from 'react';
import { Sparkles, Award } from 'lucide-react';
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
            <section className="container mx-auto px-6 md:px-16 max-w-5xl pt-16 md:pt-24 pb-8">
                <div className="text-center mb-12">
                    <span className="text-nova-dark text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] block mb-3">About NOVA</span>
                    <h1 className="text-3xl md:text-5xl font-serif tracking-wide font-light text-nova-darker">
                        A Legacy of Trust. A Story of You.
                    </h1>
                    <div className="w-20 h-px bg-nova-gold mx-auto mt-5"></div>
                </div>

                <div className="space-y-6 text-nova-dark/80 text-base md:text-lg leading-relaxed font-light">
                    <p>
                        Some jewellery is chosen for its beauty. Some is treasured for its memories. At NOVA, we believe it can be both—a reflection of your personal style and something meaningful that stays with you through life.
                    </p>
                    <p>
                        NOVA is a contemporary silver jewellery brand backed by the trusted heritage of Utkarsh Jewellers, established in 1995. For more than three decades, Utkarsh Jewellers has served generations of customers through gold and silver jewellery. This enduring foundation of experience, integrity and customer relationships now finds a modern expression through NOVA.
                    </p>
                </div>
            </section>

            <section className="container mx-auto px-6 md:px-16 max-w-5xl py-14 md:py-20 space-y-16">
                {storySections.map((section) => (
                    <article key={section.title}>
                        <h2 className="text-2xl md:text-3xl font-serif tracking-wide font-light text-nova-darker mb-4">
                            {section.title}
                        </h2>
                        <div className="w-12 h-px bg-nova-gold mb-7"></div>
                        <div className="space-y-5 text-nova-dark/80 text-base md:text-lg leading-relaxed font-light">
                            {section.paragraphs.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                        </div>
                    </article>
                ))}
            </section>

            <section className="container mx-auto px-6 md:px-16 max-w-5xl py-14 md:py-20">
                <h2 className="text-3xl md:text-3xl font-serif tracking-wide font-light text-nova-darker mb-4">
                    The Minds Behind NOVA
                </h2>
                <div className="w-12 h-px bg-nova-gold mb-7"></div>
                <p className="text-nova-dark/80 text-base md:text-lg leading-relaxed font-light mb-12">
                    NOVA was brought to life by four individuals from different professional backgrounds, united by one shared vision: to build a modern jewellery brand rooted in trust, creativity and purpose.
                </p>
                <div className="space-y-12">
                    {teamMembers.map((member) => (
                        <div key={member.name}>
                            <h3 className="text-lg md:text-3xl font-serif font-light tracking-wide text-nova-darker">{member.name}</h3>
                            <p className="text-[20px] text-nova-gold-dark uppercase tracking-[0.2em] font-semibold mt-1 mb-4">{member.role}</p>
                            <p className="text-nova-dark/80 text-base md:text-lg leading-relaxed font-light">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="container mx-auto px-6 md:px-16 max-w-5xl py-14 md:py-20">
                <div className="flex items-center gap-3 mb-4">
                    <Award className="w-5 h-5 text-nova-gold-dark" />
                    <h2 className="text-2xl md:text-3xl font-serif tracking-wide font-light text-nova-darker">Our Vision</h2>
                </div>
                <div className="w-12 h-px bg-nova-gold mb-7"></div>
                <div className="space-y-5 text-nova-dark/80 text-base md:text-lg leading-relaxed font-light">
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

            <section className="py-20 md:py-28 border-t border-nova-gold/15 bg-nova-light">
                <div className="container mx-auto px-6 md:px-16 max-w-5xl text-center">
                    <Sparkles className="w-5 h-5 text-nova-gold-dark mx-auto mb-4" />
                    <h2 className="text-2xl md:text-3xl font-serif tracking-wide font-light text-nova-darker mb-4">Our Promise</h2>
                    <div className="w-12 h-px bg-nova-gold mx-auto mb-7"></div>
                    <p className="text-xl md:text-2xl font-serif text-nova-darker font-light mb-7">
                        Tradition is our foundation. Innovation is our path. Trust is our promise.
                    </p>
                    <p className="text-nova-dark/80 text-base md:text-lg leading-relaxed font-light mb-10 max-w-3xl mx-auto">
                        Every NOVA creation is designed to become part of your journey—celebrating who you are today, preserving the moments you cherish and carrying their meaning into tomorrow.
                    </p>
                    <img src="/images/banners/logo_new.webp" alt="NOVA" className="h-18 mx-auto object-contain" />
                    <p className="mt-2 font-serif text-nova-darker text-xl font-light">A Legacy of Trust. A Story of You.</p>
                </div>
            </section>
        </div>
    );
}
