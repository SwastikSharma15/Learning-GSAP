import { useGSAP } from "@gsap/react";
import { SplitText, ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";

gsap.registerPlugin(SplitText, ScrollTrigger);

const Hero = () => {

  const videoRef = useRef();
  const titleRef = useRef();
  const titleSplitRef = useRef(null);

  const isMobile = useMediaQuery({maxWidth: 767})

  useGSAP(() => {
    let cancelled = false;

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const waitForFonts = async () => {
      try {
        // Wait for all fonts
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
          // Additionally wait (briefly) for the key display font
          if (document.fonts.check("1em 'Modern Negra'") === false) {
            const start = performance.now();
            while (!cancelled && !document.fonts.check("1em 'Modern Negra'") && performance.now() - start < 2000) {
              await sleep(50);
            }
          }
        } else {
          // Fallback if FontFaceSet unsupported
          await sleep(300);
        }
      } catch (_) {
        // Ignore and continue
      }
    };

    (async () => {
      await waitForFonts();
      if (cancelled) return;

      // Split the title into characters (guard against double-invoke in StrictMode)
      if (titleRef.current && !titleSplitRef.current) {
        try {
          const heroSplit = new SplitText(titleRef.current, { type: 'chars' });
          titleSplitRef.current = heroSplit;
          // Don't add text-gradient here - let CSS handle it
          // heroSplit.chars.forEach((char) => char.classList.add('text-gradient'));

          // Title intro animation - stays visible after animating in
          gsap.from(heroSplit.chars, {
            yPercent: 100,
            duration: 1.6,
            ease: 'expo.out',
            stagger: 0.05,
            opacity: 0,
          });
        } catch (e) {
          // If SplitText fails, revert to original text
          if (titleSplitRef.current) {
            titleSplitRef.current.revert();
            titleSplitRef.current = null;
          }
        }
      }

      // Paragraph split/animation (after fonts for consistent line wrapping)
      const paragraphSplit = new SplitText('.subtitle', { type: 'lines' });
      gsap.from(paragraphSplit.lines, {
        yPercent: 100,
        duration: 1.8,
        opacity: 0,
        ease: 'expo.out',
        stagger: 0.05,
        delay: 1,
      });

      // Parallax leaves
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
        .to('.right-leaf', { y: 200 }, 0)
        .to('.left-leaf', { y: -200 }, 0);

      const startValue = isMobile ? 'top 50%' : 'center 60%';
      const endValue = isMobile ? '120% top' : 'bottom top';

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: videoRef.current || 'video',
          start: startValue,
          end: endValue,
          scrub: true,
          pin: true,
        },
      });
      if (videoRef.current) {
        videoRef.current.onloadedmetadata = () => {
          tl.to(videoRef.current, {
            currentTime: videoRef.current.duration,
          });
        };
      }
    })();

    // Cleanup: revert SplitText to avoid duplicate wrappers
    return () => {
      cancelled = true;
      if (titleSplitRef.current) {
        titleSplitRef.current.revert();
        titleSplitRef.current = null;
      }
    }
  }, []);

  return (
    <>
      <section id="hero" className="noisy">
        <h1 ref={titleRef} className="title text-gradient">MOJITO</h1>
        <h1 ref={titleRef} className="title text-gradient">MOJITO</h1>
        <img
          src="/images/hero-left-leaf.png"
          alt="left-leaf"
          className="left-leaf"
        />
        <img
          src="/images/hero-right-leaf.png"
          alt="right-leaf"
          className="right-leaf"
        />
        <div className="body">
          <div className="content mb-10">
            <div className="space-y-5 hidden md:block">
              <p className="subtitle">
                Cool. Crisp. Classic.
              </p>
              <p className="subtitle">
                Sip the spirit <br /> of Summer
              </p>
            </div>
            <div className="view-cocktails">
              <p className="subtitle">
                Every cocktail on our menu is a blend-of-premium-ingredients, creative-flair and-timeless-recipes — designed to delight your senses.
              </p>
              <a href="#cocktails"> 
                View cocktails
              </a>
            </div>
          </div>
        </div>
      </section>
      <div className="video absolute inset-0">
        <video 
          src="/videos/output.mp4"
          muted
          playsInline
          preload="auto"
          ref={videoRef}
        />
      </div>
    </>
  );
};

export default Hero;