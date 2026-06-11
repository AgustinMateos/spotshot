import Image from "next/image";

const images = [
  "/marquesina/1.webp",
  "/marquesina/2.webp",
  "/marquesina/3.webp",
  "/marquesina/4.webp",
  "/marquesina/5.webp",
  "/marquesina/6.webp",
  "/marquesina/7.webp",
  "/marquesina/8.webp",
  "/marquesina/9.webp",
  "/marquesina/10.webp",
    "/marquesina/11.webp",
      "/marquesina/12.webp",
];

// Fila 1: imágenes 0-5, Fila 2: imágenes 6-11
const row1 = images.slice(0, 6);   // 6 fotos distintas
const row2 = images.slice(6, 12);  // otras 6 fotos distintas

function MarquesinaRow({ items, text, reverse = false }) {
  const content = (
    <div className="flex items-center gap-8 shrink-0">
      {items.slice(0, 3).map((src, idx) => (
        <div key={idx} className="w-[341px] h-40 rounded-3xl overflow-hidden shrink-0">
          <Image src={src} alt="Surf" width={341} height={160} className="w-full h-40 object-cover" />
        </div>
      ))}
      <h3 className="text-5xl font-normal text-[#1E3A5F] px-8 whitespace-nowrap shrink-0">
        {text}
      </h3>
      {items.slice(3, 6).map((src, idx) => (
        <div key={idx} className="w-[341px] h-40 rounded-3xl overflow-hidden shrink-0">
          <Image src={src} alt="Surf" width={341} height={160} className="w-full h-40 object-cover" />
        </div>
      ))}
    </div>
  );

  
    return (
  <div className="overflow-hidden">
    <div className={`flex gap-8 ${reverse ? "animate-marquesina-reverse" : "animate-marquesina"}`}>
      {content}
      {content}
    </div>
  </div>
);
  
}

export default function Marquesina() {
  return (
    <div
      className="py-16 overflow-hidden space-y-12"
      style={{ background: "var(--Background-Primary-light, #F1F7FE)" }}
    >
      <MarquesinaRow
        items={row1}
        text={<>Disfruta el <strong>momento</strong></>}
      />
      <MarquesinaRow
        items={row2}
        text={<>Nosotros lo <strong>capturamos</strong></>}
        reverse
      />
    </div>
  );
}