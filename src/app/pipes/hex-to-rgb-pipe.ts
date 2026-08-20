import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hexToRgb',
  standalone: true,
})
export class HexToRgbPipe implements PipeTransform {
  transform(hex: string | undefined): string {
    if (!hex) return '92, 61, 46';

    if (hex.startsWith('rgb')) {
      const match = hex.match(/\d+/g);
      if (match) return match.slice(0, 3).join(', ');
      return '92, 61, 46';
    }

    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex
        .split('')
        .map((c) => c + c)
        .join('');
    }

    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    return `${r}, ${g}, ${b}`;
  }
}
