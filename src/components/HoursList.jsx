// Opening hours for a branch, or a prompt to call when hours haven't been set in src/config/site.js.
export default function HoursList({ branch }) {
  if (!branch.hours?.length) return <p className="hours hours--unset">Call the branch for today’s hours</p>;
  return (
    <dl className="hours">
      {branch.hours.map((row) => (
        <div key={row.days}>
          <dt>{row.days}</dt>
          <dd>
            {row.open} – {row.close}
          </dd>
        </div>
      ))}
    </dl>
  );
}
