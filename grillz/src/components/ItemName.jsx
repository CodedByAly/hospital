/** Item name with the part the menu board prints in orange ("GRILLZ <BBQ>"). */
export default function ItemName({ item }) {
  const { name, accent } = item;
  const i = accent ? name.toLowerCase().lastIndexOf(accent.toLowerCase()) : -1;
  if (i < 0) return name;
  return (
    <>
      {name.slice(0, i)}
      <span className="accent">{name.slice(i, i + accent.length)}</span>
      {name.slice(i + accent.length)}
    </>
  );
}
