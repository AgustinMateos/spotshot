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
    <div className=" py-16 overflow-hidden"style={{ background: "var(--Background-Primary-light, #F1F7FE)" }}>
      <div className="max-w-full  space-y-12">

        {/* Primera fila - Disfruta el momento */}
        <div className="overflow-hidden">
          <div className="flex animate-marquesina items-center gap-8 whitespace-nowrap">
            {[...images, ...images].map((src, index) => (
              <div key={index} className="flex items-center gap-8 flex-shrink-0">
                <div className="w-[341px] h-[97px] rounded-3xl overflow-hidden flex-shrink-0">
                  <Image
                    src={src}
                    alt="Surf"
                    width={400}
                    height={220}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-4xl font-semibold text-gray-900">
                  Disfruta el momento
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Segunda fila - Nosotros lo capturamos */}
        <div className="overflow-hidden">
          <div className="flex animate-marquesina-reverse items-center gap-8 whitespace-nowrap">
            {[...images, ...images].map((src, index) => (
              <div key={index} className="flex items-center gap-8 shrink-0">
                <div className="w-85.25 h-24.25 rounded-3xl overflow-hidden shrink-0">
                  <Image
                    src={src}
                    alt="Surf"
                    width={400}
                    height={220}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-4xl font-semibold text-gray-900">
                  Nosotros lo capturamos
                </h3>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}