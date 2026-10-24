import { normalize } from './search'

// Wraps the part of `text` that matches `query` in <mark>. Works because NFD-normalising
// accented Latin text keeps base letters in place, so indexes line up after stripping marks.
export default function Highlight({ text, query }) {
  const q = normalize(query)
  if (!q) return text
  const plain = normalize(text)
  const i = plain.indexOf(q)
  if (i === -1 || plain.length !== text.length) return text
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}
