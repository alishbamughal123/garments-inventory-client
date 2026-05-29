const ActivityTimeline =
  ({
    activities,
  }) => {
    return (
      <div>
        {activities.map(
          (
            activity
          ) => (
            <div
              key={
                activity.id
              }
              className="border-l pl-4 mb-4"
            >
              <h4>
                {
                  activity.activityType
                }
              </h4>

              <p>
                {
                  activity.subject
                }
              </p>

              <small>
                {new Date(
                  activity.createdAt
                ).toLocaleString()}
              </small>
            </div>
          )
        )}
      </div>
    );
  };

export default ActivityTimeline;