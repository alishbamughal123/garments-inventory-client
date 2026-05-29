import LeadCard from "./LeadCard";

const LeadColumn = ({
  title,
  leads,
}) => {
  return (
    <div className="w-80 bg-gray-100 rounded p-4">
      <h2 className="font-bold mb-4">
        {title}
      </h2>

      {leads.map(
        (lead) => (
          <LeadCard
            key={
              lead.id
            }
            lead={
              lead
            }
          />
        )
      )}
    </div>
  );
};

export default LeadColumn;