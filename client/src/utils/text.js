// Return an emoji given the unicode
// https://unicode.org/emoji/charts/full-emoji-list.html
export function getEmoji(code) {
    return String.fromCodePoint(code);
}