import Image from "next/image";

const RESPONSE_IMAGE_SRC = "/images/response-section.png";

/**
 * Full-viewport background image before the footer.
 */
export const ResponseVideoSection = () => {
  return (
    <section
      id="contact"
      className="relative min-h-screen w-full overflow-hidden bg-black"
      aria-label="Ministry gathering"
    >
      <Image
        src={RESPONSE_IMAGE_SRC}
        alt="Large gathering of young people at a JLP ministry event"
        fill
        sizes="100vw"
        quality={100}
        unoptimized
        priority
        className="object-cover object-center"
      />

      <div
        className="absolute bottom-0 left-0 right-0 z-10 h-1.5 bg-red-600"
        aria-hidden="true"
      />
    </section>
  );
};
