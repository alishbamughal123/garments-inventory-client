import {
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

const CategoryTable = ({
  categories,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:hidden">
        {categories?.map(
          (category) => (
            <article
              key={category.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-base font-semibold text-slate-900">
                {category.name}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {category.description ||
                  "No description provided."}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    onEdit(category)
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] px-3 py-2 text-sm font-medium text-[var(--color-primary-ink)]"
                >
                  <FiEdit2 />
                  Edit
                </button>

                <button
                  onClick={() =>
                    onDelete(
                      category.id
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 px-3 py-2 text-sm font-medium text-red-600"
                >
                  <FiTrash2 />
                  Delete
                </button>
              </div>
            </article>
          )
        )}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-[640px] w-full">
            <thead>
              <tr className="bg-slate-50 text-sm text-slate-600">
                <th className="p-4 text-left">
                  Category
                </th>
                <th className="p-4 text-left">
                  Description
                </th>
                <th className="p-4 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {categories?.map(
                (category) => (
                  <tr
                    key={category.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="p-4 font-medium">
                      {category.name}
                    </td>
                    <td className="p-4 text-slate-500">
                      {
                        category.description
                      }
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            onEdit(
                              category
                            )
                          }
                          className="rounded-lg bg-[var(--color-primary-soft)] p-2 text-[var(--color-primary-ink)] hover:bg-[var(--color-primary-muted)]"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          onClick={() =>
                            onDelete(
                              category.id
                            )
                          }
                          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryTable;
