import StatusBadge from "../ui/StatusBadge";

const formatDateTime = (
  value
) =>
  value
    ? new Date(value)
        .toLocaleString()
    : "-";

const EmailConversationList = ({
  conversations,
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <h3 className="text-lg font-semibold text-slate-900">
      Email Conversations
    </h3>

    <div className="mt-5 space-y-4">
      {conversations.length ===
      0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
          No email conversations yet.
        </div>
      ) : (
        conversations.map(
          (conversation) => (
            <article
              key={
                conversation.id
              }
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {
                      conversation.subject
                    }
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Last message{" "}
                    {formatDateTime(
                      conversation.lastMessageAt
                    )}
                  </p>
                </div>

                <span className="text-xs text-slate-500">
                  {
                    conversation.messages
                      .length
                  }{" "}
                  messages
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {conversation.messages
                  .slice(0, 3)
                  .map(
                    (
                      message
                    ) => (
                      <div
                        key={
                          message.id
                        }
                        className="rounded-2xl border border-slate-200 bg-white p-4"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge
                            value={
                              message.direction
                            }
                            className="px-2.5"
                          />
                          <StatusBadge
                            value={
                              message.status
                            }
                            className="px-2.5"
                          />
                          <span className="text-xs text-slate-400">
                            {formatDateTime(
                              message.createdAt
                            )}
                          </span>
                        </div>

                        <p className="mt-3 text-sm font-medium text-slate-900">
                          {message.subject}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          From{" "}
                          {
                            message.fromEmail
                          }{" "}
                          to{" "}
                          {
                            message.toEmail
                          }
                        </p>
                        <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">
                          {message.bodyText}
                        </p>
                      </div>
                    )
                  )}
              </div>
            </article>
          )
        )
      )}
    </div>
  </section>
);

export default EmailConversationList;
