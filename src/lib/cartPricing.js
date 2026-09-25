// Calcula el total del carrito agrupando por sesión.
//
// Cada item del carrito debe traer `sessionId`, `unitPrice` y
// `billablePhotoCap` (seteados en CartContext al agregarlo).
//
// - Si la sesión tiene billablePhotoCap (escuelas): se cobran como
//   máximo esa cantidad de fotos de esa sesión; el resto son gratis.
// - Si no tiene cap (free surfers / spotshot general): se aplica el
//   descuento por pack según la cantidad de ESA sesión (no del carrito global).
export function calculateCartTotals(cart) {
  const sessionGroups = new Map();

  for (const item of cart) {
    const key = item.sessionId || item.id;
    if (!sessionGroups.has(key)) sessionGroups.set(key, []);
    sessionGroups.get(key).push(item);
  }

  let subtotal = 0;
  let totalToPay = 0;
  let packName = '';

  for (const items of sessionGroups.values()) {
    const count = items.length;
    const unitPrice = items[0]?.unitPrice ?? 8;
    const billablePhotoCap = items[0]?.billablePhotoCap ?? null;
    const sessionSubtotal = count * unitPrice;
    subtotal += sessionSubtotal;

    if (billablePhotoCap != null) {
      const billableCount = Math.min(count, billablePhotoCap);
      totalToPay += billableCount * unitPrice;
    } else {
      let sessionDiscount = 0;
      if (count >= 10) {
        sessionDiscount = sessionSubtotal * 0.4;
        packName = 'Pack 10 fotos (-40%)';
      } else if (count >= 5) {
        sessionDiscount = sessionSubtotal * 0.2;
        packName = 'Pack 5 fotos (-20%)';
      }
      totalToPay += sessionSubtotal - sessionDiscount;
    }
  }

  return {
    totalPhotos: cart.length,
    subtotal,
    discount: subtotal - totalToPay,
    totalToPay,
    packName,
  };
}
