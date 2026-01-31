const emoji = '🕶️';
console.log('Emoji:', emoji);
console.log('Length:', emoji.length);
console.log('Code points:', Array.from(emoji).map(c => 'U+' + c.codePointAt(0).toString(16).toUpperCase()).join(' '));
