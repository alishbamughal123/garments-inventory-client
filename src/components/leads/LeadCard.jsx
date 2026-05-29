const LeadCard = ({
  lead,
}) => {
  return (
    <div className="bg-white rounded shadow p-3 mb-3">
      <h3>
        {lead.fullName}
      </h3>

      <p>
        {
          lead.companyName
        }
      </p>

      <p>
        Rs.
        {
          lead.expectedDealValue
        }
      </p>
    </div>
  );
};

export default LeadCard;