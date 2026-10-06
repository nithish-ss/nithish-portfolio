/** Renders a name with its last character in the accent gradient: "Nithish S". */
export function NameMark({ name }: { name: string }) {
  return (
    <>
      {name.slice(0, -1)}
      <span className="text-gradient">{name.slice(-1)}</span>
    </>
  );
}
