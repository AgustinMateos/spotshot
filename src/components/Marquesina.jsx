import Image from "next/image";

const images = [
  "/marquesina/1.svg",
  "/marquesina/2.svg",
  "/marquesina/3.svg",
  "/marquesina/4.svg",
  "/marquesina/5.svg",
  "/marquesina/6.svg",
  "/marquesina/7.svg",
];

export default function Marquesina() {
  return (
    <div className="py-16 overflow-hidden" style={{ background: "var(--Background-Primary-light, #F1F7FE)" }}>
      <div className="max-w-full space-y-12">

        {/* Primera fila - Disfruta el momento */}
        <div className="overflow-hidden">
          <div className="flex animate-marquesina items-center gap-8 whitespace-nowrap">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 shrink-0">
                {/* 3 Fotos + Texto + 3 Fotos */}
                {images.slice(0, 3).map((src, idx) => (
                  <div key={idx} className="w-85.25 h-40 rounded-3xl overflow-hidden shrink-0">
                    <div key={idx} className="w-85.25 h-40 rounded-3xl overflow-hidden shrink-0">
                    <Image
                      src={src}
                      alt="Surf"
                      width={341}
                      height={97}
                      className="w-85.25 h-40 object-contain"
                    />
                  </div>
                  </div>
                ))}

                <h3 className="text-5xl font-normal text-[#1E3A5F] px-8 whitespace-nowrap">
                  Disfruta el <strong>momento</strong> 
                </h3>

                {images.slice(3, 6).map((src, idx) => (
                 <div key={idx} className="w-85.25 h-40 rounded-3xl overflow-hidden shrink-0">
                    <Image
                      src={src}
                      alt="Surf"
                      width={341}
                      height={97}
                      className="w-85.25 h-40 object-contain"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Segunda fila - Nosotros lo capturamos (dirección inversa) */}
        <div className="overflow-hidden">
          <div className="flex animate-marquesina-reverse items-center gap-8 whitespace-nowrap">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 shrink-0">
                {/* 3 Fotos + Texto + 3 Fotos */}
                {images.slice(0, 3).map((src, idx) => (
                  <div key={idx} className="w-85.25 h-40 rounded-3xl overflow-hidden shrink-0">
                    <Image
                      src={src}
                      alt="Surf"
                      width={341}
                      height={97}
                      className="w-85.25 h-40 object-contain"
                    />
                  </div>
                ))}

                <h3 className="text-5xl font-normal text-[#1E3A5F] px-8 whitespace-nowrap">
                  Nosotros lo  <strong>capturamos</strong> 
                </h3>

                {images.slice(3, 6).map((src, idx) => (
                  <div key={idx} className="w-85.25 h-40 rounded-3xl overflow-hidden shrink-0">
                    <Image
                      src={src}
                      alt="Surf"
                      width={341}
                      height={97}
                      className="w-85.25 h-40 object-contain"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}